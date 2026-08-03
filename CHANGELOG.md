### Added — OneNote bridge (2026-08-03)
- **Notes**: OneNote via the onenote-mcp gateway (:10907) — the Microsoft Graph token stays in onenote-mcp (device-code flow); ViLife proxies notebooks/search/pages/create
- **Journal → OneNote export**: per-entry export button + `vienna_notes(operation="export_journal", entry_id=)`; offline-safe when onenote-mcp is down
- `vienna_notes` portmanteau (status/notebooks/search/page/create/export_journal) + `/api/notes/*` + Notes page
- 4 new tests (41 total), 1 new e2e (12 total); ONENOTE_MCP_URL env
### Added — journal + news site (2026-08-03, v0.2.0 continuation)
- **Journal**: personal log with daily entries (title, body, mood 1-10, tags), streak counter, on-this-day recall from previous years, full-text search — `vienna_log` portmanteau + `/api/life/logs*` + Journal page
- **News site**: personal news fed by the fleet aiwatcher engine (:10946) — top stories by urgency, weekly trends, search across 12k+ items, morning digest; `/api/news/*` server-to-server bridge with graceful offline state; `vienna_news` portmanteau + News page
- Journal streak/on-this-day seeded; 10 new tests (37 total); 3 new e2e (11 total)
## [0.2.0] - 2026-08-03

### Added — real life-assistant domains (SQLite-backed)
- **Health**: doctor visit log, medical conditions, medications (dose/schedule/refill), vitals (BP, pulse, weight) — `vienna_health` portmanteau + `/api/life/health/*`
- **Travel**: trips with countdown, per-trip packing checklists, travel documents with expiry alerts — `vienna_travel` portmanteau + `/api/life/travel/*`
- **Contacts**: people, relationships, upcoming birthdays with age — `vienna_contacts` + `/api/life/contacts`
- **Household**: subscriptions (monthly total + renewals), home maintenance tasks with frequency, pet care (Benny) — `vienna_household` + `/api/life/subscriptions`, `/home-tasks`, `/pet`
- **Persistence**: SQLite via SQLAlchemy (`web_sota/vienna_life_assistant/db.py` + `models.py`); first-run seed replaces static mocks; mock endpoints now declare `"mock": true`
- **Frontend**: Health, Contacts, Household pages; Travel countdown + packing toggle + documents; Calendar add-event; Dashboard KPI row + Life Pulse widget; `data-testid` on KPIs and forms
- **MCP**: `vienna_life` extended with calendar/todo/expense CRUD; 4 new portmanteau tools (7 total)
- **Tests**: 27 pytest tests (DB CRUD, REST round-trips, MCP ops) with coverage gate; Playwright fleet-audit e2e
- **Session injection**: `.claude-plugin/`, refreshed `.cursorrules` + `.windsurfrules`, copilot-instructions, `.opencode/skills/session-context/`, `.agents/skills/`
- **Infra**: `.github/workflows/ci.yml` (five-gate), `.pre-commit-config.yaml` + `scripts/pre-commit-biome.ps1`, pyright in dev-deps, `.mcpbignore` + `assets/prompts/`, Ctrl+0 zoom reset

### Fixed
- Tracked junk removed (ps_output.txt, docker_status.txt, ovienna-life-assistantbackend, celerybeat-schedule)
- CUA smoke config health path (`/api/v1/health` → `/health`)
- Port registry: frontend 10988 (WEBAPP_PORTS.md corrected from 10989)
- pyright gate green (0 errors), ruff clean, tsc clean
- Dead mock scraping block removed from shopping offers endpoint
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Security
- **CORS**: Replaced wildcard `["*"]` with fleet-standard origins (Tauri `tauri://localhost`, Tailscale regex, LAN IPs, localhost).
- **`.env` leak**: Created `.env.example` as sanitized template. Tauri build.ps1 now bundles `.env.example` instead of `.env` (which contained real `PLEX_TOKEN` and DB credentials).
- **`.gitignore`**: `.env` in gitignore confirmed — but file was committed before the rule. Run `git rm --cached .env` to untrack.

### Added
- `llms.txt`, `llms-full.txt`, `glama.json` — fleet-standard LLM discovery and registry files.
- `useZoom()` hook (`src/lib/use-zoom.ts`) — Ctrl+Scroll zoom with localStorage persistence and CSS fallback for dev browser.
- `data-testid` attributes on Dashboard container and backend connection dot.
- `run_server.py` — dual-transport entry point for PyInstaller (detects `MCP_PORT` for HTTP, falls back to stdio).
- `vienna-life-assistant-backend.spec` — PyInstaller spec with proper `pathex`, dist-info preserve list, SKIP list.
- `GET /api/v1/diagnostics` — diagnostics endpoint for CUA-NSIS smoke test certification.
- Backend-status Tauri event listener + HTTP polling fallback in AppLayout.
- `pyproject.toml` at repo root.
- `color-scheme: dark` in CSS.
- **FastMCP 3.4.4**: Bumped from `>=0.4.1` to `>=3.4.2,<4`. Prefab UI (`prefab-ui>=0.14.0`) in core deps. Ruff in dev-deps.
- **Tool annotations**: `READ_ONLY` annotations on all 3 tools per fleet standard.
- **Tool docstrings**: Added `## Return Format` and `## Examples` sections to all tools.
- **Shutdown endpoint**: `POST /api/shutdown` for graceful agent-callable server termination.
- **justfile**: Added `serve`, `serve-frontend`, `up`, `test`, `types`, `e2e`, `gates-green`, `build-native`, `cua-nsis-test`, `mcpb-pack` recipes.
- **`reports/`**: Added to `.gitignore` for audit trail storage.

### Changed
- **Tauri `frontendDist`**: Pointed to `../web_sota/dist` (was `../webapp/dist` — wrong dir).
- **`backend.rs` port**: Changed from hardcoded `10700` → `10922` to match registry. Upgraded `free_port()` to full 240s multi-layer kill + escalation + TCP health polling.
- **CUA smoke config**: Fixed backend port from `10700` to `10922`.
- **logging**: Replaced `print()` calls in `server.py` with `logger.info/warning/error`.
- **TypeScript**: Removed `console.error` from Dashboard.tsx (silent catch).
- **Python imports**: Fixed E402 (imports at top of file) and replaced `Dict`/`List` with `dict`/`list`.
- **Dashboard**: Removed hardcoded KPI stats, fake activity feed, fake ecosystem grid, Benny dog monitor.

### Added
- **Playwright headless Chromium scrapers**: `vienna_scraper.py` with real data from Burgtheater (httpx), Wiener Staatsoper (Playwright), Belvedere exhibitions (httpx), Gasthaus Orlik lunch menu (httpx). Cache TTL: 30min performances, 2h exhibitions, 1h menus.
- **Live performances**: `GET /api/vienna/music` returns Burgtheater (37) + Staatsoper (14) real performances.
- **Live exhibitions**: `GET /api/vienna/museums` returns Belvedere (8) real exhibitions.
- **Lunch menus**: `GET /api/vienna/restaurants` returns restaurant list + Orlik daily lunch menu.
- **New restaurants**: Steirereck, Enopizzeria Toledo, Mast Weinbar added to reference list.
- **Dashboard hero**: Time-aware greeting with real metrics (concerts, coffee houses, museums).
- **Dashboard Quick Actions**: Working nav buttons to Expenses, Calendar, Shopping, Chat, Fleet.
- **Playwright dep**: `playwright>=1.50.0`, `beautifulsoup4>=4.12.0`, `lxml>=5.0.0`.

### Fixed
- **Error handling**: Added `logger.exception()` to all bare `except` blocks in `capabilities.py`.
- **Sidebar toggle**: Moved collapse button from bottom to top (after logo/header) — fixes fleet-wide UX defect.
- **TypeScript lint**: Removed 11 unused imports across 6 files. Added `@tauri-apps/api` dependency.
- **Python lint**: Removed 7 unused imports in `server.py`.

## [0.2.0] - 2026-06-05

### Added
- **ViLife `web_sota` (FastMCP 3.2)**: Fleet-standard pages — Dashboard, Chat, Skills, Tools, Settings, Help, Apps, Logs.
- **Switchable LLM providers**: Ollama, LM Studio, and OpenAI (API key) with per-provider model dropdown in Settings.
- **Vienna chat preprompts**: Six chips on `/chat` backed by `VIENNA_SYSTEM_PREPROMPT`.
- **Bundled Vienna skills**: `vienna-life`, `vienna-alsergrund`, `vienna-transit`, `vienna-kaffeehaus`, `vienna-kultur`, `vienna-shopping`.
- **`vienna_life` MCP**: Portmanteau tool, resources, prompts, skills provider, agentic sampling at `/mcp`.

### Changed
- **Ports**: Frontend **10988**, backend + MCP **10922** (`web_sota/start.ps1`, strict Vite port).
- **Capabilities API**: Live introspection of tools, prompts, resources, skills from mounted MCP.
- **Fleet manifest**: ViLife on 10922; `vienna-live-mcp` deprecated (redirect to ViLife).

### Fixed
- **Tailwind / layout**: Added `tailwind.config.js` + `postcss.config.js`; sidebar offset (`ml-64`) for main content.
- **Resource URI bug**: `AnyUrl` coerced to `str` for capabilities skills/resources flags.

## [1.1.0] - 2026-04-04

### Added
- **SOTA 2026 Web Interface**: Complete rewrite of the frontend using Vite, React, and glassmorphism aesthetics.
- **KaffeehausHub**: Specialized Vienna coffee house exploration with categorization and interactive maps.
- **ShoppingOffers**: Real-time grocery discount tracking for Spar and Billa.
- **Mobile-Responsive Design**: Grid layouts and collapsible navigation for all screen sizes.

### Changed
- **Unified Branding**: Updated all pages to use the "Vienna Life Assistant" design tokens and HSL palettes.
- **Performance Optimization**: Pruned unused imports across core pages (`ShoppingOffers.tsx`, `KaffeehausHub.tsx`, `ConcertHall.tsx`).
- **ConcertHall Logic**: Fixed missing `Clock` icon import from `lucide-react`.

### Fixed
- **Accessibility Hardening**: Added discernible text (`title` attributes) to icon-only action buttons in the shopping list UI.
- **Dark Mode Selection**: Standardized selection colors and contrast ratios for OLED displays.

## [1.0.0] - 2025-12-03

### Added
- Initial release with backend scrapers and basic React frontend.
- Spar/Billa scraper integration.
- Ollama LLM support.
