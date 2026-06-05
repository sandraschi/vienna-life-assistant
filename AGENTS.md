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
- `web_sota/vienna_life_assistant/vienna_life_mcp.py` — portmanteau MCP
- `web_sota/vienna_life_assistant/llm_routes.py` — Ollama / LM Studio / OpenAI
- `web_sota/vienna_life_assistant/skills/` — Vienna SKILL.md bundles
- `web_sota/src/pages/Chat.tsx`, `Settings.tsx` — chat + provider UI
- `web_sota/src/lib/llm-settings.ts` — provider config shared by Chat/Settings

## LLM providers

Switchable in **Settings** (`/settings`):

1. **Ollama** — URL + model dropdown from `/api/tags`
2. **LM Studio** — OpenAI-compatible URL + `/v1/models`
3. **OpenAI** — API key (password field), base URL, model dropdown from `/v1/models`

Env vars (session, set via POST `/api/settings/llm`):

- `LLM_PROVIDER`, `OLLAMA_URL`, `OLLAMA_MODEL`
- `LMSTUDIO_URL`, `LMSTUDIO_MODEL`
- `OPENAI_API_KEY`, `OPENAI_BASE_URL`, `OPENAI_MODEL`

## MCP tools

Portmanteau: `vienna_life(operation=...)` — see `vienna_life_mcp.py`.

Capabilities: `GET /api/capabilities` (sampling, prompts, resources, skills).

## Fleet docs

Install reference: `mcp-central-docs/standards/AGENT_INSTALL_REFERENCE.md`  
Ports: `mcp-central-docs/operations/WEBAPP_PORTS.md`  
P3 spec: `mcp-central-docs/operations/planning/specs/P3-vienna-life-mcp.md`
