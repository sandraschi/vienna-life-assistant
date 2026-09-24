# Tools — vienna-life-assistant

MCP endpoint: `http://127.0.0.1:10922/mcp` (13 portmanteau tools, all DB-backed
since v0.2.0). Full op lists: `llms-full.txt` § MCP Tools. REST mirrors MCP at
`/api/life/<domain>` (generic CRUD: GET list / POST add / PUT update / DELETE).

## Portmanteaus (`web_sota/vienna_life_assistant/vienna_life_mcp.py`)

| Tool | Domains |
|---|---|
| `vienna_life(operation=...)` | calendar (+today), todos, expenses (+summary), shopping_list (static seed, mock-marked), life_brief, fleet_overview, health, help |
| `vienna_health(operation=...)` | visits, meds (+refills), vitals, conditions |
| `vienna_travel(operation=...)` | trips (+countdown), packing, documents (+120-day expiring) |
| `vienna_contacts(operation=...)` | list/add/update/delete, birthdays (30-day window + age) |
| `vienna_household(operation=...)` | subscriptions (+monthly total), tasks, pet care (+next-due) |
| `vienna_log(operation=...)` | journal entries/today/add/update/delete, streak, on_this_day, search (+semantic) |
| `vienna_news(operation=...)` | top/trends/search/morning/overview/stats (aiwatcher :10946) |
| `vienna_notes(operation=...)` | OneNote via onenote-mcp gateway (:10907): status, notebooks, search, page, create, export_journal |
| `vienna_email(operation=...)` | Email via email-mcp gateway (:10813): status, inbox, get, search, mark_read, send, stats |
| `vienna_environment(operation=...)` | Home environment via devices-mcp gateway (:10717): overview (sensors, energy, Fritz!Box, weather) |
| `vienna_shutdown()` | Graceful backend stop (mirrors `POST /api/shutdown`) |
| `vienna_life_agentic(goal, ctx)` | Multi-step planning via MCP sampling (`ctx.sample`) |
| `vienna_tips(category)` | Vienna culture tips (coffee, music, museum) |

Gateway credentials (Graph tokens, IMAP/SMTP) stay inside the gateway servers —
ViLife only holds their base URLs (see `docs/CONFIGURATION.md`).

## PA engine (REST, `pa_routes.py` + `pa_agent.py`)

- `POST /api/pa/chat` — agent chat: LLM + tool execution over life data (24
  curated tools + fleet orchestration via `fleet_tools`/`fleet_call`), trace
  returned per message.
- `POST /api/pa/refresh` / `GET /api/pa/state` / `GET /api/pa/alerts` /
  `GET /api/pa/context` / `POST /api/pa/ask` — brief lifecycle + NL questions
  (journal-memory grounded).
- `GET /api/pa/rag/search?q=` / `POST /api/pa/rag/reindex` — journal semantic
  search (Ollama embeddings, SQLite `journal_embeddings`).
- Fleet orchestration registry: plex-mcp :10740, calibre-mcp :10720,
  gtfs-mcp :10913, aiwatcher-mcp :10946 (`FLEET_MCP_ALLOWLIST`).

## System endpoints

`GET /health`, `GET /api/capabilities`, `GET /api/v1/diagnostics` (CUA-NSIS),
`POST /api/shutdown`, `GET /api/dashboard`, `GET /api/llm/*`
(providers/status/models/chat), `GET /api/skills`.

## Skills (6) / prompts (6) / resources (2)

Skills: `vienna-life`, `vienna-alsergrund`, `vienna-transit`,
`vienna-kaffeehaus`, `vienna-kultur`, `vienna-shopping`
(`vienna_life_assistant/skills/`). Prompts: `life_brief_request`,
`vienna_day_plan`, `alsergrund_morning`, `spar_shopping_run`,
`wien_transit_check`, `kultur_abend`. Resources:
`resource://vienna-life/capabilities`, `resource://vienna-life/quickstart`.
