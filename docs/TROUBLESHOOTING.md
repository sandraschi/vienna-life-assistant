# Troubleshooting — vienna-life-assistant

## Backend won't start / port busy

- `web_sota/start.ps1` clears the backend port before binding. If :10922 is
  still held, find the owner and stop it (never kill an NSSM child process —
  use `sc.exe stop/start` + verify a new PID owns the port).
- Health probe: `GET http://127.0.0.1:10922/health` must return 200. The
  frontend retries with exponential backoff (1s/2s/4s/8s) — `Connecting...`
  that never clears means the backend died during lifespan init; check the
  backend console for SQLite/seed errors.

## Empty data / reseed

Stop the server, delete `web_sota/data/vilife.db`, restart — first run seeds
realistic demo content. Nothing is deleted by onboarding; demo rows stay until
replaced.

## Tests hang (known, 2026-09-24)

`uv run pytest tests/ -q` has been observed hanging past 120 s while
`--collect-only` works (40+ tests). Suspects: Ollama embedding calls in
`rag.py` (no local Ollama → connection waits) and the PA scheduler. Workaround:
run with a timeout and deselect network-dependent tests, e.g.
`uv run pytest tests/test_life_db.py tests/test_mcp.py -q`. Do not claim
"tests pass" without a completed run.

## Stale :10988 references

Frontend moved :10988 → :10931 (2026-08-27 registry collision). Fixed in
current-state docs on 2026-09-24; `CHANGELOG.md`/`SPEC.md`/`PRD.md` history
entries intentionally keep the old number. If a doc still says 10988 outside
those history files, fix it.

## Which start script?

Use `web_sota/start.ps1`. The repo-root `start.ps1` is a legacy 7-line stub
(`python -m vienna_life_assistant` from the root, where the module does not
live) and is kept only to avoid breaking old shortcuts.

## MCP `/mcp` 404s or `Session terminated`

The mount must stay `app.mount("/mcp", vienna_life_mcp.http_app(path="/"))` —
dropping `path="/"` double-prefixes and 404s everything (BUG-008). Verify with
a real HTTP client (`fastmcp.Client("http://127.0.0.1:10922/mcp")` +
`list_tools()`); in-memory clients bypass this bug class and prove nothing.

## Fleet bridges show "unreachable"

News/Notes/Email/Environment degrade gracefully when aiwatcher (:10946),
onenote-mcp (:10907), email-mcp (:10813), devices-mcp (:10717) are down.
Check `GET /api/notes/status` or `/api/email/status` for reachability + auth
state, and the `*_URL` env vars in `docs/CONFIGURATION.md`.

## RAG reindex is slow

`POST /api/pa/rag/reindex` re-embeds the whole journal synchronously (known
limitation, 2026-09-24: no background job yet). For large journals it can take
minutes and needs local Ollama with `RAG_EMBED_MODEL` (default
`nomic-embed-text`). Search (`GET /api/pa/rag/search`) only needs vectors for
the entries it scores.
