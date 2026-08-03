"""ViLife PA engine — brief, alerts, NL ask, and the agent chat endpoint.

State (last brief) is persisted to data/pa_state.json so the Dashboard shows
today's brief without regenerating. The lifespan scheduler refreshes it once
daily; POST /api/pa/refresh forces a regeneration.
"""

from __future__ import annotations

import asyncio
import json
import logging
import os
from datetime import date, datetime
from pathlib import Path
from typing import Any

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from vienna_life_assistant import life_db, pa_agent
from vienna_life_assistant.db import SessionLocal, get_db
from vienna_life_assistant.models import CalendarEvent, DoctorVisit, Subscription, Todo
from vienna_life_assistant.vienna_context import VIENNA_SYSTEM_PREPROMPT

logger = logging.getLogger("vienna-life-assistant.pa")

_STATE_FILE = Path(
    os.environ.get(
        "PA_STATE_FILE",
        str(Path(__file__).resolve().parent.parent / "data" / "pa_state.json"),
    )
)

router = APIRouter(prefix="/api/pa", tags=["pa"])

# --- Context + alerts (deterministic) -----------------------------------------


def pa_context(db: Session) -> dict[str, Any]:
    """Life data snapshot used to ground every LLM call."""
    today = date.today()
    events_today = [
        r.to_dict()
        for r in life_db.list_rows(
            db,
            CalendarEvent,
            order_by=CalendarEvent.time,
            where=CalendarEvent.date == today.isoformat(),
        )
    ]
    todos_open = [
        r.to_dict()
        for r in life_db.list_rows(db, Todo, order_by=Todo.priority)
        if r.status != "done"
    ]
    return {
        "date": today.isoformat(),
        "weekday": today.strftime("%A"),
        "calendar_today": events_today,
        "todos_open": todos_open,
        "active_medications": life_db.active_medications(db),
        "next_visits": [
            v.to_dict()
            for v in life_db.list_rows(db, DoctorVisit, order_by=DoctorVisit.date)
            if v.date and not v.done
        ][:5],
        "trips": life_db.next_trips(db, limit=3),
        "birthdays": life_db.upcoming_birthdays(db, days=14),
        "renewals": life_db.renewals_soon(db, days=14),
        "documents_expiring": life_db.expiring_documents(db),
        "home_tasks_due": life_db.overdue_home_tasks(db),
        "expenses_month_eur": round(life_db.expense_month_total(db), 2),
        "journal_streak": life_db.journal_streak(db),
    }


def pa_alerts(db: Session) -> list[dict[str, Any]]:
    """Rule-based alert list — facts, not LLM prose."""
    today = date.today()
    alerts: list[dict[str, Any]] = []

    for m in life_db.active_medications(db):
        if m.get("refill_date") and today.isoformat() <= m["refill_date"] <= _add_days(
            today, 14
        ):
            alerts.append(
                {
                    "level": "info",
                    "domain": "health",
                    "text": f"Medication refill due: {m['name']} ({m['refill_date']})",
                }
            )

    for v in life_db.list_rows(db, DoctorVisit):
        d = v.to_dict()
        if (
            d.get("follow_up_date")
            and not d.get("done")
            and today.isoformat() <= d["follow_up_date"] <= _add_days(today, 14)
        ):
            alerts.append(
                {
                    "level": "info",
                    "domain": "health",
                    "text": f"Doctor follow-up: {d['doctor']} on {d['follow_up_date']}",
                }
            )

    for s in life_db.list_rows(db, Subscription):
        d = s.to_dict()
        if d.get("renewal_date") and today.isoformat() <= d[
            "renewal_date"
        ] <= _add_days(today, 7):
            alerts.append(
                {
                    "level": "warn",
                    "domain": "finance",
                    "text": f"Renewal coming: {d['name']} ({d['renewal_date']})",
                }
            )

    for doc in life_db.expiring_documents(db, days=60):
        alerts.append(
            {
                "level": "warn",
                "domain": "travel",
                "text": f"Document expiry: {doc['name']} ({doc['expiry_date']})",
            }
        )

    for b in life_db.upcoming_birthdays(db, days=7):
        alerts.append(
            {
                "level": "info",
                "domain": "social",
                "text": f"Birthday in {b['days_until']}d: {b['name']} turns {b['age_turning']}",
            }
        )

    for t in life_db.overdue_home_tasks(db):
        alerts.append(
            {
                "level": "warn",
                "domain": "home",
                "text": f"Home task overdue: {t['name']}",
            }
        )

    if events := pa_context(db)["calendar_today"]:
        alerts.append(
            {
                "level": "info",
                "domain": "calendar",
                "text": f"{len(events)} event(s) today",
            }
        )

    return alerts


def _add_days(d: date, n: int) -> str:
    from datetime import timedelta

    return (d + timedelta(days=n)).isoformat()


def context_markdown(db: Session) -> str:
    """Context as markdown for LLM prompts."""
    ctx = pa_context(db)
    lines = [f"Today is {ctx['weekday']}, {ctx['date']}."]
    if ctx["calendar_today"]:
        lines.append("\n## Calendar today")
        lines += [
            f"- {e['time']} {e['title']} ({e.get('location', '')})"
            for e in ctx["calendar_today"]
        ]
    if ctx["todos_open"]:
        lines.append("\n## Open todos")
        lines += [f"- {t['title']}" for t in ctx["todos_open"]]
    if ctx["active_medications"]:
        lines.append("\n## Active medications")
        lines += [
            f"- {m['name']} {m.get('dose', '')}{m.get('unit', '')} ({m.get('frequency', '')})"
            for m in ctx["active_medications"]
        ]
    if ctx["next_visits"]:
        lines.append("\n## Next doctor visits")
        lines += [
            f"- {v['doctor']} ({v.get('specialty', '')}) on {v['date']}"
            for v in ctx["next_visits"]
        ]
    if ctx["trips"]:
        lines.append("\n## Trips")
        lines += [
            f"- {t['title']} {t['start_date']} -> {t.get('end_date', '')} ({t.get('status', '')})"
            for t in ctx["trips"]
        ]
    if ctx["birthdays"]:
        lines.append("\n## Birthdays (14d)")
        lines += [
            f"- {b['name']} in {b['days_until']}d (turns {b['age_turning']})"
            for b in ctx["birthdays"]
        ]
    if ctx["renewals"]:
        lines.append("\n## Renewals (14d)")
        lines += [
            f"- {r['name']} {r['renewal_date']} (EUR {r.get('cost_monthly_eur', 0)}/m)"
            for r in ctx["renewals"]
        ]
    if ctx["documents_expiring"]:
        lines.append("\n## Documents expiring")
        lines += [
            f"- {d['name']} {d['expiry_date']}" for d in ctx["documents_expiring"]
        ]
    if ctx["home_tasks_due"]:
        lines.append("\n## Overdue home tasks")
        lines += [f"- {t['name']} (due {t['due_date']})" for t in ctx["home_tasks_due"]]
    lines.append(f"\nExpenses this month: EUR {ctx['expenses_month_eur']}.")
    if ctx["journal_streak"]:
        lines.append(f"Journal streak: {ctx['journal_streak']} days.")
    return "\n".join(lines)


def load_state() -> dict[str, Any]:
    if _STATE_FILE.exists():
        try:
            return json.loads(_STATE_FILE.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            pass
    return {"date": "", "brief": None, "alerts": [], "generated_at": None}


def save_state(state: dict[str, Any]) -> None:
    _STATE_FILE.parent.mkdir(parents=True, exist_ok=True)
    _STATE_FILE.write_text(
        json.dumps(state, indent=2, ensure_ascii=False), encoding="utf-8"
    )


async def regenerate_brief(db: Session) -> dict[str, Any]:
    """Generate the daily brief: rule alerts + LLM prose (fallback = alerts)."""
    alerts = pa_alerts(db)
    ctx_md = context_markdown(db)
    brief = pa_agent.generate_brief(ctx_md)
    if not brief:
        brief = (
            "## ViLife brief\n\n"
            + "\n".join(f"- {a['text']}" for a in alerts)
            + "\n\n_(No LLM detected — structured alert list)_"
        )
    state = {
        "date": date.today().isoformat(),
        "brief": brief,
        "alerts": alerts,
        "generated_at": datetime.now().isoformat(timespec="seconds"),
        "llm": pa_agent.resolve_llm() is not None,
    }
    save_state(state)
    return state


# --- Endpoints ----------------------------------------------------------------


@router.get("/context")
async def pa_get_context(db: Session = Depends(get_db)) -> dict[str, Any]:
    return {"ok": True, **pa_context(db)}


@router.get("/alerts")
async def pa_get_alerts(db: Session = Depends(get_db)) -> dict[str, Any]:
    alerts = pa_alerts(db)
    return {"ok": True, "count": len(alerts), "alerts": alerts}


@router.get("/state")
async def pa_get_state() -> dict[str, Any]:
    return {"ok": True, **load_state()}


@router.post("/refresh")
async def pa_refresh(db: Session = Depends(get_db)) -> dict[str, Any]:
    state = await regenerate_brief(db)
    return {"ok": True, **state}


@router.post("/ask")
async def pa_ask(body: dict[str, Any], db: Session = Depends(get_db)) -> dict[str, Any]:
    question = (body.get("question") or "").strip()
    if not question:
        return {"ok": False, "error": "question required"}
    answer = pa_agent.answer_question(question, context_markdown(db))
    if answer is None:
        return {
            "ok": False,
            "error": "No LLM configured/reachable — start Ollama or set a provider in Settings",
        }
    return {"ok": True, "question": question, "answer": answer}


@router.post("/chat")
async def pa_chat(body: dict[str, Any]) -> dict[str, Any]:
    """Agent chat: LLM + tool execution over life data."""
    messages = body.get("messages") or []
    if not messages or not messages[-1].get("content"):
        return {"ok": False, "error": "messages with content required"}

    personality = body.get("personality") or {}
    custom_prompt = body.get("custom_prompt") or ""
    if custom_prompt:
        system = custom_prompt
    else:
        system = VIENNA_SYSTEM_PREPROMPT
        if personality.get("prompt"):
            system += f"\n\n## Role\n{personality['prompt']}"
    system += f"\n\n## Life context (live data — trust this over memory)\n{context_markdown_memo()}"

    result = await pa_agent.run_agent(messages, system_prompt=system)
    return result


# context_markdown needs a session; keep a light memo per request via lru-free helper
def context_markdown_memo() -> str:
    from vienna_life_assistant.db import SessionLocal

    with SessionLocal() as db:
        return context_markdown(db)


# --- Daily scheduler (lifespan hook) ------------------------------------------

_REFRESH_LOCK = asyncio.Lock()


async def scheduler_loop() -> None:
    """Regenerate the daily brief once per day (checks every 60s)."""
    autobrief = os.environ.get("PA_AUTOBRIEF", "1") == "1"
    while True:
        try:
            if autobrief:
                state = load_state()
                today = date.today().isoformat()
                if state.get("date") != today:
                    async with _REFRESH_LOCK:
                        with SessionLocal() as db:
                            await regenerate_brief(db)
                    logger.info("PA brief regenerated for %s", today)
        except Exception as e:  # noqa: BLE001 — scheduler must survive
            logger.warning("PA scheduler pass failed: %s", e)
        await asyncio.sleep(60)
