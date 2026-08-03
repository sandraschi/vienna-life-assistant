# vienna-life-assistant - Claude Code Guide

## Overview
Personal life management webapp + MCP server for Vienna: calendar, todos, expenses,
health, travel, contacts, household. Active surface: `web_sota/` (FastAPI + FastMCP
3.4 + SQLAlchemy/SQLite + React 19/Vite/Tailwind).

## Entry points
- `web_sota/start.ps1` — start backend (10922) + frontend (10988)
- `web_sota/vienna_life_assistant/server.py` — FastAPI app, mounts MCP at `/mcp`
- `web_sota/vienna_life_assistant/vienna_life_mcp.py` — MCP portmanteau tools
- `web_sota/vienna_life_assistant/life_db.py` — SQLite CRUD + seed
- `web_sota/src/pages/` — React pages
- `web_sota/tests/` — pytest suite

## Rules
- Never extend the legacy `backend/` or `frontend/` directories.
- New life domains: model in `models.py` → helpers in `life_db.py` → CRUD router in
  `life_db_routes.py` → ops in the matching portmanteau in `vienna_life_mcp.py`.
- MCP ops need docstrings with `## Return Format` + `## Examples`.
- Gates: `uv run ruff check .` / `uv run pyright vienna_life_assistant tests` /
  `uv run pytest tests/` / `npx tsc --noEmit`.
- One source of truth for data: SQLite via `db.py`. Mock data must carry
  `"mock": true`.

## Ports
Backend + MCP 10922 · Frontend 10988 (registry: WEBAPP_PORTS.md).
