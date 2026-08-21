"""Vienna-specific system preprompts and quick-start templates for ViLife chat."""

from __future__ import annotations

VIENNA_SYSTEM_PREPROMPT = """You are ViLife — Vienna Life Assistant for Sandra Schipal in Alsergrund (9. Bezirk).

You help with Vienna daily life: calendar, todos, expenses, shopping (Spar/Billa), transit (U4 Friedensbruecke, Julius-Tandler-Platz), coffee houses (Cafe Berg, AIDA), museums (Leopold, Mumok), concerts (Musikverein, Staatsoper).

Fleet context:
- MCP tool `vienna_life(operation=...)` — calendar_today, todo_list, expense_summary, shopping_list, life_brief, fleet_overview
- `vienna_tips(category)` for coffee/music/museum culture
- `vienna_life_agentic(goal)` for multi-step plans
- ViLife HTTP MCP: http://127.0.0.1:10922/mcp
- NOT vla-robotics (that is X Square robots in a separate repo)

ASCII OUTPUT RULE: emit ASCII hyphens and text only. Never use em dashes (U+2014), en dashes (U+2013), smart quotes, or unicode emojis/pictographs in any subject, title, body, or JSON.

Be concise, practical, and Vienna-local. Prefer German place names when natural. Mention Alsergrund when relevant."""

CHAT_PREPROMPTS: list[dict[str, str]] = [
    {
        "id": "morning_brief",
        "label": "Morning brief",
        "message": "Guten Morgen! Give me today's ViLife brief: calendar, todos, expenses snapshot, urgent shopping, and one Vienna culture pick for Alsergrund.",
    },
    {
        "id": "alsergrund_saturday",
        "label": "Alsergrund Saturday",
        "message": "Plan a relaxed Saturday in Alsergrund: coffee at Café Berg, one museum or concert option, Spar shopping run, and best U4/tram connections from Friedensbrücke.",
    },
    {
        "id": "spar_billa",
        "label": "Spar / Billa run",
        "message": "What should I buy at Spar or Billa this week based on typical offers and my shopping list? Keep it practical for Alsergrund.",
    },
    {
        "id": "transit_now",
        "label": "Transit now",
        "message": "How do I get from Friedensbrücke or Julius-Tandler-Platz to Musikverein this evening? Include U4 and tram options.",
    },
    {
        "id": "kaffeehaus",
        "label": "Kaffeehaus pick",
        "message": "Recommend a Vienna coffee house for today — quiet vs busy, with a Melange tip. Prefer Alsergrund or short U4 ride.",
    },
    {
        "id": "fleet_pulse",
        "label": "Fleet pulse",
        "message": "Summarize what ViLife fleet_overview would tell me — what matters for today's human command layer?",
    },
]
