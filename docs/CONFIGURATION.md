# Configuration — vienna-life-assistant

Single source of truth: repo-root `.env` (copy from `.env.example`). There is exactly
one `.env` — do not add a second one under `web_sota/` (fleet one-env rule).

## Ports (registry: `mcp-central-docs/operations/WEBAPP_PORTS.md`)

| Surface | Port | Served by |
|---|---|---|
| Backend + MCP `/mcp` + `/api/*` | 10922 | `web_sota/vienna_life_assistant/server.py` (uvicorn) |
| Frontend (Vite dev) | 10931 | `web_sota/vite.config.ts` (strict port + `/api` proxy to :10922) |

> History note: the frontend used to be :10988 (moved 2026-08-27 after a
> registry collision). If you find a stale :10988 reference, fix it to :10931.

## Fleet launcher

- `fleet-start.config.ps1` (repo root): `BackendPort 10922`, `FrontendPort 10931`,
  `HealthPath /health`, `WebRoot web_sota`, backend `module-serve`
  (`vienna_life_assistant` + `__main__.py`), frontend `vite-npm`.
- Real launcher is `web_sota/start.ps1` (fleet engine + standalone fallback).
  The repo-root `start.ps1` is a legacy stub — use `web_sota/start.ps1`.
- Fleet Starts entry: `mcp-central-docs/starts/vienna-life-assistant-start.bat`.

## Environment variables (see `.env.example` + `llms-full.txt` § Environment)

| Var | Default | Purpose |
|---|---|---|
| `OLLAMA_URL` / `OLLAMA_MODEL` | `http://127.0.0.1:11434` | Local LLM endpoint + model |
| `LMSTUDIO_URL` / `LMSTUDIO_MODEL` | `http://127.0.0.1:1234/v1` | LM Studio endpoint + model |
| `OPENAI_API_KEY` / `OPENAI_BASE_URL` / `OPENAI_MODEL` | — | Cloud fallback |
| `VILIFE_DB_PATH` | `web_sota/data/vilife.db` | SQLite override |
| `AIWATCHER_URL` / `AIWATCHER_TIMEOUT` | `:10946` | News bridge |
| `ONENOTE_MCP_URL` / `ONENOTE_MCP_TIMEOUT` | `:10907` | OneNote gateway |
| `EMAIL_MCP_URL` / `EMAIL_MCP_USER` / `EMAIL_MCP_PASSWORD` / `EMAIL_MCP_TIMEOUT` | `:10813` | Mail gateway |
| `DEVICES_MCP_URL` | `:10717` | Fritz!Box probe |
| `FLEET_MCP_ALLOWLIST` | all | PA fleet orchestration servers |
| `PA_AUTOBRIEF` / `PA_STATE_FILE` | on / `data/pa_state.json` | Daily brief scheduler |
| `PA_BRIEF_EMAIL` / `PA_BRIEF_RECIPIENT` | off | Brief-by-email via email-mcp |
| `RAG_EMBED_MODEL` | `nomic-embed-text` | Journal embedding model (Ollama `/v1/embeddings`) |
| `VITE_PORT` / `VITE_API_TARGET` | 10931 / `:10922` | Set by the launcher for Vite |

Life data seeds demo content on first run; everything afterwards is user data.
