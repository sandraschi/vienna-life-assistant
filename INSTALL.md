# Installation

## 🚀 Quick Start (recommended)

```powershell
# Install just if you don't have it
winget install Casey.Just    # Windows
# scoop install just          # Windows (alternative)
# brew install just           # macOS
# sudo apt install just       # Debian/Ubuntu
# cargo install just          # Linux (Rust)

git clone https://github.com/sandraschi/vienna-life-assistant
cd vienna-life-assistant
just
```

The interactive recipe dashboard opens in your browser. From there:

```powershell
just bootstrap   # install all dependencies
just serve       # start the server
just web         # start the frontend (if applicable)
```

> **Why not `pip install`?** MCP servers bundle webapps, configs, project scaffolding, and tooling that a flat Python package can't deliver. PyPI offers no safety advantage — it doesn't audit packages either. `just` gives you the complete, ready-to-run stack.

---

## 🐌 Traditional Setup

If you prefer not to use `just`:

1. Install [Python 3.13+](https://python.org) and [uv](https://docs.astral.sh/uv/)
2. Clone and enter the repo:
   ```powershell
   git clone https://github.com/sandraschi/vienna-life-assistant
   cd vienna-life-assistant
   ```
3. Install dependencies:
   ```powershell
   uv sync --all-extras
   ```
4. **ViLife `web_sota` (recommended):**
   ```powershell
   Set-Location web_sota
   .\start.ps1
   ```
   - Frontend: **http://127.0.0.1:10988**
   - Backend + MCP: **http://127.0.0.1:10922** (`/mcp`, `/api/*`)

5. **LLM providers (Settings page):**

   | Provider | Default endpoint | Notes |
   |----------|------------------|-------|
   | Ollama | `http://127.0.0.1:11434` | `ollama serve` + pulled model |
   | LM Studio | `http://127.0.0.1:1234/v1` | Enable local server in LM Studio |
   | OpenAI | `https://api.openai.com/v1` | Paste API key; pick model from dropdown |

   Save settings, then use **Chat**. API keys are kept in the browser for chat requests and in the server session after Save (not returned on GET).

6. Legacy monolith (Docker): see README — ports 7333–7336.

---

## ❓ Troubleshooting

| Issue | Fix |
|---|---|
| `just` not found | Install via `winget install Casey.Just`, `scoop install just`, or `brew install just` |
| Port conflict | Run `just kill-all` to clear fleet ports (10700–11000) |
| Dependencies out of sync | `uv sync --all-extras` |
| Something else | [Open a GitHub issue](https://github.com/sandraschi/vienna-life-assistant/issues) |

---

*See the main [README](README.md) for feature overview and documentation.*
