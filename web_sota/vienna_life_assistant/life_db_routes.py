"""Generic CRUD REST surface for ViLife life domains.

One router factory produces list / get / add / update / delete endpoints for
every domain model — the REST twin of the MCP portmanteau ops. Read paths
include the same convenience aggregations the MCP tools expose.
"""

from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from vienna_life_assistant.db import get_db
from vienna_life_assistant import life_db
from vienna_life_assistant.models import (
    CalendarEvent,
    Contact,
    DoctorVisit,
    Expense,
    HomeTask,
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


def crud_router(
    prefix: str,
    model,
    tag: str,
    order_by: Any = None,
) -> APIRouter:
    """Build a CRUD router for one model with a consistent response shape."""

    router = APIRouter(prefix=prefix, tags=[tag])

    @router.get("")
    def list_rows(
        limit: int = Query(200, ge=1, le=1000),
        db: Session = Depends(get_db),
    ) -> dict[str, Any]:
        rows = life_db.list_rows(db, model, order_by=order_by, limit=limit)
        return {"ok": True, "count": len(rows), "items": [r.to_dict() for r in rows]}

    @router.get("/{row_id}")
    def get_row(row_id: int, db: Session = Depends(get_db)) -> dict[str, Any]:
        row = life_db.get_row(db, model, row_id)
        if row is None:
            raise HTTPException(404, f"{model.__name__} {row_id} not found")
        return {"ok": True, "item": row.to_dict()}

    @router.post("")
    def add_row(body: dict[str, Any], db: Session = Depends(get_db)) -> dict[str, Any]:
        row = life_db.add_row(db, model, body)
        return {"ok": True, "item": row.to_dict()}

    @router.put("/{row_id}")
    def update_row(
        row_id: int, body: dict[str, Any], db: Session = Depends(get_db)
    ) -> dict[str, Any]:
        row = life_db.update_row(db, model, row_id, body)
        if row is None:
            raise HTTPException(404, f"{model.__name__} {row_id} not found")
        return {"ok": True, "item": row.to_dict()}

    @router.delete("/{row_id}")
    def delete_row(row_id: int, db: Session = Depends(get_db)) -> dict[str, Any]:
        if not life_db.delete_row(db, model, row_id):
            raise HTTPException(404, f"{model.__name__} {row_id} not found")
        return {"ok": True, "deleted": row_id}

    return router


# --- Aggregation endpoints (read side of the life brief) ---------------------

router = APIRouter(prefix="/api/life", tags=["life"])


@router.get("/overview")
def life_overview(
    days: int = Query(30, ge=1, le=365),
    db: Session = Depends(get_db),
) -> dict[str, Any]:
    """One call that powers the Dashboard 'life pulse' and the MCP brief."""
    return {
        "ok": True,
        "today_events": len(life_db.upcoming_events(db, days=1)),
        "events_soon": life_db.upcoming_events(db, days=days),
        "active_medications": life_db.active_medications(db),
        "next_visits": [
            v.to_dict()
            for v in life_db.list_rows(db, DoctorVisit, order_by=DoctorVisit.date)
            if v.date and not v.done
        ][:5],
        "birthdays": life_db.upcoming_birthdays(db, days=days),
        "trips": life_db.next_trips(db),
        "documents_expiring": life_db.expiring_documents(db),
        "renewals": life_db.renewals_soon(db, days=days),
        "home_tasks_due": life_db.overdue_home_tasks(db),
        "expenses_month_eur": life_db.expense_month_total(db),
    }


life_routes = crud_router(
    "/api/life/calendar", CalendarEvent, "life-calendar", CalendarEvent.date
)
todo_routes = crud_router("/api/life/todos", Todo, "life-todos", Todo.priority)
expense_routes = crud_router(
    "/api/life/expenses", Expense, "life-expenses", Expense.date
)
health_routes = crud_router(
    "/api/life/health/visits", DoctorVisit, "health-visits", DoctorVisit.date
)
condition_routes = crud_router(
    "/api/life/health/conditions",
    MedicalCondition,
    "health-conditions",
    MedicalCondition.name,
)
medication_routes = crud_router(
    "/api/life/health/medications", Medication, "health-medications", Medication.name
)
vitals_routes = crud_router(
    "/api/life/health/vitals", Vitals, "health-vitals", Vitals.date
)
trip_routes = crud_router(
    "/api/life/travel/trips", Trip, "travel-trips", Trip.start_date
)
packing_routes = crud_router(
    "/api/life/travel/packing", PackingItem, "travel-packing", PackingItem.trip_id
)
document_routes = crud_router(
    "/api/life/travel/documents",
    TravelDocument,
    "travel-documents",
    TravelDocument.expiry_date,
)
contact_routes = crud_router("/api/life/contacts", Contact, "contacts", Contact.name)
pet_routes = crud_router("/api/life/pet", PetCareEvent, "pet", PetCareEvent.date)
subscription_routes = crud_router(
    "/api/life/subscriptions", Subscription, "subscriptions", Subscription.renewal_date
)
home_task_routes = crud_router(
    "/api/life/home-tasks", HomeTask, "home-tasks", HomeTask.due_date
)


@router.get("/calendar/today")
def calendar_today_route(db: Session = Depends(get_db)) -> dict[str, Any]:
    """Today's calendar events — DB-backed (replaces static mock)."""
    from datetime import date

    rows = life_db.list_rows(
        db,
        CalendarEvent,
        order_by=CalendarEvent.time,
        where=CalendarEvent.date == date.today().isoformat(),
    )
    return {"ok": True, "count": len(rows), "events": [r.to_dict() for r in rows]}
