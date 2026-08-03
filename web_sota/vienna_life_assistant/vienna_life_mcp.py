"""vienna_life portmanteau — P3 life admin MCP surface (FastMCP 3.2+ SOTA).

Backed by the ViLife SQLite store (web_sota/data/vilife.db) — calendar,
todos, expenses, health, travel, contacts, and household data persist and
are editable through both MCP and REST. Seed data is loaded on first run.
"""

from __future__ import annotations
import logging
from datetime import date
from pathlib import Path
from typing import Any, Literal

from fastmcp import Context, FastMCP
from fastmcp.prompts import Message

from vienna_life_assistant import life_db
from vienna_life_assistant.db import SessionLocal
from vienna_life_assistant.models import (
    CalendarEvent,
    Contact,
    DoctorVisit,
    Expense,
    HomeTask,
    JournalEntry,
    MedicalCondition,
    Medication,
    PackingItem,
    PetCareEvent,
    Subscription,
    Todo,
    TravelDocument,
    Trip,
    Vitals,
)

logger = logging.getLogger("vienna-life-assistant.mcp")

_READ_ONLY = {"readonly": True}
_MUTATING = {}

mcp = FastMCP(
    "vienna-life-mcp",
    instructions=(
        "Vienna Life Assistant (ViLife) — human carrier for life admin. "
        "Portmanteaus: vienna_life (daily ops), vienna_health (doctor visits, "
        "medications, vitals), vienna_travel (trips, packing, documents), "
        "vienna_contacts (people, birthdays), vienna_household (subscriptions, "
        "home tasks, pet care), vienna_log (personal journal), vienna_news "
        "(aiwatcher-fed news). Agentic vienna_life_agentic; resources "
        "resource://vienna-life/*; skill://vienna-life/SKILL.md."
    ),
)


def _error_response(error: str, error_type: str = "general", **kwargs) -> dict:
    """Auto-logging error response — traceback logged before returning."""
    logger.exception("Tool error: %s [%s]", error, error_type)
    return {"success": False, "error": error, "error_type": error_type, **kwargs}


# --- Entity CRUD helper ------------------------------------------------------


def _entity_crud(
    db, model, label: str, op: str, data: dict | None = None, row_id: int | None = None
) -> dict:
    """list/add/update/delete for any model with a consistent return shape."""
    if op.endswith("_add"):
        row = life_db.add_row(db, model, data or {})
        return {
            "success": True,
            "message": f"{label} added (id {row.id})",
            "item": row.to_dict(),
        }
    if op.endswith("_update"):
        row = life_db.update_row(db, model, row_id or 0, data or {})
        if row is None:
            return _error_response(f"{label} {row_id} not found", "not_found")
        return {"success": True, "message": f"{label} updated", "item": row.to_dict()}
    if op.endswith("_delete"):
        if not life_db.delete_row(db, model, row_id or 0):
            return _error_response(f"{label} {row_id} not found", "not_found")
        return {"success": True, "message": f"{label} deleted"}
    order = (
        getattr(model, "date", None)
        or getattr(model, "name", None)
        or getattr(model, "renewal_date", None)
    )
    rows = life_db.list_rows(db, model, order_by=order)
    return {
        "success": True,
        "message": f"{len(rows)} {label}",
        "items": [r.to_dict() for r in rows],
    }


@mcp.resource("resource://vienna-life/capabilities")
def vienna_life_capabilities_resource() -> str:
    return """# vienna-life-assistant capabilities (FastMCP 3.2+)

## Portmanteaus
- `vienna_life(operation=...)` — calendar_today, event_add/update/delete, todo_list,
  todo_add/toggle/delete, expense_summary, expense_add/delete, shopping_list,
  life_brief, fleet_overview, health, help
- `vienna_health(operation=...)` — visits, visits_add/update/delete, meds,
  meds_add/update/delete, vitals, vitals_add, conditions, conditions_add
- `vienna_travel(operation=...)` — trips, trip_add/update/delete, packing,
  packing_add/toggle, documents, document_add/delete, expiring
- `vienna_contacts(operation=...)` — list, add, update, delete, birthdays
- `vienna_household(operation=...)` — subscriptions, subscription_add/update/delete,
  tasks, task_add/toggle/delete, pet, pet_add
- `vienna_log(operation=...)` — entries, today, add, update, delete, streak,
  on_this_day, search
- `vienna_news(operation=...)` — top, trends, search, morning, overview, stats
  (served by fleet aiwatcher :10946)

## Agentic / sampling
- `vienna_life_agentic(goal)` — multi-step Vienna life plan via host LLM sampling

## Atomic
- `vienna_tips(category)` — coffee, music, museum culture tips

## HTTP
- MCP: http://127.0.0.1:10922/mcp
- Frontend: http://127.0.0.1:10988
"""


@mcp.resource("resource://vienna-life/quickstart")
def vienna_life_quickstart_resource() -> str:
    return """# ViLife quickstart

1. vienna_life(operation="health")
2. vienna_life(operation="life_brief") — morning brief for WF-001
3. vienna_health(operation="meds") — active medications
4. vienna_contacts(operation="birthdays") — birthdays in the next 30 days
5. vienna_travel(operation="trips") — upcoming trips + countdown
6. vienna_life_agentic(goal="Plan my Alsergrund Saturday: coffee, museum, shopping")
"""


@mcp.prompt()
def life_brief_request() -> list[Message]:
    """Request a structured morning life brief for Vienna."""
    return [
        Message(
            "Produce my Vienna morning brief: calendar today, open todos, expenses month summary, "
            "urgent shopping, active medications, next doctor visit, upcoming trips and birthdays. "
            "Use vienna_life(operation='life_brief') or chain calendar_today + todo_list + "
            "vienna_health + vienna_travel + vienna_contacts.",
            role="user",
        )
    ]


@mcp.prompt()
def vienna_day_plan(focus: str = "culture") -> str:
    """Plan a Vienna day around coffee, music, museums, or shopping."""
    return (
        f"Plan a Vienna day focused on {focus} in Alsergrund. "
        "Use vienna_life for calendar/todos and vienna_tips for local culture hints."
    )


@mcp.prompt()
def alsergrund_morning() -> list[Message]:
    """Morning preprompt for Alsergrund — calendar, transit, coffee."""
    return [
        Message(
            "Guten Morgen from Alsergrund. Run vienna_life(operation='life_brief') and suggest "
            "one coffee house + U4/tram note for Friedensbrücke.",
            role="user",
        )
    ]


@mcp.prompt()
def spar_shopping_run() -> str:
    """Preprompt for Spar/Billa errand planning."""
    return (
        "Plan a Spar/Billa shopping run for Alsergrund using vienna_life(operation='shopping_list') "
        "and vienna_life(operation='expense_summary'). Highlight urgent items only."
    )


@mcp.prompt()
def wien_transit_check(station: str = "Friedensbrücke") -> str:
    """Preprompt for Wiener Linien departure planning."""
    return (
        f"Using station {station}, outline best U4/tram options now. "
        "Mention mywienerlinien (10896) and gtfs-mcp (10913) as fleet bridges."
    )


@mcp.prompt()
def kultur_abend() -> list[Message]:
    """Evening culture preprompt — concert or museum."""
    return [
        Message(
            "Suggest tonight's best culture option: Musikverein, Staatsoper Stehplatz, or Leopold Museum. "
            "Use vienna_tips and vienna_life calendar if needed.",
            role="user",
        )
    ]


@mcp.tool(annotations=_READ_ONLY)
async def vienna_tips(category: str) -> str:
    """Vienna culture tips for coffee, music, or museums (not vla-robotics).

    ## Return Format
    A plain-text tip string describing the recommended experience.

    ## Examples
    await vienna_tips(category="coffee")
    await vienna_tips(category="music")
    """
    key = category.lower()
    if key == "coffee":
        return "Try the Hausbrand at Café Berg for a perfect start in Alsergrund."
    if key == "music":
        return "Check Stehplatz tickets at the Staatsoper ~80 minutes before show — often €10–15."
    if key in ("museum", "museums"):
        return "Leopold Museum MQ: Schiele & Klimt — pair with a Café Berg stop after."
    return f"Enjoy the Viennese vibe in the {category} scene!"


@mcp.tool(annotations=_READ_ONLY)
async def vienna_life_agentic(goal: str, ctx: Context) -> dict[str, Any]:
    """Plan a multi-step Vienna life workflow using MCP sampling (SEP-1577).

    ## Return Format
    {"success": bool, "plan": str, "goal": str}

    ## Examples
    await vienna_life_agentic(goal="Plan my Saturday in Alsergrund")
    """
    result = await ctx.sample(
        messages=(
            "You are ViLife (Vienna Life Assistant). Given the user's goal, output a compact plan:\n"
            "1) One-line summary\n"
            "Then 2–5 numbered steps naming concrete tools: vienna_life (with operation=), "
            "vienna_health, vienna_travel, vienna_contacts, vienna_household, vienna_tips, "
            "fleet_call to vienna-life.\n\n"
            f"Goal:\n{goal[:3000]}"
        ),
        system_prompt="Be concise. Plain text only. No markdown fences.",
        max_tokens=600,
    )
    text = getattr(result, "text", None) or str(result)
    return {"success": True, "plan": text.strip(), "goal": goal}


@mcp.tool(annotations=_READ_ONLY)
async def vienna_life(
    operation: Literal[
        "calendar_today",
        "event_add",
        "event_update",
        "event_delete",
        "todo_list",
        "todo_add",
        "todo_toggle",
        "todo_delete",
        "expense_summary",
        "expense_add",
        "expense_delete",
        "shopping_list",
        "life_brief",
        "fleet_overview",
        "health",
        "help",
    ],
    date_str: str | None = None,
    title: str | None = None,
    data: dict[str, Any] | None = None,
    row_id: int | None = None,
) -> dict[str, Any]:
    """
    Vienna life admin portmanteau — daily ops backed by the ViLife store.

    [RATIONALE] Consolidates calendar/todo/expense operations into one tool
    with an operation discriminator so the daily-brief surface stays compact.

    ## Return Format
    {"success": bool, "message": str, **operation_specific_keys}

    ## Examples
    await vienna_life(operation="health")
    await vienna_life(operation="calendar_today")
    await vienna_life(operation="todo_add", title="Pick up prescription")
    await vienna_life(operation="event_add", date_str="2026-08-10", title="Zahnarzt", data={"time": "14:00", "category": "health"})

    ## Notes
    - event_add requires date_str + title; event_update/delete require row_id.
    - todo_toggle flips open <-> done.
    """
    today = date.today().isoformat()

    if operation == "help":
        return {
            "success": True,
            "message": "Vienna Life MCP — life admin for agents",
            "operations": [
                "calendar_today",
                "event_add",
                "event_update",
                "event_delete",
                "todo_list",
                "todo_add",
                "todo_toggle",
                "todo_delete",
                "expense_summary",
                "expense_add",
                "expense_delete",
                "shopping_list",
                "life_brief",
                "fleet_overview",
                "health",
                "help",
            ],
            "agentic": "vienna_life_agentic(goal=...)",
            "domains": [
                "vienna_health",
                "vienna_travel",
                "vienna_contacts",
                "vienna_household",
            ],
        }

    if operation == "health":
        return {"success": True, "message": "vienna-life-mcp healthy", "date": today}

    with SessionLocal() as db:
        if operation == "calendar_today":
            rows = life_db.list_rows(
                db,
                CalendarEvent,
                order_by=CalendarEvent.time,
                where=CalendarEvent.date == today,
            )
            events = [r.to_dict() for r in rows]
            return {
                "success": True,
                "message": f"{len(events)} events today",
                "events": events,
            }

        if operation == "event_add":
            if not date_str or not title:
                return _error_response(
                    "event_add requires date_str and title", "validation"
                )
            row = life_db.add_row(
                db, CalendarEvent, {"date": date_str, "title": title, **(data or {})}
            )
            return {
                "success": True,
                "message": f"Event added (id {row.id})",
                "event": row.to_dict(),
            }

        if operation == "event_update":
            row = life_db.update_row(db, CalendarEvent, row_id or 0, data or {})
            if row is None:
                return _error_response(f"Event {row_id} not found", "not_found")
            return {"success": True, "message": "Event updated", "event": row.to_dict()}

        if operation == "event_delete":
            if not life_db.delete_row(db, CalendarEvent, row_id or 0):
                return _error_response(f"Event {row_id} not found", "not_found")
            return {"success": True, "message": "Event deleted"}

        if operation == "todo_list":
            rows = life_db.list_rows(db, Todo, order_by=Todo.priority)
            todos = [r.to_dict() for r in rows if r.status != "done"]
            return {
                "success": True,
                "message": f"{len(todos)} open todos",
                "todos": todos,
            }

        if operation == "todo_add":
            if not title:
                return _error_response("todo_add requires title", "validation")
            row = life_db.add_row(db, Todo, {"title": title, **(data or {})})
            return {
                "success": True,
                "message": f"Todo added (id {row.id})",
                "todo": row.to_dict(),
            }

        if operation == "todo_toggle":
            row = life_db.get_row(db, Todo, row_id or 0)
            if row is None:
                return _error_response(f"Todo {row_id} not found", "not_found")
            row.status = "done" if row.status != "done" else "open"
            db.commit()
            db.refresh(row)
            return {
                "success": True,
                "message": f"Todo {row.status}",
                "todo": row.to_dict(),
            }

        if operation == "todo_delete":
            if not life_db.delete_row(db, Todo, row_id or 0):
                return _error_response(f"Todo {row_id} not found", "not_found")
            return {"success": True, "message": "Todo deleted"}

        if operation == "expense_summary":
            total = life_db.expense_month_total(db)
            recent = life_db.list_rows(db, Expense, order_by=Expense.date, limit=10)
            return {
                "success": True,
                "message": "Month summary",
                "period": "month",
                "total_eur": round(total, 2),
                "recent": [r.to_dict() for r in recent],
            }

        if operation == "expense_add":
            if not data or "store" not in data or "amount_eur" not in data:
                return _error_response(
                    "expense_add requires data with store + amount_eur", "validation"
                )
            row = life_db.add_row(
                db, Expense, {"date": data.get("date", today), **data}
            )
            return {
                "success": True,
                "message": f"Expense added (id {row.id})",
                "expense": row.to_dict(),
            }

        if operation == "expense_delete":
            if not life_db.delete_row(db, Expense, row_id or 0):
                return _error_response(f"Expense {row_id} not found", "not_found")
            return {"success": True, "message": "Expense deleted"}

        if operation == "shopping_list":
            return {
                "success": True,
                "message": "Active shopping list (static seed — wire Spar/Billa scrapers for live offers)",
                "items": ["Metronom Coffee", "Jacobs Krönung"],
                "urgent_count": 1,
            }

        if operation == "fleet_overview":
            from vienna_life_assistant.fleet_overview import build_fleet_overview

            overview = build_fleet_overview(probe=False)
            return {
                "success": True,
                "message": f"{overview['summary']['total']} ships registered",
                "summary": overview["summary"],
            }

        if operation == "life_brief":
            events = life_db.upcoming_events(db, days=1)
            todos = [
                t.to_dict()
                for t in life_db.list_rows(db, Todo, order_by=Todo.priority)
                if t.status != "done"
            ]
            meds = life_db.active_medications(db)
            visits = [
                v.to_dict()
                for v in life_db.list_rows(db, DoctorVisit, order_by=DoctorVisit.date)
                if v.date and not v.done
            ]
            trips = life_db.next_trips(db, limit=2)
            birthdays = life_db.upcoming_birthdays(db, days=14)
            renewals = life_db.renewals_soon(db, days=14)
            total = life_db.expense_month_total(db)
            return {
                "success": True,
                "message": "Morning life brief",
                "date": today,
                "calendar_today": len(events),
                "calendar_next": events[0] if events else None,
                "open_todos": len(todos),
                "todo_top": todos[0] if todos else None,
                "expenses_month_eur": round(total, 2),
                "active_medications": [m["name"] for m in meds],
                "next_doctor_visit": visits[0] if visits else None,
                "next_trip": trips[0] if trips else None,
                "birthdays_soon": birthdays,
                "renewals_soon": renewals,
            }

    return {"success": False, "error": f"Unknown operation: {operation}"}


# --- Health ---------------------------------------------------------------


@mcp.tool(annotations=_READ_ONLY)
async def vienna_health(
    operation: Literal[
        "visits",
        "visits_add",
        "visits_update",
        "visits_delete",
        "meds",
        "meds_add",
        "meds_update",
        "meds_delete",
        "vitals",
        "vitals_add",
        "conditions",
        "conditions_add",
    ],
    row_id: int | None = None,
    data: dict[str, Any] | None = None,
) -> dict[str, Any]:
    """Doctor visits, medications, vitals, and medical conditions.

    [RATIONALE] Consolidates the health domain into one tool with an
    operation discriminator — the agent discovers the full health surface
    from the schema instead of separate per-entity tools.

    ## Return Format
    {"success": bool, "message": str, "items"|"item": ...}

    ## Examples
    await vienna_health(operation="meds")
    await vienna_health(operation="visits_add", data={"date": "2026-08-10", "doctor": "Dr. Musterhauser", "specialty": "Allgemeinmedizin", "reason": "Check-up"})
    await vienna_health(operation="vitals_add", data={"systolic": 118, "diastolic": 76, "pulse": 64, "weight_kg": 63.5})

    ## Notes
    - meds lists only active medications; vitals_add defaults to today.
    - add/update accept data keys matching the entity fields; visit/med/condition ids from list results.
    """
    entities = {
        "visits": (DoctorVisit, "visits"),
        "meds": (Medication, "medications"),
        "vitals": (Vitals, "vitals entries"),
        "conditions": (MedicalCondition, "conditions"),
    }

    if operation in ("meds",):
        with SessionLocal() as db:
            rows = life_db.active_medications(db)
            return {
                "success": True,
                "message": f"{len(rows)} active medications",
                "items": rows,
            }

    entity, label = entities[operation.rsplit("_", 1)[0]]
    op = operation if operation.endswith(("_add", "_update", "_delete")) else "list"

    with SessionLocal() as db:
        if op == "list":
            order = getattr(entity, "date", None) or getattr(entity, "name", None)
            rows = life_db.list_rows(db, entity, order_by=order)
            return {
                "success": True,
                "message": f"{len(rows)} {label}",
                "items": [r.to_dict() for r in rows],
            }
        return _entity_crud(db, entity, label, op, data=data, row_id=row_id)


# --- Travel ----------------------------------------------------------------


@mcp.tool(annotations=_READ_ONLY)
async def vienna_travel(
    operation: Literal[
        "trips",
        "trip_add",
        "trip_update",
        "trip_delete",
        "packing",
        "packing_add",
        "packing_toggle",
        "documents",
        "document_add",
        "document_delete",
        "expiring",
    ],
    row_id: int | None = None,
    trip_id: int | None = None,
    item: str | None = None,
    data: dict[str, Any] | None = None,
) -> dict[str, Any]:
    """Trips, packing checklists, and travel documents with expiry tracking.

    [RATIONALE] Travel planning spans trips, per-trip packing, and document
    expiry — one tool with operations keeps the agent's travel surface compact.

    ## Return Format
    {"success": bool, "message": str, "items"|"item": ...}

    ## Examples
    await vienna_travel(operation="trips")
    await vienna_travel(operation="trip_add", data={"title": "Berlin weekend", "start_date": "2026-09-01", "end_date": "2026-09-03", "mode": "train", "carrier": "ÖBB"})
    await vienna_travel(operation="packing", trip_id=1)
    await vienna_travel(operation="packing_toggle", row_id=3)
    await vienna_travel(operation="expiring")

    ## Notes
    - packing lists items for a trip (trip_id) or all items when omitted.
    - expiring lists travel documents whose expiry falls within 120 days.
    """
    with SessionLocal() as db:
        if operation == "trips":
            rows = life_db.next_trips(db, limit=20)
            return {
                "success": True,
                "message": f"{len(rows)} upcoming trips",
                "items": rows,
            }

        if operation == "trip_add":
            if not data or "title" not in data or "start_date" not in data:
                return _error_response(
                    "trip_add requires data with title + start_date", "validation"
                )
            row = life_db.add_row(db, Trip, data)
            return {
                "success": True,
                "message": f"Trip added (id {row.id})",
                "item": row.to_dict(),
            }

        if operation in ("trip_update", "trip_delete"):
            return _entity_crud(db, Trip, "trip", operation, data=data, row_id=row_id)

        if operation == "packing":
            rows = life_db.list_rows(db, PackingItem, order_by=PackingItem.trip_id)
            items = [
                r.to_dict() for r in rows if (trip_id is None or r.trip_id == trip_id)
            ]
            return {
                "success": True,
                "message": f"{len(items)} packing items",
                "items": items,
            }

        if operation == "packing_add":
            if not item or not trip_id:
                return _error_response(
                    "packing_add requires item + trip_id", "validation"
                )
            row = life_db.add_row(db, PackingItem, {"trip_id": trip_id, "item": item})
            return {
                "success": True,
                "message": f"Packing item added (id {row.id})",
                "item": row.to_dict(),
            }

        if operation == "packing_toggle":
            row = life_db.get_row(db, PackingItem, row_id or 0)
            if row is None:
                return _error_response(f"Packing item {row_id} not found", "not_found")
            row.done = not row.done
            db.commit()
            db.refresh(row)
            return {
                "success": True,
                "message": "Packing item " + ("packed" if row.done else "unpacked"),
                "item": row.to_dict(),
            }

        if operation == "documents":
            rows = life_db.list_rows(
                db, TravelDocument, order_by=TravelDocument.expiry_date
            )
            return {
                "success": True,
                "message": f"{len(rows)} travel documents",
                "items": [r.to_dict() for r in rows],
            }

        if operation == "document_add":
            if not data or "name" not in data:
                return _error_response(
                    "document_add requires data with name", "validation"
                )
            row = life_db.add_row(db, TravelDocument, data)
            return {
                "success": True,
                "message": f"Document added (id {row.id})",
                "item": row.to_dict(),
            }

        if operation == "document_delete":
            if not life_db.delete_row(db, TravelDocument, row_id or 0):
                return _error_response(f"Document {row_id} not found", "not_found")
            return {"success": True, "message": "Document deleted"}

        if operation == "expiring":
            rows = life_db.expiring_documents(db)
            return {
                "success": True,
                "message": f"{len(rows)} documents expiring soon",
                "items": rows,
            }

    return {"success": False, "error": f"Unknown operation: {operation}"}


# --- Contacts --------------------------------------------------------------


@mcp.tool(annotations=_READ_ONLY)
async def vienna_contacts(
    operation: Literal["list", "add", "update", "delete", "birthdays"],
    row_id: int | None = None,
    data: dict[str, Any] | None = None,
) -> dict[str, Any]:
    """People, birthdays, and relationships.

    ## Return Format
    {"success": bool, "message": str, "items"|"item": ...}

    ## Examples
    await vienna_contacts(operation="list")
    await vienna_contacts(operation="birthdays")
    await vienna_contacts(operation="add", data={"name": "Stefan", "phone": "+43 650 000000", "birthday": "1990-03-21", "relationship": "friend"})

    ## Notes
    - birthdays returns contacts with a birthday within the next 30 days,
      including days_until and age_turning.
    """
    with SessionLocal() as db:
        if operation == "list":
            rows = life_db.list_rows(db, Contact, order_by=Contact.name)
            return {
                "success": True,
                "message": f"{len(rows)} contacts",
                "items": [r.to_dict() for r in rows],
            }
        if operation == "birthdays":
            rows = life_db.upcoming_birthdays(db, days=30)
            return {
                "success": True,
                "message": f"{len(rows)} birthdays in the next 30 days",
                "items": rows,
            }
        if operation == "add":
            if not data or "name" not in data:
                return _error_response("add requires data with name", "validation")
            row = life_db.add_row(db, Contact, data)
            return {
                "success": True,
                "message": f"Contact added (id {row.id})",
                "item": row.to_dict(),
            }
        if operation in ("update", "delete"):
            return _entity_crud(
                db, Contact, "contact", operation, data=data, row_id=row_id
            )
    return {"success": False, "error": f"Unknown operation: {operation}"}


# --- Household --------------------------------------------------------------


@mcp.tool(annotations=_READ_ONLY)
async def vienna_household(
    operation: Literal[
        "subscriptions",
        "subscription_add",
        "subscription_update",
        "subscription_delete",
        "tasks",
        "task_add",
        "task_toggle",
        "task_delete",
        "pet",
        "pet_add",
    ],
    row_id: int | None = None,
    data: dict[str, Any] | None = None,
) -> dict[str, Any]:
    """Subscriptions, home maintenance tasks, and pet care (Benny).

    [RATIONALE] Renewals, maintenance, and pet care are the silent recurring
    costs of daily life — grouped in one tool so the agent can surface
    upcoming obligations in a single call.

    ## Return Format
    {"success": bool, "message": str, "items"|"item": ...}

    ## Examples
    await vienna_household(operation="subscriptions")
    await vienna_household(operation="tasks")
    await vienna_household(operation="pet")
    await vienna_household(operation="subscription_add", data={"name": "Netflix", "cost_monthly_eur": 15.49, "renewal_date": "2026-09-01"})

    ## Notes
    - tasks returns overdue + upcoming by due date; task_toggle flips done.
    - pet lists care events sorted by next_due (empty next_due = past event).
    """
    with SessionLocal() as db:
        if operation == "subscriptions":
            rows = life_db.list_rows(
                db, Subscription, order_by=Subscription.renewal_date
            )
            total = sum(r.cost_monthly_eur for r in rows)
            return {
                "success": True,
                "message": f"{len(rows)} subscriptions (€{total:,.2f}/month)",
                "monthly_total_eur": round(total, 2),
                "items": [r.to_dict() for r in rows],
            }

        if operation == "tasks":
            rows = life_db.list_rows(db, HomeTask, order_by=HomeTask.due_date)
            items = [r.to_dict() for r in rows if not r.done]
            return {
                "success": True,
                "message": f"{len(items)} open home tasks",
                "items": items,
            }

        if operation == "task_add":
            if not data or "name" not in data:
                return _error_response("task_add requires data with name", "validation")
            row = life_db.add_row(db, HomeTask, data)
            return {
                "success": True,
                "message": f"Home task added (id {row.id})",
                "item": row.to_dict(),
            }

        if operation == "task_toggle":
            row = life_db.get_row(db, HomeTask, row_id or 0)
            if row is None:
                return _error_response(f"Home task {row_id} not found", "not_found")
            row.done = not row.done
            db.commit()
            db.refresh(row)
            return {
                "success": True,
                "message": "Home task " + ("done" if row.done else "reopened"),
                "item": row.to_dict(),
            }

        if operation == "task_delete":
            if not life_db.delete_row(db, HomeTask, row_id or 0):
                return _error_response(f"Home task {row_id} not found", "not_found")
            return {"success": True, "message": "Home task deleted"}

        if operation == "pet":
            rows = life_db.list_rows(db, PetCareEvent, order_by=PetCareEvent.next_due)
            return {
                "success": True,
                "message": f"{len(rows)} pet care events",
                "items": [r.to_dict() for r in rows],
            }

        if operation == "pet_add":
            if not data or "event_type" not in data:
                return _error_response(
                    "pet_add requires data with event_type (vet|vaccination|medication|grooming|walk|weight)",
                    "validation",
                )
            row = life_db.add_row(
                db,
                PetCareEvent,
                {
                    "pet_name": data.get("pet_name", "Benny"),
                    "date": data.get("date", ""),
                    **data,
                },
            )
            return {
                "success": True,
                "message": f"Pet care event added (id {row.id})",
                "item": row.to_dict(),
            }

        if operation in (
            "subscription_add",
            "subscription_update",
            "subscription_delete",
        ):
            entity = Subscription
            label = "subscription"
            return _entity_crud(db, entity, label, operation, data=data, row_id=row_id)

    return {"success": False, "error": f"Unknown operation: {operation}"}


# --- Journal (personal log) --------------------------------------------------


@mcp.tool(annotations=_READ_ONLY)
async def vienna_log(
    operation: Literal[
        "entries",
        "today",
        "add",
        "update",
        "delete",
        "streak",
        "on_this_day",
        "search",
        "search_semantic",
        "reindex",
    ],
    row_id: int | None = None,
    data: dict[str, Any] | None = None,
    query: str | None = None,
) -> dict[str, Any]:
    """Personal journal — daily entries with mood, tags, streak, and recall.

    [RATIONALE] A personal log is the memory of a life assistant: entries,
    streak, on-this-day recall, and semantic search in one tool keep journaling
    one call away.

    ## Return Format
    {"success": bool, "message": str, "entries"|"entry"|"streak": ...}

    ## Examples
    await vienna_log(operation="today")
    await vienna_log(operation="add", data={"title": "Salzburg day", "body": "…", "mood": 8, "tags": "travel"})
    await vienna_log(operation="streak")
    await vienna_log(operation="on_this_day")
    await vienna_log(operation="search", query="Staatsoper")
    await vienna_log(operation="search_semantic", query="when was I in Salzburg?")

    ## Notes
    - add accepts date (ISO, defaults today), time, title, body, mood (1-10), tags.
    - streak counts consecutive days with an entry, ending today (or yesterday).
    - on_this_day returns entries from previous years on today's month-day.
    - search_semantic embeds the journal via Ollama (RAG_EMBED_MODEL) and
      returns top entries by similarity; reindex force-re-embeds everything.
    """
    today = date.today().isoformat()

    if operation == "search_semantic":
        if not query:
            return _error_response("search_semantic requires query", "validation")
        from vienna_life_assistant import rag

        with SessionLocal() as db:
            hits = rag.semantic_search(db, query)
        return {
            "success": True,
            "message": f"{len(hits)} semantic matches",
            "entries": hits,
        }

    if operation == "reindex":
        from vienna_life_assistant import rag

        with SessionLocal() as db:
            n = rag.reindex_all(db)
        return {
            "success": True,
            "message": f"Reindexed {n} journal entries",
            "reindexed": n,
        }

    with SessionLocal() as db:
        if operation == "entries":
            rows = life_db.list_rows(
                db, JournalEntry, order_by=JournalEntry.date, limit=100
            )
            return {
                "success": True,
                "message": f"{len(rows)} journal entries",
                "entries": [r.to_dict() for r in rows],
            }

        if operation == "today":
            rows = life_db.list_rows(
                db,
                JournalEntry,
                order_by=JournalEntry.time,
                where=JournalEntry.date == today,
            )
            return {
                "success": True,
                "message": f"{len(rows)} entries today",
                "entries": [r.to_dict() for r in rows],
            }

        if operation == "add":
            if not data:
                return _error_response(
                    "add requires data (title or body)", "validation"
                )
            entry = {
                "date": data.get("date", today),
                "time": data.get("time", "20:00"),
                **data,
            }
            row = life_db.add_row(db, JournalEntry, entry)
            return {
                "success": True,
                "message": f"Entry added (id {row.id})",
                "entry": row.to_dict(),
            }

        if operation == "update":
            row = life_db.update_row(db, JournalEntry, row_id or 0, data or {})
            if row is None:
                return _error_response(f"Entry {row_id} not found", "not_found")
            return {"success": True, "message": "Entry updated", "entry": row.to_dict()}

        if operation == "delete":
            if not life_db.delete_row(db, JournalEntry, row_id or 0):
                return _error_response(f"Entry {row_id} not found", "not_found")
            return {"success": True, "message": "Entry deleted"}

        if operation == "streak":
            streak = life_db.journal_streak(db)
            return {
                "success": True,
                "message": f"{streak}-day journal streak",
                "streak": streak,
            }

        if operation == "on_this_day":
            entries = life_db.journal_on_this_day(db)
            return {
                "success": True,
                "message": f"{len(entries)} entries from previous years on this day",
                "entries": entries,
            }

        if operation == "search":
            entries = life_db.journal_search(db, query or "")
            return {
                "success": True,
                "message": f"{len(entries)} matching entries",
                "entries": entries,
            }

    return {"success": False, "error": f"Unknown operation: {operation}"}


# --- News (aiwatcher bridge) -------------------------------------------------


@mcp.tool(annotations=_READ_ONLY)
async def vienna_news(
    operation: Literal["top", "trends", "search", "morning", "overview", "stats"],
    query: str | None = None,
    hours: int = 24,
    limit: int = 10,
) -> dict[str, Any]:
    """Personal news feed — served by the fleet aiwatcher engine (:10946).

    [RATIONALE] The fleet's aiwatcher ingests and scores RSS + fleet events
    daily; one tool surfaces its top stories, trends, and morning digest.

    ## Return Format
    {"success": bool, "message": str, "items"|"trends"|"stats": ...}

    ## Examples
    await vienna_news(operation="top", hours=24, limit=10)
    await vienna_news(operation="trends", limit=15)
    await vienna_news(operation="search", query="robotics")
    await vienna_news(operation="morning")

    ## Notes
    - Items carry title, summary/distilled_summary, urgency_score, tags, url.
    - When aiwatcher is down the tool returns success=False with a recovery hint.
    """
    from vienna_life_assistant.news_routes import _aw

    if operation == "top":
        payload = _aw("/api/items", {"limit": limit, "hours": hours})
        items = payload.get("items", [])
        if not payload.get("ok"):
            return {
                "success": False,
                "error": payload.get("error", "aiwatcher unreachable"),
                "recovery_options": [
                    "Start aiwatcher-mcp (just up in aiwatcher-mcp) or check port 10946"
                ],
            }
        return {
            "success": True,
            "message": f"{len(items)} top stories ({hours}h)",
            "items": items,
        }

    if operation == "trends":
        payload = _aw("/api/trends", {"days": 7, "limit": limit})
        trends = payload.get("trends", [])
        if not payload.get("ok"):
            return {
                "success": False,
                "error": payload.get("error", "aiwatcher unreachable"),
            }
        return {
            "success": True,
            "message": f"{len(trends)} trending topics",
            "trends": trends,
        }

    if operation == "search":
        if not query:
            return _error_response("search requires query", "validation")
        payload = _aw("/api/search", {"q": query, "limit": limit})
        items = payload.get("items", [])
        if not payload.get("ok"):
            return {
                "success": False,
                "error": payload.get("error", "aiwatcher unreachable"),
            }
        return {
            "success": True,
            "message": f"{len(items)} results for '{query}'",
            "items": items,
        }

    if operation == "morning":
        payload = _aw("/api/morning-news")
        items = payload.get("items", [])
        if not payload.get("ok"):
            return {
                "success": False,
                "error": payload.get("error", "aiwatcher unreachable"),
            }
        return {
            "success": True,
            "message": f"{len(items)} stories in the morning digest",
            "items": items,
        }

    if operation == "stats":
        payload = _aw("/api/stats")
        if not payload.get("ok"):
            return {
                "success": False,
                "error": payload.get("error", "aiwatcher unreachable"),
            }
        return {"success": True, "message": "aiwatcher stats", "stats": payload}

    if operation == "overview":
        payload = _aw("/api/stats")
        top = _aw("/api/items", {"limit": limit, "hours": hours})
        trends = _aw("/api/trends", {"days": 7, "limit": limit})
        if not payload.get("ok"):
            return {
                "success": False,
                "error": payload.get("error", "aiwatcher unreachable"),
            }
        return {
            "success": True,
            "message": "News overview",
            "stats": payload,
            "top": top.get("items", []),
            "trends": trends.get("trends", []),
        }

    return {"success": False, "error": f"Unknown operation: {operation}"}


# --- Notes (OneNote bridge) --------------------------------------------------


@mcp.tool(annotations=_READ_ONLY)
async def vienna_notes(
    operation: Literal[
        "status", "notebooks", "search", "page", "create", "export_journal"
    ],
    query: str | None = None,
    page_id: str | None = None,
    entry_id: int | None = None,
    data: dict[str, Any] | None = None,
) -> dict[str, Any]:
    """OneNote integration — ViLife bridges onenote-mcp (:10907), the Graph gateway.

    [RATIONALE] The Microsoft Graph token lives in onenote-mcp; ViLife calls it
    server-to-server so notebooks, search, and journal export work without
    duplicating credentials.

    ## Return Format
    {"success": bool, "message": str, "notebooks"|"pages"|"page"|"status": ...}

    ## Examples
    await vienna_notes(operation="status")
    await vienna_notes(operation="notebooks")
    await vienna_notes(operation="search", query="Benny")
    await vienna_notes(operation="create", data={"notebook_id": "...", "title": "Shopping list", "content": "…"})
    await vienna_notes(operation="export_journal", entry_id=3)

    ## Notes
    - export_journal pushes a ViLife journal entry as a page into the first notebook.
    - Requires onenote-mcp running and authenticated (device-code flow there).
    """
    from vienna_life_assistant.notes_routes import _on

    def _f(payload: dict[str, Any], what: str) -> dict[str, Any]:
        if not payload.get("ok"):
            return {
                "success": False,
                "error": payload.get("error", "onenote-mcp unreachable"),
                "recovery_options": [
                    "Start onenote-mcp (port 10907) and complete the device-code auth there"
                ],
            }
        return {
            "success": True,
            "message": f"{what}",
            **{k: v for k, v in payload.items() if k != "ok"},
        }

    if operation == "status":
        payload = _on("/api/auth/status")
        return {
            "success": True,
            "message": "authenticated"
            if payload.get("authenticated")
            else "not authenticated",
            "reachable": payload.get("ok", False),
            "authenticated": bool(payload.get("authenticated")),
            "error": payload.get("error"),
        }

    if operation == "notebooks":
        return _f(_on("/api/notebooks"), "notebooks")

    if operation == "search":
        if not query:
            return _error_response("search requires query", "validation")
        payload = _on("/api/search", {"q": query})
        if not payload.get("ok"):
            return {
                "success": False,
                "error": payload.get("error", "onenote-mcp unreachable"),
            }
        pages = payload.get("pages", [])
        return {
            "success": True,
            "message": f"{len(pages)} pages match '{query}'",
            "pages": pages,
        }

    if operation == "page":
        if not page_id:
            return _error_response("page requires page_id", "validation")
        return _f(_on(f"/api/pages/{page_id}"), "page")

    if operation == "create":
        if not data or not data.get("notebook_id") or not data.get("title"):
            return _error_response(
                "create requires data with notebook_id + title", "validation"
            )
        return _f(_on("/api/pages", json_body=data, method="POST"), "page created")

    if operation == "export_journal":
        if not entry_id:
            return _error_response("export_journal requires entry_id", "validation")
        from vienna_life_assistant.life_db import get_row
        from vienna_life_assistant.models import JournalEntry
        from vienna_life_assistant.db import SessionLocal

        with SessionLocal() as db:
            entry = get_row(db, JournalEntry, entry_id)
            if entry is None:
                return _error_response(
                    f"Journal entry {entry_id} not found", "not_found"
                )
            notebook_payload = _on("/api/notebooks")
            if not notebook_payload.get("ok") or not notebook_payload.get("notebooks"):
                return {
                    "success": False,
                    "error": "onenote-mcp unreachable or no notebooks",
                    "recovery_options": ["Start onenote-mcp and authenticate"],
                }
            notebook = notebook_payload["notebooks"][0]
            notebook_id = notebook.get("id") or notebook.get("notebook_id")
            title = f"Journal {entry.date}: {entry.title or 'Untitled'}"
            content = (
                f"{entry.date} {entry.time} · Mood {entry.mood}/10 · Tags: {entry.tags or 'untagged'}\n\n"
                f"{entry.body}"
            )
            payload = _on(
                "/api/pages",
                json_body={
                    "notebook_id": notebook_id,
                    "title": title,
                    "content": content,
                },
                method="POST",
            )
            if not payload.get("ok"):
                return {
                    "success": False,
                    "error": payload.get("error", "onenote-mcp failed to create page"),
                }
            return {
                "success": True,
                "message": f"Journal entry {entry.id} exported to OneNote",
                "page": payload.get("page"),
            }

    return {"success": False, "error": f"Unknown operation: {operation}"}


# --- Email (email-mcp bridge) -------------------------------------------------


@mcp.tool(annotations=_READ_ONLY)
async def vienna_email(
    operation: Literal[
        "status", "inbox", "get", "search", "send", "mark_read", "stats"
    ],
    message_id: str | None = None,
    query: str | None = None,
    limit: int = 10,
    unread_only: bool = False,
    data: dict[str, Any] | None = None,
) -> dict[str, Any]:
    """Email — ViLife bridges email-mcp (:10813), the mail gateway.

    [RATIONALE] IMAP/SMTP/Graph credentials live in email-mcp; ViLife calls it
    server-to-server so inbox, search, and send work without duplicating secrets.

    ## Return Format
    {"success": bool, "message": str, "emails"|"email"|"payload": ...}

    ## Examples
    await vienna_email(operation="status")
    await vienna_email(operation="inbox", limit=10)
    await vienna_email(operation="inbox", unread_only=True)
    await vienna_email(operation="search", query="Orlik")
    await vienna_email(operation="send", data={"to": "a@b.at", "subject": "…", "body": "…"})

    ## Notes
    - send requires data with to, subject, body. mark_read requires message_id.
    - Requires email-mcp running with a configured + authenticated service.
    """
    from vienna_life_assistant.email_routes import _em

    if operation == "status":
        payload = _em("/api/status")
        return {
            "success": True,
            "message": "email-mcp reachable"
            if payload.get("ok")
            else "email-mcp unreachable",
            "reachable": payload.get("ok", False),
            "payload": payload.get("payload"),
            "error": payload.get("error"),
        }

    if operation == "inbox":
        payload = _em("/api/inbox", {"limit": limit, "unread_only": unread_only})
        if not payload.get("ok"):
            return {
                "success": False,
                "error": payload.get("error", "email-mcp unreachable"),
            }
        emails = payload.get("emails", [])
        return {"success": True, "message": f"{len(emails)} emails", "emails": emails}

    if operation == "get":
        if not message_id:
            return _error_response("get requires message_id", "validation")
        payload = _em(f"/api/inbox/{message_id}")
        if not payload.get("ok"):
            return {
                "success": False,
                "error": payload.get("error", "email-mcp unreachable"),
            }
        return {"success": True, "message": "email detail", "email": payload}

    if operation == "search":
        if not query:
            return _error_response("search requires query", "validation")
        payload = _em("/api/search", {"q": query})
        if not payload.get("ok"):
            return {
                "success": False,
                "error": payload.get("error", "email-mcp unreachable"),
            }
        results = payload.get("results", payload.get("emails", []))
        return {
            "success": True,
            "message": f"{len(results)} results for '{query}'",
            "emails": results,
        }

    if operation == "mark_read":
        if not message_id:
            return _error_response("mark_read requires message_id", "validation")
        payload = _em(f"/api/inbox/{message_id}/mark-read", json_body={}, method="POST")
        if not payload.get("ok"):
            return {
                "success": False,
                "error": payload.get("error", "email-mcp unreachable"),
            }
        return {
            "success": True,
            "message": f"Email {message_id} marked read",
            "payload": payload,
        }

    if operation == "send":
        if (
            not data
            or not data.get("to")
            or not data.get("subject")
            or not data.get("body")
        ):
            return _error_response(
                "send requires data with to, subject, body", "validation"
            )
        payload = _em("/api/send", json_body=data, method="POST")
        if not payload.get("ok"):
            return {
                "success": False,
                "error": payload.get("error", "email-mcp unreachable"),
            }
        return {
            "success": True,
            "message": f"Email sent to {data['to']}",
            "payload": payload,
        }

    if operation == "stats":
        payload = _em("/api/stats")
        if not payload.get("ok"):
            return {
                "success": False,
                "error": payload.get("error", "email-mcp unreachable"),
            }
        return {"success": True, "message": "email stats", "stats": payload}

    return {"success": False, "error": f"Unknown operation: {operation}"}


# --- Environment (devices-mcp bridge) -----------------------------------------


@mcp.tool(annotations=_READ_ONLY)
async def vienna_environment(operation: Literal["overview"]) -> dict[str, Any]:
    """Home environment monitoring via devices-mcp (:10717).

    [RATIONALE] devices-mcp (running as a background nssm task) is the fleet's
    environment hub; one tool surfaces its state for the daily brief and ad-hoc
    questions.

    ## Return Format
    {"success": bool, "message": str, **environment_fields}

    ## Examples
    await vienna_environment(operation="overview")

    ## Notes
    - Includes energy devices, sensors, Fritz!Box incidents, weather (when
      Netatmo is configured), and offline devices.
    - Returns success=False with a recovery hint when devices-mcp is down.
    """
    from vienna_life_assistant.environment_routes import environment_overview

    env = environment_overview()
    if not env.get("devices_mcp_online"):
        return {
            "success": False,
            "error": "devices-mcp unreachable on :10717",
            "recovery_options": [
                "Start the devices-mcp nssm task (background service)"
            ],
        }
    return {"success": True, "message": "environment overview", **env}


def _add_skills_provider() -> None:
    try:
        from fastmcp.server.providers.skills import SkillsDirectoryProvider
    except ImportError:
        logger.warning("SkillsDirectoryProvider not available", exc_info=True)
        return
    roots = Path(__file__).resolve().parent / "skills"
    if not roots.is_dir():
        return
    try:
        mcp.add_provider(SkillsDirectoryProvider(roots=roots))
    except (OSError, UnicodeError, ValueError) as e:
        logger.warning("Failed to add SkillsDirectoryProvider: %s", e, exc_info=True)


_add_skills_provider()
