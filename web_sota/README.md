# ViLife `web_sota`

FastMCP 3.2 fleet webapp for Vienna Life Assistant.

## Start

```powershell
.\start.ps1
```

- **Frontend:** http://127.0.0.1:10988
- **Backend + MCP:** http://127.0.0.1:10922

## LLM

Open **Settings** → pick **Ollama**, **LM Studio**, or **OpenAI** → choose model from dropdown → **Save** → use **Chat**.

## Structure

```
web_sota/
  start.ps1
  src/                 # React + Vite + Tailwind
  vienna_life_assistant/  # FastAPI + FastMCP
```

See repo root [`docs/PRD.md`](../docs/PRD.md) and [`CHANGELOG.md`](../CHANGELOG.md).
