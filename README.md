# Vienna Life Assistant

[![Beta](https://img.shields.io/badge/status-beta-orange.svg)](https://github.com/sandraschi/vienna-life-assistant)
[![Python](https://img.shields.io/badge/python-3.11+-blue.svg)](https://www.python.org/)
[![React](https://img.shields.io/badge/react-18+-61dafb.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/typescript-5+-3178c6.svg)](https://www.typescriptlang.org/)
[![FastAPI](https://img.shields.io/badge/fastapi-0.109+-009688.svg)](https://fastapi.tiangolo.com/)
[![Material--UI](https://img.shields.io/badge/material--ui-5+-007acc.svg)](https://mui.com/)
[![SQLite](https://img.shields.io/badge/sqlite-3-003b57.svg)](https://sqlite.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Timestamp**: 2025-12-15  
**Status**: Beta Version 🚧  
**Version**: 3.0-beta - AI-Powered Life Management

A beautiful, modern personal life management app with **AI chatbot**, calendar, todos, expenses, shopping, and comprehensive technical documentation - integrated with your entire digital ecosystem via MCP servers and powered by Celery background task processing.

## 🎯 What It Does

Your **personal command center** for Vienna life:
- 📅 **Calendar**: Day/Week/Month views, Benny appointments, events
- ✅ **Smart Todos**: 12 categories, priorities, filters, statistics
- 💰 **Expense Tracking**: €836+ tracked, 7 categories, top stores
- 🛒 **Shopping**: Spar/Billa offers, smart lists
- 🤖 **AI Chatbot**: 16 integrated tools, 6 personalities, streaming responses (Ollama local or cloud APIs)
- 🏠 **Smart Home**: Lights, cameras, Ring doorbell (via Tapo MCP)
- 🧠 **Knowledge Base**: Search/read/create notes (Advanced Memory MCP)
- 📚 **Media Hub**: 50k anime, 15k ebooks (Plex/Calibre MCP)
- 🚊 **Transit**: Wiener Linien integration (U-Bahn, Tram, Bus)
- ⚙️ **Technical Documentation**: Complete hierarchical tech stack guide (Flow Engineering, MCP Architecture, Future Roadmap)
- 🔄 **Background Processing**: Celery-powered async tasks (email notifications, AI analysis, data sync, maintenance)

## ⚙️ Technical Documentation Tab

The app includes a comprehensive **Technical Documentation** tab that provides hierarchical, beautiful documentation about the entire tech stack:

### **Flow Engineering Philosophy**
- **Developer Experience First**: Cursor IDE with AI assistance, automated tooling
- **AI-First Design**: Built around AI capabilities from day one
- **Fast Iteration**: Docker containers for instant development environments

### **Complete Tech Stack Breakdown**
- **Frontend**: React 18 + TypeScript + Material-UI + Vite
- **Backend**: FastAPI + Python 3.11 + SQLAlchemy + Pydantic
- **Database**: PostgreSQL + Redis (caching & Celery broker)
- **Infrastructure**: Docker Desktop + Port Island (7333-7336)
- **Monitoring**: Grafana + Prometheus + Loki stack
- **Version Control**: Git + GitHub Actions

### **MCP Server Architecture**
- **Client-Server Model**: MCP clients connect to specialized servers via STDIO
- **6 Integrated Servers**: Ollama, Advanced Memory, Tapo, Plex, Calibre, Immich
- **Tool Discovery**: AI automatically detects and uses available MCP tools

### **Future Development Roadmap**
- **Phase 4**: Advanced AI Integration (Multi-modal, Voice Commands)
- **Phase 5**: Ecosystem Expansion (Mobile Apps, Multi-user Support)

## 🔄 Background Task Processing (Celery)

Vienna Life Assistant includes a **distributed task queue system** powered by Celery for handling background processing:

### **16 Background Task Categories:**

#### **📧 Email Tasks**
- `send_welcome_email` - Welcome emails for new users
- `send_daily_summary` - Daily activity summaries
- `send_weekly_report` - Comprehensive weekly reports

#### **🤖 AI Tasks**
- `process_long_ai_analysis` - Long-running AI analysis
- `generate_weekly_report` - AI-powered report generation
- `personalize_recommendations` - Personalized user recommendations

#### **🔧 Maintenance Tasks**
- `cleanup_old_conversations` - Database cleanup (90+ days)
- `optimize_database` - Database optimization
- `sync_external_data` - External service synchronization

#### **👤 User Experience Tasks**
- `send_notification` - In-app notifications
- `generate_personalized_content` - Dynamic content generation

### **Celery Architecture:**
```
User Request → FastAPI → Celery Task → Redis Queue → Worker → Result → User
```

### **Scheduled Tasks:**
- **Daily**: User activity summaries at 8:00 AM
- **Weekly**: Comprehensive reports every Sunday
- **Monthly**: Database cleanup and optimization

### **Usage Example:**
```python
# Submit background task (returns immediately)
from workers.tasks import send_welcome_email
result = send_welcome_email.delay("user@example.com", "John Doe")

# Task runs asynchronously in background
# Check status later: result.ready(), result.get()
```

## 🏗️ Multi-MCP Server Architecture

This application integrates with **6 specialized MCP servers** that provide comprehensive digital ecosystem connectivity:

- **🤖 Ollama MCP**: Local LLM inference (llama3.2:3b)
- **🧠 Advanced Memory MCP**: Zettelkasten knowledge base ([sandraschi/advanced-memory-mcp](https://github.com/sandraschi/advanced-memory-mcp))
- **🏠 Tapo MCP**: Smart home control ([sandraschi/tapo-mcp](https://github.com/sandraschi/tapo-mcp))
- **🎬 Plex MCP**: Media library access ([sandraschi/plexmcp](https://github.com/sandraschi/plexmcp))
- **📚 Calibre MCP**: Ebook management ([sandraschi/calibre-mcp](https://github.com/sandraschi/calibre-mcp))
- **📸 Immich MCP**: Photo management ([sandraschi/immich-mcp](https://github.com/sandraschi/immich-mcp))

See [`INTEGRATED_MCP_SERVERS.md`](INTEGRATED_MCP_SERVERS.md) for detailed MCP server documentation.

## 🤖 AI Chatbot Features (Beta)

### **6 AI Personalities:**
1. **Professional Assistant** - Helpful, accurate, professional
2. **Creative Writer** - Imaginative, poetic, expressive
3. **Technical Expert** - Precise, detailed, code examples
4. **Friendly Companion** - Warm, casual, emojis 😊
5. **Concise Advisor** - Brief, direct, bullet points
6. **Vienna Local** - Expert on Bezirke, Wiener Linien, restaurants

### **16 Integrated Tools (Beta):**

**Core Tools (1-5):**
- 🔢 **Calculator** - Math expressions, sqrt, powers
- 🕐 **DateTime** - Current time, dates
- 🔍 **Web Search** - DuckDuckGo search
- ✅ **Todos** - Your task list
- 📅 **Calendar** - Your schedule

**Advanced Memory MCP (6-9):**
- 🧠 **Search Knowledge** - Query your zettelkasten
- 📖 **Read Note** - Fetch specific notes
- 📝 **Create Note** - Save insights from chat
- 📅 **Recent Notes** - Latest activity

**Tapo MCP - Smart Home (10-13):**
- 🌤️ **Weather** - Vienna weather
- 💡 **Smart Lights** - Philips Hue control
- 📷 **Cameras** - Home security status
- 🔔 **Ring Doorbell** - Recent events

**Media & Transit (14-16):**
- 🚊 **Wiener Linien** - U-Bahn, Tram, Bus info
- 🎬 **Plex** - 50,000 anime/movies
- 📚 **Calibre** - 15,000 ebooks

### **Beta Features:**
- ✨ **AI Prompt Enhancement** - Improves your questions (experimental)
- 🔄 **Streaming Responses** - Real-time text generation
- 💾 **Conversation Memory** - Save and resume chats
- 🔧 **Auto-Tool Detection** - Smart pattern matching
- 🎨 **Beautiful UI** - Avatars, timestamps, tool chips

## 🚀 Quick Start

### 0. Clone Repository

```bash
git clone https://github.com/sandraschi/vienna-life-assistant.git
cd vienna-life-assistant
```

### Prerequisites
- **Docker Desktop** (latest version)
- **Choose your LLM option:**
  - **Local (Recommended)**: Ollama + RTX 4070 or better
  - **Cloud**: OpenAI or Anthropic API key (no GPU required)

**Note:** The application runs entirely in Docker containers for consistency and stability across development and production environments.

### Docker Desktop Setup

```powershell
# Download and install Docker Desktop for Windows
# From: https://www.docker.com/products/docker-desktop/

# After installation, enable WSL 2 backend (recommended)
# Docker Desktop -> Settings -> General -> Use the WSL 2 based engine

# Enable Kubernetes (optional, for advanced deployments)
# Docker Desktop -> Settings -> Kubernetes -> Enable Kubernetes

# Allocate sufficient resources
# Docker Desktop -> Settings -> Resources
# - CPUs: 4+ cores
# - Memory: 8GB+ RAM
# - Disk: 20GB+ available space
```

### LLM Setup

#### Option A: Local LLM (Ollama)
```bash
# Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Start Ollama service
ollama serve

# Pull recommended model
ollama pull llama3.2:3b
```

#### Option B: Cloud LLM (OpenAI/Anthropic)
Get API keys from:
- [OpenAI API](https://platform.openai.com/api-keys)
- [Anthropic API](https://console.anthropic.com/)

API keys are configured in the application settings after startup.

### 1. Docker Setup & Launch

```powershell
cd D:\Dev\repos\vienna-life-assistant

# Start all services (PostgreSQL, Redis, Backend, Frontend)
docker compose up -d

# View running containers
docker compose ps

# Check logs if needed
docker compose logs -f backend
docker compose logs -f frontend
```

### 2. Access

- **Frontend**: http://localhost:7333
- **Backend API**: http://localhost:7334
- **API Docs**: http://localhost:7334/docs
- **Tailscale**: http://goliath:7333 (API: goliath:7334)

## 📖 Usage Examples

### AI Chatbot Commands:

```
# Core tools
"what is 25 * 37"                    → Calculator: 925
"what time is it"                    → DateTime: Current time
"search for Vienna weather"          → Web search

# Knowledge base (Advanced Memory MCP)
"search my notes for Python"         → Searches zettelkasten
"read note MCP Patterns"             → Fetches note content
"remember this: Best Schnitzel"      → Creates new note
"what are my recent notes?"          → Shows activity

# Smart home (Tapo MCP)
"what's the weather?"                → Vienna weather
"turn on lights"                     → Controls Philips Hue
"turn off bedroom lights"            → Specific room control
"list cameras"                       → Security cameras
"who was at the door?"               → Ring doorbell events

# Transit & tasks
"when's next U6?"                    → Wiener Linien departures
"my todos"                           → Task list
"my calendar"                        → Upcoming events
```

## 🏗️ Tech Stack

### Backend
- **FastAPI** - Modern Python API framework
- **PostgreSQL** - Containerized database
- **Redis** - Caching and background tasks
- **SQLAlchemy** - ORM with Pydantic v2
- **Celery** - Background task processing
- **Ollama** - Local LLM (RTX 4070 or better recommended)
- **FastMCP** - MCP server integration (stdio transport)

### Frontend
- **React 18** + TypeScript
- **Material-UI (MUI)** v6 - Beautiful components
- **Vite** - Fast build tool
- **Axios** - API client
- **Event streaming** - Server-Sent Events for chat

### MCP Integrations
- **Advanced Memory MCP** - Zettelkasten knowledge base
- **Tapo MCP** - Smart home (lights, cameras, Ring, weather)
- **Plex MCP** - Media server (50k anime/movies)
- **Calibre MCP** - Ebook library (15k books)
- **Immich MCP** - Photo memories
- **MyWienerLinien** - Vienna public transport

## 📊 Database

**PostgreSQL** container with 7 models:
- `todos` - Task management (12+ items)
- `calendar_events` - Schedule (10+ events)
- `shopping_items` - Grocery lists
- `expenses` - Expense tracking (€836+ tracked)
- `conversations` - Chat history
- `messages` - Chat messages
- `settings` - Application settings (LLM preferences)

**Redis** for caching and background task queues.

## 🧪 Testing

```powershell
cd D:\Dev\repos\vienna-life-assistant\backend

# Run all tests
.\venv\Scripts\Activate.ps1
pytest -v

# Run specific test suite
pytest tests/api/test_chat.py -v
```

**Test Coverage:**
- ✅ CRUD operations (todos, calendar, expenses)
- ✅ API endpoints
- ✅ Model validation
- ✅ Ollama integration
- ✅ Shopping scrapers

## 📁 Project Structure

```
vienna-life-assistant/
├── backend/
│   ├── api/
│   │   ├── calendar/      # Calendar endpoints
│   │   ├── todos/         # Todo endpoints
│   │   ├── expenses/      # Expense endpoints
│   │   ├── shopping/      # Shopping endpoints
│   │   ├── llm/           # LLM management
│   │   ├── chat/          # AI chatbot endpoints
│   │   └── media/         # Media integration
│   ├── models/            # SQLAlchemy models
│   ├── services/          # Business logic
│   │   ├── chat_service.py       # Chat + tools
│   │   ├── ollama_service.py     # Local LLM
│   │   └── mcp_clients.py        # MCP integrations
│   ├── tests/             # Pytest tests
│   └── vienna_life.db     # SQLite database
│
├── frontend/
│   └── src/
│       ├── features/
│       │   ├── calendar/      # Calendar UI
│       │   ├── todos/         # Todo UI
│       │   ├── expenses/      # Expense tracker UI
│       │   ├── shopping/      # Shopping UI
│       │   ├── llm/           # LLM manager UI
│       │   ├── chat/          # AI Chatbot UI ⭐
│       │   └── media/         # Media dashboard
│       └── services/
│           └── api.ts         # API client
│
└── docs/
    ├── FEATURES_ADDED.md      # Feature changelog
    ├── TESTING.md             # Testing guide
    ├── SQLITE_MIGRATION.md    # Database migration
    └── ECOSYSTEM_INTEGRATION.md
```

## 🎨 Screenshots

- **Calendar**: Day/Week/Month views, Grid/List modes
- **Todos**: 12 items with priorities, categories, statistics
- **Expenses**: €836 tracked, category breakdown, top stores
- **AI Chatbot**: Streaming chat, 6 personalities, tool chips
- **LLM Manager**: 15 Ollama models, load/unload/pull/delete

## 🔌 MCP Server Configuration

The Vienna Life Assistant integrates with **6 specialized MCP servers**. Each MCP server requires its corresponding application/service to be installed and configured first.

### 1. Advanced Memory MCP (Knowledge Base)

**Required Application:** None (uses SQLite database)
```powershell
# Clone and setup
cd D:\Dev\repos
git clone https://github.com/sandraschi/advanced-memory-mcp.git
cd advanced-memory-mcp

# Install dependencies
pip install -r requirements.txt

# The MCP server will create its own SQLite database
```

**Configuration:**
- Path: `D:/Dev/repos/advanced-memory-mcp/src/advanced_memory/mcp/server.py`
- Tools: 18+ (search, read, write, navigation, skills)
- Database: Auto-created in project directory

### 2. Tapo MCP (Smart Home)

**Required Application:** Tapo Smart Home App + Hardware
```powershell
# Install Tapo app and setup devices first:
# 1. Download Tapo app from app store
# 2. Create Tapo account
# 3. Add smart devices (lights, cameras, plugs)
# 4. Get your account credentials

# Clone and setup MCP server
cd D:\Dev\repos
git clone https://github.com/sandraschi/tapo-mcp.git
cd tapo-mcp

# Install dependencies
pip install -r requirements.txt

# Configure credentials (see .env.example)
cp .env.example .env
# Edit .env with your Tapo username/password
```

**Configuration:**
- Path: `D:/Dev/repos/tapo-mcp/src/tapo_mcp/server.py`
- Tools: Weather, lights, cameras, Ring doorbell
- Requires: Tapo account credentials in `.env`

### 3. Plex MCP (Media Library)

**Required Application:** Plex Media Server
```powershell
# Install Plex Media Server first:
# 1. Download from: https://www.plex.tv/media-server-downloads/
# 2. Install and create Plex account
# 3. Add media libraries (movies, TV shows, anime)
# 4. Get your Plex token from settings

# Clone and setup MCP server
cd D:\Dev\repos
git clone https://github.com/sandraschi/plex-mcp.git
cd plex-mcp

# Install dependencies
pip install -r requirements.txt

# Configure (see .env.example)
cp .env.example .env
# Edit .env with:
# PLEX_URL=http://localhost:32400
# PLEX_TOKEN=your_plex_token_here
```

**Configuration:**
- Path: `D:/Dev/repos/plex-mcp/src/plex_mcp/server.py`
- Tools: Search, continue watching, recently added
- Requires: Plex server running + valid token

### 4. Calibre MCP (Ebook Library)

**Required Application:** Calibre Ebook Manager
```powershell
# Install Calibre first:
# 1. Download from: https://calibre-ebook.com/download
# 2. Install and add your ebook library
# 3. Organize books, add metadata
# 4. Start Calibre Content Server (optional)

# Clone and setup MCP server
cd D:\Dev\repos
git clone https://github.com/sandraschi/calibre-mcp.git
cd calibre-mcp

# Install dependencies
pip install -r requirements.txt

# Configure (see .env.example)
cp .env.example .env
# Edit .env with:
# CALIBRE_URL=http://localhost:8080 (if using Content Server)
# or set CALIBRE_LIBRARY_PATH to your local library folder
```

**Configuration:**
- Path: `D:/Dev/repos/calibre-mcp/src/calibre_mcp/server.py`
- Tools: Search books, reading progress, library stats
- Requires: Calibre installed + library accessible

### 5. Immich MCP (Photo Management)

**Required Application:** Immich Photo Server
```powershell
# Install Immich first (Docker recommended):
# 1. Follow Immich installation: https://immich.app/docs/install/docker-compose
# 2. Setup your photo library
# 3. Get API key from Immich settings

# Clone and setup MCP server
cd D:\Dev\repos
git clone https://github.com/sandraschi/immich-mcp.git
cd immich-mcp

# Install dependencies
pip install -r requirements.txt

# Configure (see .env.example)
cp .env.example .env
# Edit .env with:
# IMMICH_URL=http://localhost:2283
# IMMICH_API_KEY=your_api_key_here
```

**Configuration:**
- Path: `D:/Dev/repos/immich-mcp/src/immich_mcp/server.py`
- Tools: Recent photos, "today in history"
- Requires: Immich server running + API key

### 6. Ollama MCP (Local AI)

**Required Application:** Ollama
```powershell
# Install Ollama first:
# 1. Download from: https://ollama.ai/download
# 2. Install and start Ollama service
# 3. Pull models: ollama pull llama3.2:3b

# Clone and setup MCP server
cd D:\Dev\repos
git clone https://github.com/sandraschi/ollama-mcp.git
cd ollama-mcp

# Install dependencies
pip install -r requirements.txt

# Configure (see .env.example)
cp .env.example .env
# Edit .env with:
# OLLAMA_BASE_URL=http://localhost:11434
# OLLAMA_MODEL=llama3.2:3b
```

**Configuration:**
- Path: `D:/Dev/repos/ollama-mcp/src/ollama_mcp/server.py`
- Tools: Text generation, model management
- Requires: Ollama running with models loaded

### Environment Variables (Auto-detected)

The application automatically detects MCP servers if they're cloned in `D:\Dev\repos\`. Manual configuration:

```powershell
# Set these in your shell or .env file:
$env:ADVANCED_MEMORY_MCP_PATH="D:/Dev/repos/advanced-memory-mcp/src/advanced_memory/mcp/server.py"
$env:TAPO_MCP_PATH="D:/Dev/repos/tapo-mcp/src/tapo_mcp/server.py"
$env:PLEX_MCP_PATH="D:/Dev/repos/plex-mcp/src/plex_mcp/server.py"
$env:CALIBRE_MCP_PATH="D:/Dev/repos/calibre-mcp/src/calibre_mcp/server.py"
$env:IMMICH_MCP_PATH="D:/Dev/repos/immich-mcp/src/immich_mcp/server.py"
$env:OLLAMA_MCP_PATH="D:/Dev/repos/local-llm-mcp/src/llm_mcp/main.py"
```

### MCP Server Status

Check MCP server integration in the LLM tab of the web interface. Each MCP server shows:
- ✅ Connected (tools available)
- ⚠️ Not found (path incorrect)
- ❌ Error (configuration issue)

## 🌐 Access

### Local Access:
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000`
- API Docs: `http://localhost:8000/docs`

### Tailscale Access (from any device):
- Frontend: `http://goliath:3000`
- Backend API: `http://goliath:8000`

**CORS configured** for both localhost and Tailscale access!

## 🎯 Implementation Status

- ✅ **Phase 1**: Project setup, database, models
- ✅ **Phase 2**: Calendar, Todos, Shopping, Expenses
- ✅ **Phase 3**: AI Chatbot with 16 tools (Beta)
- ✅ **Phase 4**: MCP integrations (Advanced Memory, Tapo, Plex, Calibre)
- ✅ **Phase 5**: Mobile responsiveness (iPhone/iPad ready)
- ✅ **Phase 6**: Smart home integration (lights, cameras, weather)

## 🐕 Sample Data

Pre-loaded with realistic Vienna life data:
- **12 Todos**: Benny care, shopping, self-care
- **10 Calendar Events**: Vet appointments, coffee meetings
- **15 Expenses**: €836.10 total, 7 categories
- **Shopping Offers**: Spar/Billa weekly deals
- **15 Ollama Models**: Ready for AI chat

## 📝 Notes

- **Fully Docker containerized** - PostgreSQL, Redis, FastAPI, and React all in containers
- **Stable development environment** - No more local server crashes or dependency conflicts
- **Local AI** runs on your RTX 4070 or better (no cloud costs!)
- **German locale** for dates, Euro currency
- **Mobile responsive** - works on iPhone/iPad
- **Tailscale ready** - access from anywhere
- **MCP stdio transport** - proper FastMCP pattern

## 🔧 Troubleshooting

### Docker containers won't start
```powershell
# Check Docker Desktop is running
# Docker Desktop -> Settings -> Resources (ensure enough RAM/CPU allocated)

# Stop and rebuild
cd D:\Dev\repos\vienna-life-assistant
docker compose down
docker compose build --no-cache
docker compose up -d

# Check container logs
docker compose logs backend
docker compose logs frontend
```

### Port conflicts
```powershell
# Check what's using ports 7333-7336
Get-NetTCPConnection -LocalPort 7333,7334,7335,7336

# Stop conflicting services or change ports in docker-compose.yml
```

### CORS errors
Backend configured for `localhost:7333` and `goliath:7333`. Hard refresh: `Ctrl+Shift+R`

### Ollama integration issues
```powershell
# Check Ollama is running (outside Docker)
ollama list

# Pull required model
ollama pull llama3.2:3b

# Check MCP server can connect from Docker container
docker compose exec backend curl http://host.docker.internal:11434/api/tags
```

### MCP server connection issues
```powershell
# Verify MCP server paths exist
Get-ChildItem D:\Dev\repos\*\src\*\mcp\server.py

# Test individual MCP servers
cd D:\Dev\repos\advanced-memory-mcp
python -m pytest tests/ -v
```

## 🚀 Deployment

### Docker Production Deployment
```powershell
# Production deployment (rebuilds and restarts)
cd D:\Dev\repos\vienna-life-assistant
docker compose down
docker compose up -d --build

# View running services
docker compose ps

# Monitor logs
docker compose logs -f
```

### Windows Service (Alternative)
```powershell
# Install NSSM for Windows services
winget install NSSM

# Create Docker service
nssm install ViennaLifeDocker "C:\Program Files\Docker\Docker\Docker Desktop.exe" "docker compose up"
nssm set ViennaLifeDocker AppDirectory "D:\Dev\repos\vienna-life-assistant"
```

## 📚 Documentation

- `INTEGRATED_MCP_SERVERS.md` - Complete MCP ecosystem guide
- `FEATURES_ADDED.md` - Phase 2 features (Ollama, scrapers, UI)
- `TESTING.md` - Pytest guide, fixtures, test coverage
- `SQLITE_MIGRATION.md` - PostgreSQL → SQLite migration
- `ECOSYSTEM_INTEGRATION.md` - MCP integration architecture
- `COMPLETE.md` - Final project summary

## 🎉 Beta Highlights

- **16 AI tools** across 4 MCP servers (beta)
- **6 personalities** for different chat styles
- **Streaming responses** with real-time updates
- **Tool auto-detection** via smart pattern matching
- **Knowledge base integration** - AI has access to your notes
- **Smart home control** - Lights, cameras, Ring doorbell
- **Transit integration** - Vienna public transport
- **Beautiful UI** - Modern Material-UI design
- **Mobile responsive** - Looks great on iPhone/iPad
- **Flexible deployment** - Local Ollama or cloud LLM APIs (OpenAI/Anthropic)

## 📱 Ports

- **Frontend**: 7333 (Docker)
- **Backend API**: 7334 (Docker)
- **PostgreSQL**: 7335 (Docker, mapped from 5432)
- **Redis**: 7336 (Docker, mapped from 6379)
- **MyWienerLinien**: 3079 (if running)
- **Ollama**: 11434 (if running)
- **Plex**: 32400 (if running)
- **Calibre**: 8080 (if running)
- **Immich**: 2283 (if running)

## 🇦🇹 Austrian Features

- **Euro (€)** currency formatting
- **German dates** (Dezember, etc.)
- **Vienna-specific** chatbot personality
- **Local stores** (Spar, Billa, Manner Schnitten!)
- **Wiener Linien** integration
- **District knowledge** (Bezirke)

## 🔐 Privacy

- **100% local** - No cloud API calls (except optional web search)
- **Your hardware** - RTX 4070 or better runs all AI locally
- **Your data** - SQLite file on your machine
- **MCP servers** - All on your Tailscale network (goliath)

## 📄 License

Private project - All rights reserved to Sandra Schipal

---

**Built with ❤️ in Vienna's 9th District**

*For daily life management, Benny care, and keeping track of when you last washed your hair* 😄
