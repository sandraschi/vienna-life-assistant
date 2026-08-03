# vienna-life-assistant — Agent Guide

## Overview

> 📖 **[Installation Guide](INSTALL.md)** — quick start, manual setup, and troubleshooting  
> 📋 **[PRD](docs/PRD.md)** — `web_sota` 0.2.0 requirements

ViLife human carrier — life admin **web_sota** + `vienna_life` MCP at `http://127.0.0.1:10922/mcp`.

**Do not use** `vienna-live-mcp` (deprecated; redirects here).

## Quick start

```powershell
Set-Location web_sota
.\start.ps1
```

| Surface | Port |
|---------|------|
| Frontend (Vite) | 10988 |
| Backend + MCP | 10922 |

## Key files

- `web_sota/start.ps1` — port cleanup, strict Vite, backend uvicorn
- `web_sota/vienna_life_assistant/server.py` — FastAPI app, `/mcp` mount, settings API
- `web_sota/vienna_life_assistant/db.py` — SQLite engine/session/init
- `web_sota/vienna_life_assistant/models.py` — life-domain tables (calendar, health, travel, contacts, household)
- `web_sota/vienna_life_assistant/life_db.py` — CRUD + seed + aggregations
- `web_sota/vienna_life_assistant/life_db_routes.py` — generic CRUD REST routers
- `web_sota/vienna_life_assistant/vienna_life_mcp.py` — portmanteau MCP tools
- `web_sota/vienna_life_assistant/llm_routes.py` — Ollama / LM Studio / OpenAI
- `web_sota/vienna_life_assistant/skills/` — Vienna SKILL.md bundles
- `web_sota/src/pages/` — React pages (Health, Contacts, Household, Travel, Calendar, Chat, Settings, ...)
- `web_sota/src/lib/api.ts` — API paths + fetch helpers
- `web_sota/tests/` — pytest suite (27 tests, coverage gate)

## Life data (SQLite)

All life domains persist in `web_sota/data/vilife.db` (gitignored; first run seeds
demo content). New domain pattern: model in `models.py` → helpers in `life_db.py`
→ CRUD router in `life_db_routes.py` → ops in the matching portmanteau in
`vienna_life_mcp.py`. REST mirrors MCP: `/api/life/<domain>`.

## MCP tools

Portmanteaus (see `vienna_life_mcp.py`):

- `vienna_life(operation=...)` — calendar/todos/expenses CRUD, life_brief, health, help
- `vienna_health(operation=...)` — visits, meds, vitals, conditions
- `vienna_travel(operation=...)` — trips, packing, documents, expiring
- `vienna_contacts(operation=...)` — list/add/update/delete, birthdays
- `vienna_household(operation=...)` — subscriptions, tasks, pet
- `vienna_log(operation=...)` — journal entries, streak, on_this_day, search
- `vienna_news(operation=...)` — aiwatcher-fed top/trends/search/morning
- `vienna_notes(operation=...)` — OneNote via onenote-mcp gateway (:10907), journal export
- `vienna_life_agentic(goal, ctx)` — sampling-based planning
- `vienna_tips(category)` — culture tips

Capabilities: `GET /api/capabilities` (sampling, prompts, resources, skills).

## Fleet docs

Install reference: `mcp-central-docs/standards/AGENT_INSTALL_REFERENCE.md`  
Ports: `mcp-central-docs/operations/WEBAPP_PORTS.md`  
P3 spec: `mcp-central-docs/operations/planning/specs/P3-vienna-life-mcp.md`
