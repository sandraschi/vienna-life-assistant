# Vienna Life Assistant — Copilot Instructions

ViLife is a personal life management MCP server + webapp for Vienna: calendar,
todos, expenses, health (doctor visits, medications, vitals), travel (trips,
packing, documents), contacts (birthdays), household (subscriptions, home tasks,
pet care).

**When working on this repo:**
- The active surface is `web_sota/` (FastAPI + FastMCP 3.4 + SQLAlchemy/SQLite + React 19/Vite/Tailwind). Do not extend the legacy `backend/` or `frontend/` directories.
- Life data lives in SQLite via `web_sota/vienna_life_assistant/db.py`; new domains = model in `models.py` + CRUD in `life_db.py`/`life_db_routes.py` + ops in the `vienna_life_mcp.py` portmanteaus.
- MCP portmanteaus: `vienna_life`, `vienna_health`, `vienna_travel`, `vienna_contacts`, `vienna_household` — each takes an `operation` Literal.
- Ports: backend + MCP 10922, frontend 10988.
- MCP tools are DB-backed since v0.2.0 — never return static mock data without a `"mock": true` marker.
