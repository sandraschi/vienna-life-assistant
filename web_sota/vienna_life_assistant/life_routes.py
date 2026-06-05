"""REST routes for calendar, expenses, and travel pages."""

from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Query

from vienna_life_assistant.life_data import (
    calendar_today,
    calendar_week,
    expense_recent,
    expense_summary,
    travel_packing,
    travel_upcoming,
)

router = APIRouter(prefix="/api/life", tags=["life"])


@router.get("/calendar/today")
async def api_calendar_today() -> dict[str, Any]:
    events = calendar_today()
    return {"ok": True, "count": len(events), "events": events}


@router.get("/calendar/week")
async def api_calendar_week() -> dict[str, Any]:
    events = calendar_week()
    return {"ok": True, "count": len(events), "events": events}


@router.get("/expenses/summary")
async def api_expense_summary(period: str = Query("month")) -> dict[str, Any]:
    return {"ok": True, **expense_summary(period)}


@router.get("/expenses/recent")
async def api_expense_recent(limit: int = Query(20, ge=1, le=100)) -> dict[str, Any]:
    rows = expense_recent(limit)
    return {"ok": True, "count": len(rows), "expenses": rows}


@router.get("/travel/upcoming")
async def api_travel_upcoming() -> dict[str, Any]:
    trips = travel_upcoming()
    return {"ok": True, "count": len(trips), "trips": trips}


@router.get("/travel/packing")
async def api_travel_packing(trip_id: str | None = None) -> dict[str, Any]:
    items = travel_packing(trip_id)
    return {"ok": True, "trip_id": trip_id, "items": items}


@router.get("/brief")
async def api_life_brief() -> dict[str, Any]:
    cal = calendar_today()
    exp = expense_summary()
    trips = travel_upcoming()
    return {
        "ok": True,
        "calendar_today": len(cal),
        "calendar_next": cal[0] if cal else None,
        "expenses_month_eur": exp["total_eur"],
        "travel_next": trips[0] if trips else None,
    }
