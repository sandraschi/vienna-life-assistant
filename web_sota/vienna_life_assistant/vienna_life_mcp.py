"""vienna_life portmanteau — P3 life admin MCP surface (FastMCP 3.2+ SOTA)."""

from __future__ import annotations

from datetime import date
from pathlib import Path
from typing import Any, Literal

from fastmcp import Context, FastMCP
from fastmcp.prompts import Message

from vienna_life_assistant.life_data import calendar_today as _calendar_today_data
from vienna_life_assistant.life_data import expense_summary as _expense_summary_data

mcp = FastMCP(
    "vienna-life-mcp",
    instructions=(
        "Vienna Life Assistant (ViLife) — human carrier for life admin. "
        "Portmanteau vienna_life; agentic vienna_life_agentic; resources resource://vienna-life/*; "
        "skill://vienna-life/SKILL.md."
    ),
)


def _mock_calendar_today() -> list[dict[str, str]]:
    return _calendar_today_data()


def _mock_todos() -> list[dict[str, str]]:
    return [
        {"id": "1", "title": "Review fleet-registry merge", "priority": "high", "status": "open"},
        {"id": "2", "title": "Spar shopping run", "priority": "normal", "status": "open"},
    ]


@mcp.resource("resource://vienna-life/capabilities")
def vienna_life_capabilities_resource() -> str:
    return """# vienna-life-assistant capabilities (FastMCP 3.2+)

## Portmanteau
- `vienna_life(operation=...)` — calendar_today, todo_list, expense_summary, shopping_list,
  life_brief, fleet_overview, health, help

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
3. vienna_life(operation="fleet_overview") — meta dashboard data
4. vienna_life_agentic(goal="Plan my Alsergrund Saturday: coffee, museum, shopping")
5. fleet_call(server="vienna-life", tool="vienna_life", arguments={"operation": "calendar_today"})
"""


@mcp.prompt()
def life_brief_request() -> list[Message]:
    """Request a structured morning life brief for Vienna."""
    return [
        Message(
            "Produce my Vienna morning brief: calendar today, open todos, expenses month summary, "
            "urgent shopping. Use vienna_life(operation='life_brief') or chain calendar_today + todo_list.",
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


@mcp.tool()
async def vienna_tips(category: str) -> str:
    """Vienna culture tips for coffee, music, or museums (not vla-robotics)."""
    key = category.lower()
    if key == "coffee":
        return "Try the Hausbrand at Café Berg for a perfect start in Alsergrund."
    if key == "music":
        return (
            "Check Stehplatz tickets at the Staatsoper ~80 minutes before show — often €10–15."
        )
    if key in ("museum", "museums"):
        return "Leopold Museum MQ: Schiele & Klimt — pair with a Café Berg stop after."
    return f"Enjoy the Viennese vibe in the {category} scene!"


@mcp.tool()
async def vienna_life_agentic(goal: str, ctx: Context) -> dict[str, Any]:
    """Plan a multi-step Vienna life workflow using MCP sampling (SEP-1577)."""
    result = await ctx.sample(
        messages=(
            "You are ViLife (Vienna Life Assistant). Given the user's goal, output a compact plan:\n"
            "1) One-line summary\n"
            "Then 2–5 numbered steps naming concrete tools: vienna_life (with operation=), "
            "vienna_tips, fleet_call to vienna-life.\n\n"
            f"Goal:\n{goal[:3000]}"
        ),
        system_prompt="Be concise. Plain text only. No markdown fences.",
        max_tokens=600,
    )
    text = getattr(result, "text", None) or str(result)
    return {"success": True, "plan": text.strip(), "goal": goal}


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
            "agentic": "vienna_life_agentic(goal=...)",
            "prompts": [
                "life_brief_request",
                "vienna_day_plan",
                "alsergrund_morning",
                "spar_shopping_run",
                "wien_transit_check",
                "kultur_abend",
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
        summary = _expense_summary_data()
        return {
            "success": True,
            "message": "Month summary",
            **summary,
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


def _add_skills_provider() -> None:
    try:
        from fastmcp.server.providers.skills import SkillsDirectoryProvider
    except ImportError:
        return
    roots = Path(__file__).resolve().parent / "skills"
    if not roots.is_dir():
        return
    try:
        mcp.add_provider(SkillsDirectoryProvider(roots=roots))
    except (OSError, UnicodeError, ValueError):
        pass


_add_skills_provider()
