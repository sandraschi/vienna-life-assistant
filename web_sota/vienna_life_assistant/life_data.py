"""Shared life-admin mock data for REST API and vienna_life MCP."""

from __future__ import annotations

from datetime import date, timedelta
from typing import Any


def calendar_today() -> list[dict[str, str]]:
    return [
        {"id": "1", "time": "09:00", "title": "Benny vet check", "location": "Alsergrund", "category": "pet"},
        {"id": "2", "time": "11:30", "title": "Spar shopping run", "location": "Währinger Straße", "category": "errands"},
        {"id": "3", "time": "14:30", "title": "Musikverein — Vivaldi", "location": "Musikverein", "category": "culture"},
        {"id": "4", "time": "18:00", "title": "Coffee with Ingrid", "location": "Café Berg", "category": "social"},
    ]


def calendar_week() -> list[dict[str, str]]:
    today = date.today()
    base = calendar_today()
    extra = [
        {
            "id": "5",
            "date": str(today + timedelta(days=1)),
            "time": "10:00",
            "title": "Fleet registry review",
            "location": "Home office",
            "category": "work",
        },
        {
            "id": "6",
            "date": str(today + timedelta(days=2)),
            "time": "19:30",
            "title": "Staatsoper — Tosca Stehplatz",
            "location": "Staatsoper",
            "category": "culture",
        },
        {
            "id": "7",
            "date": str(today + timedelta(days=4)),
            "time": "08:15",
            "title": "ÖBB — Wien Hbf → Salzburg",
            "location": "Wien Hauptbahnhof",
            "category": "travel",
        },
    ]
    for ev in base:
        ev.setdefault("date", str(today))
    return base + extra


def expense_summary(period: str = "month") -> dict[str, Any]:
    return {
        "period": period,
        "total_eur": 1820.0,
        "change_pct": -4.2,
        "top_store": "Billa",
        "budget_eur": 4250.0,
        "categories": [
            {"name": "Groceries", "eur": 520.0, "pct": 28.6},
            {"name": "Dining", "eur": 380.0, "pct": 20.9},
            {"name": "Transit", "eur": 89.0, "pct": 4.9},
            {"name": "Culture", "eur": 245.0, "pct": 13.5},
            {"name": "Pet (Benny)", "eur": 156.0, "pct": 8.6},
            {"name": "Home", "eur": 430.0, "pct": 23.6},
        ],
    }


def expense_recent(limit: int = 20) -> list[dict[str, Any]]:
    rows = [
        {"id": "e1", "date": "2026-06-04", "store": "Billa", "amount_eur": 42.5, "category": "Groceries", "note": "Weekly staples"},
        {"id": "e2", "date": "2026-06-04", "store": "Restaurant Orlik", "amount_eur": 68.5, "category": "Dining", "note": "Alsergrund dinner"},
        {"id": "e3", "date": "2026-06-03", "store": "Spar", "amount_eur": 31.2, "category": "Groceries", "note": "Jacobs Krönung"},
        {"id": "e4", "date": "2026-06-03", "store": "Wiener Linien", "amount_eur": 2.4, "category": "Transit", "note": "Single ticket"},
        {"id": "e5", "date": "2026-06-02", "store": "Musikverein", "amount_eur": 45.0, "category": "Culture", "note": "Vivaldi tickets"},
        {"id": "e6", "date": "2026-06-01", "store": "Tierarzt Alsergrund", "amount_eur": 89.0, "category": "Pet (Benny)", "note": "Check-up"},
        {"id": "e7", "date": "2026-05-31", "store": "A1", "amount_eur": 29.9, "category": "Home", "note": "Mobile"},
        {"id": "e8", "date": "2026-05-30", "store": "Café Berg", "amount_eur": 12.5, "category": "Dining", "note": "Melange + Buchteln"},
    ]
    return rows[:limit]


def travel_upcoming() -> list[dict[str, Any]]:
    today = date.today()
    return [
        {
            "id": "t1",
            "title": "Salzburg weekend",
            "date_start": str(today + timedelta(days=4)),
            "date_end": str(today + timedelta(days=6)),
            "mode": "train",
            "carrier": "ÖBB",
            "from": "Wien Hbf",
            "to": "Salzburg Hbf",
            "status": "booked",
            "ref": "ÖBB-7K2M",
        },
        {
            "id": "t2",
            "title": "Graz — Steirischer Herbst preview",
            "date_start": str(today + timedelta(days=18)),
            "date_end": str(today + timedelta(days=19)),
            "mode": "train",
            "carrier": "ÖBB",
            "from": "Wien Hbf",
            "to": "Graz Hbf",
            "status": "planned",
            "ref": None,
        },
        {
            "id": "t3",
            "title": "Tokyo research trip",
            "date_start": "2026-09-12",
            "date_end": "2026-09-22",
            "mode": "flight",
            "carrier": "ANA",
            "from": "VIE",
            "to": "NRT",
            "status": "watchlist",
            "ref": None,
        },
    ]


def travel_packing(trip_id: str | None = None) -> list[dict[str, str]]:
    return [
        {"item": "ÖBB ticket PDF", "done": "yes"},
        {"item": "Wiener Linien annual pass", "done": "yes"},
        {"item": "EU health card", "done": "yes"},
        {"item": "Noise-cancelling headphones", "done": "no"},
        {"item": "Calibre ebook sync", "done": "no"},
    ]
