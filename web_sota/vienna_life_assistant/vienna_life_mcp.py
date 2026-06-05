"""vienna_life portmanteau — P3 life admin MCP surface."""

from __future__ import annotations

from datetime import date
from typing import Any, Literal

from fastmcp import FastMCP

mcp = FastMCP(
    "vienna-life-mcp",
    instructions="Vienna Life Assistant — calendar, todos, expenses, shopping, composite brief.",
)


def _mock_calendar_today() -> list[dict[str, str]]:
    return [
        {"time": "09:00", "title": "Benny vet check", "location": "Alsergrund"},
        {"time": "14:30", "title": "Musikverein — Vivaldi", "location": "Musikverein"},
    ]


def _mock_todos() -> list[dict[str, str]]:
    return [
        {"id": "1", "title": "Review fleet-registry merge", "priority": "high", "status": "open"},
        {"id": "2", "title": "Spar shopping run", "priority": "normal", "status": "open"},
    ]


@mcp.tool()
async def vienna_life(
    operation: Literal[
        "calendar_today",
        "todo_list",
        "expense_summary",
        "shopping_list",
        "life_brief",
        "fleet_overview",
        "health",
        "help",
    ],
) -> dict[str, Any]:
    """
    Vienna life admin portmanteau (P3).

    Read-only Phase 1. Wire to main backend SQLAlchemy services in Phase 2.
    """
    if operation == "help":
        return {
            "success": True,
            "message": "Vienna Life MCP — life admin for agents",
            "operations": [
                "calendar_today",
                "todo_list",
                "expense_summary",
                "shopping_list",
                "life_brief",
                "fleet_overview",
                "health",
            ],
        }

    if operation == "health":
        return {"success": True, "message": "vienna-life-mcp healthy", "date": str(date.today())}

    if operation == "calendar_today":
        events = _mock_calendar_today()
        return {"success": True, "message": f"{len(events)} events today", "events": events}

    if operation == "todo_list":
        todos = _mock_todos()
        open_todos = [t for t in todos if t.get("status") == "open"]
        return {"success": True, "message": f"{len(open_todos)} open todos", "todos": open_todos}

    if operation == "expense_summary":
        return {
            "success": True,
            "message": "Month summary",
            "period": "month",
            "total_eur": 1820.0,
            "top_store": "Billa",
        }

    if operation == "shopping_list":
        return {
            "success": True,
            "message": "Active shopping list",
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
        cal = _mock_calendar_today()
        todos = [t for t in _mock_todos() if t.get("status") == "open"]
        return {
            "success": True,
            "message": "Morning life brief",
            "date": str(date.today()),
            "calendar_count": len(cal),
            "calendar_next": cal[0] if cal else None,
            "open_todos": len(todos),
            "todo_top": todos[0] if todos else None,
            "expenses_month_eur": 1820.0,
            "shopping_urgent": 1,
        }

    return {"success": False, "error": f"Unknown operation: {operation}"}
