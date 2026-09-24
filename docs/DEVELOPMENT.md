# Development — vienna-life-assistant

Active surface is `web_sota/` (FastAPI + FastMCP 3.4 + SQLAlchemy/SQLite +
React 19/Vite/Tailwind). **Do not extend** the legacy `backend/` (Django-style +
Celery) or `frontend/` (React 18 + MUI) directories.

## Layout

```
web_sota/
  start.ps1                  # fleet launcher (use this, not root start.ps1)
  pyproject.toml             # real build config (fastmcp>=3.4.4,<4, prefab-ui, ruff T20)
  vienna_life_assistant/     # server.py, vienna_life_mcp.py, models.py, life_db.py,
                             # life_db_routes.py, llm_routes.py, pa_*/ rag.py, skills/
  src/pages/                 # 28 React pages
  src/lib/api.ts             # API paths + fetch helpers (exponential backoff)
  tests/                     # pytest suite (coverage gate 45%)
  e2e/                       # fleet-audit Playwright spec
```

## Gates (run from `web_sota/`)

```powershell
uv run ruff check .                 # lint (T20 print-ban enforced)
uv run ruff format . --check        # format
uv run pyright vienna_life_assistant tests   # types, 0 errors
uv run pytest tests/ -q             # behaviour + coverage
npx tsc --noEmit                    # frontend types
npm run biome:ci                    # frontend lint
```

Root `justfile` wraps these (`serve`, `lint`, `fix`/`fmt`, `test`, `types`,
`e2e`, `gates-green`, `certify`, `cua-webapp-test`, `cua-nsis-test`,
`build-native`). Every recipe body is a single `;`-joined line — `just` on
Windows runs each line as its own process, so a bare `Set-Location` line would
silently do nothing (TRAPS #37). Keep it that way.

## Adding a life domain

New domain pattern (model → helpers → router → MCP ops):

1. Model in `vienna_life_assistant/models.py` (SQLAlchemy 2 style, Pydantic v2 —
   `model_dump`, never `.dict()`).
2. Helpers in `life_db.py` + seed in `seed_if_empty` (never present mock data
   as real — mark static references `"mock": true`).
3. Generic CRUD router in `life_db_routes.py` + REST mirror `/api/life/<domain>`.
4. Ops in the matching portmanteau in `vienna_life_mcp.py` (`operation`
   Literal + docstring with `## Return Format` + `## Examples`, dialogic
   `{success, message, ...}` returns, `_error_response()` with
   `logger.exception` on failure paths).
5. Page in `src/pages/` with `data-testid` attributes + loading/empty/error
   states; add LLM testids (`llm-provider-select`, `llm-model-select`) where
   applicable.

## Conventions

- Type hints required; FastAPI async; no bare `except:`; no `print()` in
  server code (`logger.warning`/`logger.exception` instead).
- CORS is fleet-standard in `server.py` — do not add `allow_origins=["*"]`.
- MCP mount: `app.mount("/mcp", vienna_life_mcp.http_app(path="/"))` — the
  `path="/"` is load-bearing (BUG-008: omitting it double-prefixes `/mcp`).
