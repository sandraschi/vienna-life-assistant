# ViLife `web_sota` — Product Requirements (0.2.0)

**Status:** Shipped (v0.2.0, 2026-08-03) - superset of the 0.2.0 plan: AI PA engine added  
**Owner:** Sandra Schipal  
**Last updated:** 2026-08-03

## Problem

Vienna Life Assistant was a Docker monolith (7333–7336) that agents could not call. The fleet needed a **FastMCP 3.2** surface with standard webapp pages, Vienna context, and switchable LLMs.

## Goals

1. **Fleet SOTA webapp** — Dashboard, Chat, Skills, Tools, Settings, Help, Apps, Logs.
2. **MCP exposure** — `vienna_life` portmanteau at `/mcp` on the same backend port.
3. **Vienna-native AI** — System preprompt, chat preprompt chips, bundled district/transit/kultur skills.
4. **Switchable LLMs** — Ollama, LM Studio, OpenAI with API key; model dropdown per provider.

## Non-goals (0.2.x)

- Replace legacy Docker monolith UI entirely.
- Wire all `vienna_life` tools to production SQLAlchemy (mocks OK for Phase 1).
- Austrian e-gov integrations.

## Users

- **Sandra** — daily life admin, Alsergrund context, local-first LLM.
- **Cursor / Fritz agents** — MCP tools for calendar, todos, brief.

## Functional requirements

### LLM

| ID | Requirement | Status |
|----|-------------|--------|
| LLM-1 | Provider select: `ollama`, `lmstudio`, `openai` | Done |
| LLM-2 | Per-provider model list via `/api/llm/models` | Done |
| LLM-3 | OpenAI API key stored session-side + browser localStorage for chat | Done |
| LLM-4 | GET `/api/settings` never returns raw API key | Done |
| LLM-5 | Chat `/api/llm/chat` uses Vienna system preprompt | Done |

### MCP

| ID | Requirement | Status |
|----|-------------|--------|
| MCP-1 | FastMCP mounted at `/mcp` on port 10922 | Done |
| MCP-2 | Capabilities reflect live tools/prompts/resources/skills | Done |
| MCP-3 | `vienna_life_agentic` sampling workflow | Done |
| MCP-4 | Read tools backed by real VLA services | Scrapers live (Burgtheater, Staatsoper, Belvedere, Orlik) |

### UI

| ID | Requirement | Status |
|----|-------------|--------|
| UI-1 | Tailwind + glass layout with fixed sidebar | Done |
| UI-2 | Strict ports 10988 / 10922 | Done |
| UI-3 | Skills page lists MCP skills + prompts | Done |

## Ports

| Role | Port |
|------|------|
| Vite frontend | 10988 |
| FastAPI + MCP | 10922 |

Documented in `mcp-central-docs/operations/WEBAPP_PORTS.md`.

## API summary

- `GET /api/llm/status` — provider health
- `GET /api/llm/models?provider=&base_url=&api_key=` — model dropdown source
- `POST /api/llm/chat` — Vienna-aware chat
- `GET/POST /api/settings` — LLM session config
- `GET /api/capabilities` — FastMCP SOTA flags

## Acceptance (0.2.0)

1. Settings: switch Ollama → LM Studio → OpenAI; model dropdown refreshes.
2. Chat responds using selected provider after Save.
3. `/tools` shows sampling, prompts, resources, skills **on**.
4. `vienna_life(operation="help")` via MCP client returns tool catalog.

## Phase 2

- Real DB-backed `calendar_today`, `todo_list`, `life_brief`.
- Write tools with confirm cards.
- Agent API audit log page.


---

## Shipped since the original 0.2.0 plan (2026-08-03)

- **Life domains (SQLite)**: health (doctor visits, medications, vitals, conditions), travel (trips, packing, documents), contacts (birthdays), household (subscriptions, home tasks, pet care), journal (mood, streak, on-this-day)
- **PA engine**: /api/pa/* - LLM morning brief over real context, rule-based alerts, NL ask, daily scheduler, brief-by-email
- **Agent chat**: tool-calling loop over 24 curated vienna_* tools + fleet orchestration (fleet_tools/fleet_call/fritz_status)
- **Journal RAG**: semantic search via Ollama embeddings, memory injection into answers
- **Voice**: Web Speech mic input + read-aloud
- **Bridges**: aiwatcher (news), onenote-mcp (OneNote + journal export), email-mcp (inbox/search/send)
- **Gates**: 68 pytest + 15 Playwright e2e, ruff/pyright/tsc/biome clean
