"""REST routes for calendar, expenses, and travel pages — DB-backed."""

from __future__ import annotations

from datetime import date, timedelta
from typing import Any

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from vienna_life_assistant import life_db
from vienna_life_assistant.db import get_db
from vienna_life_assistant.models import CalendarEvent, Expense, Trip

router = APIRouter(prefix="/api/life", tags=["life"])


@router.get("/calendar/today")
async def api_calendar_today(db: Session = Depends(get_db)) -> dict[str, Any]:
    rows = life_db.list_rows(
        db,
        CalendarEvent,
        order_by=CalendarEvent.time,
        where=CalendarEvent.date == date.today().isoformat(),
    )
    events = [r.to_dict() for r in rows]
    return {"ok": True, "count": len(events), "events": events}


@router.get("/calendar/week")
async def api_calendar_week(db: Session = Depends(get_db)) -> dict[str, Any]:
    today = date.today()
    horizon = (today + timedelta(days=7)).isoformat()
    rows = life_db.list_rows(
        db,
        CalendarEvent,
        order_by=CalendarEvent.date,
        where=CalendarEvent.date >= today.isoformat(),
    )
    events = [r.to_dict() for r in rows if r.date <= horizon]
    return {"ok": True, "count": len(events), "events": events}


@router.get("/expenses/summary")
async def api_expense_summary(
    period: str = Query("month"), db: Session = Depends(get_db)
) -> dict[str, Any]:
    total = life_db.expense_month_total(db, period)
    return {"ok": True, "period": period, "total_eur": round(total, 2)}


@router.get("/expenses/recent")
async def api_expense_recent(
    limit: int = Query(20, ge=1, le=100), db: Session = Depends(get_db)
) -> dict[str, Any]:
    rows = life_db.list_rows(db, Expense, order_by=Expense.date, limit=limit)
    return {"ok": True, "count": len(rows), "expenses": [r.to_dict() for r in rows]}


@router.get("/travel/upcoming")
async def api_travel_upcoming(db: Session = Depends(get_db)) -> dict[str, Any]:
    trips = life_db.next_trips(db, limit=20)
    return {"ok": True, "count": len(trips), "trips": trips}


@router.get("/travel/packing")
async def api_travel_packing(
    trip_id: int | None = None, db: Session = Depends(get_db)
) -> dict[str, Any]:
    from vienna_life_assistant.models import PackingItem

    rows = life_db.list_rows(db, PackingItem, order_by=PackingItem.trip_id)
    items = [r.to_dict() for r in rows if trip_id is None or r.trip_id == trip_id]
    return {"ok": True, "trip_id": trip_id, "count": len(items), "items": items}


@router.get("/brief")
async def api_life_brief(db: Session = Depends(get_db)) -> dict[str, Any]:
    cal = life_db.upcoming_events(db, days=1)
    total = life_db.expense_month_total(db)
    trips = life_db.next_trips(db, limit=1)
    return {
        "ok": True,
        "calendar_today": len(cal),
        "calendar_next": cal[0] if cal else None,
        "expenses_month_eur": round(total, 2),
        "travel_next": trips[0] if trips else None,
    }


@router.get("/travel/trips/{trip_id}")
async def api_trip_detail(
    trip_id: int, db: Session = Depends(get_db)
) -> dict[str, Any]:
    row = life_db.get_row(db, Trip, trip_id)
    if row is None:
        return {"ok": False, "error": "trip not found"}
    from vienna_life_assistant.models import PackingItem

    items = life_db.list_rows(db, PackingItem, where=PackingItem.trip_id == trip_id)
    return {"ok": True, "trip": row.to_dict(), "packing": [i.to_dict() for i in items]}
