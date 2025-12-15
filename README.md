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

A beautiful, modern personal life management app with **AI chatbot**, calendar, todos, expenses, and shopping - integrated with your entire digital ecosystem via MCP servers.

## 🎯 What It Does

Your **personal command center** for Vienna life:
- 📅 **Calendar**: Day/Week/Month views, Benny appointments, events
- ✅ **Smart Todos**: 12 categories, priorities, filters, statistics
- 💰 **Expense Tracking**: €836+ tracked, 7 categories, top stores
- 🛒 **Shopping**: Spar/Billa offers, smart lists
- 🤖 **AI Chatbot**: 16 integrated tools, 6 personalities, streaming responses
- 🏠 **Smart Home**: Lights, cameras, Ring doorbell (via Tapo MCP)
- 🧠 **Knowledge Base**: Search/read/create notes (Advanced Memory MCP)
- 📚 **Media Hub**: 50k anime, 15k ebooks (Plex/Calibre MCP)
- 🚊 **Transit**: Wiener Linien integration (U-Bahn, Tram, Bus)

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

### Prerequisites
- Python 3.11+
- Node.js 20+
- Ollama (for local LLM)

### 1. Backend Setup

```powershell
cd D:\Dev\repos\vienna-life-assistant\backend

# Create virtual environment
python -m venv venv
.\venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Start backend
uvicorn api.main:app --reload --host 0.0.0.0 --port 9001
```

### 2. Frontend Setup

```powershell
cd D:\Dev\repos\vienna-life-assistant\frontend

# Install dependencies
npm install

# Start frontend
npm run dev
```

### 3. Access

- **Local**: http://localhost:9173
- **Tailscale**: http://goliath:9173

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
- **SQLite** - Local database (no Docker needed!)
- **SQLAlchemy** - ORM with Pydantic v2
- **Ollama** - Local LLM (RTX 4090 powered)
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

**SQLite** with 6 models:
- `todos` - Task management (12+ items)
- `calendar_events` - Schedule (10+ events)
- `shopping_items` - Grocery lists
- `expenses` - Expense tracking (€836+ tracked)
- `conversations` - Chat history
- `messages` - Chat messages

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

### Required MCP Servers (all on goliath):

1. **Advanced Memory MCP**
   - Path: `D:/Dev/repos/advanced-memory-mcp/src/advanced_memory/mcp/server.py`
   - Tools: 18+ (search, read, write, navigation, skills)

2. **Tapo MCP**
   - Path: `D:/Dev/repos/tapo-camera-mcp/src/tapo_camera_mcp/server.py`
   - Tools: Weather, lights, cameras, Ring, Nest

3. **Plex MCP**
   - Path: `D:/Dev/repos/plex-mcp/src/plex_mcp/server.py`
   - Library: 50,000+ anime/movies

4. **Calibre MCP**
   - Path: `D:/Dev/repos/calibre-mcp/src/calibre_mcp/server.py`
   - Library: 15,000+ ebooks

5. **Immich MCP** (optional)
   - Path: `D:/Dev/repos/immich-mcp/src/immich_mcp/server.py`
   - Photos and memories

### Set Environment Variables (optional):

```powershell
$env:ADVANCED_MEMORY_MCP_PATH="D:/Dev/repos/advanced-memory-mcp/src/advanced_memory/mcp/server.py"
$env:TAPO_MCP_PATH="D:/Dev/repos/tapo-camera-mcp/src/tapo_camera_mcp/server.py"
$env:PLEX_MCP_PATH="D:/Dev/repos/plex-mcp/src/plex_mcp/server.py"
$env:CALIBRE_MCP_PATH="D:/Dev/repos/calibre-mcp/src/calibre_mcp/server.py"
```

## 🌐 Access

### Local Access:
- Frontend: `http://localhost:9173`
- Backend API: `http://localhost:9001`
- API Docs: `http://localhost:9001/docs`

### Tailscale Access (from any device):
- Frontend: `http://goliath:9173`
- Backend API: `http://goliath:9001`

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

- **No Docker required!** Uses SQLite for simplicity
- **Local AI** runs on your RTX 4090 (no cloud costs!)
- **German locale** for dates, Euro currency
- **Mobile responsive** - works on iPhone/iPad
- **Tailscale ready** - access from anywhere
- **MCP stdio transport** - proper FastMCP pattern

## 🔧 Troubleshooting

### Backend won't start
```powershell
# Check if port 9001 is in use
Get-NetTCPConnection -LocalPort 9001
# Kill process if needed
Stop-Process -Id <PID> -Force
```

### Frontend won't load
```powershell
# Clear npm cache
cd frontend
rm -r node_modules
npm install
```

### CORS errors
Backend already configured for `localhost:9173` and `goliath:9173`. Hard refresh: `Ctrl+Shift+R`

### Ollama not found
```powershell
# Install Ollama
winget install Ollama.Ollama

# Pull default model
ollama pull llama3.2:3b
```

## 🚀 Deployment

### Windows Service (Production)
```powershell
# Install NSSM
winget install NSSM

# Create backend service
nssm install ViennaLifeBackend "D:\Dev\repos\vienna-life-assistant\backend\venv\Scripts\python.exe" "-m uvicorn api.main:app --host 0.0.0.0 --port 9001"

# Create frontend service
nssm install ViennaLifeFrontend "npm" "run dev"
nssm set ViennaLifeFrontend AppDirectory "D:\Dev\repos\vienna-life-assistant\frontend"
```

## 📚 Documentation

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
- **No cloud dependencies** - Everything runs locally

## 📱 Ports

- **Backend**: 9001
- **Frontend**: 9173
- **MyWienerLinien**: 3079 (if running)

## 🇦🇹 Austrian Features

- **Euro (€)** currency formatting
- **German dates** (Dezember, etc.)
- **Vienna-specific** chatbot personality
- **Local stores** (Spar, Billa, Manner Schnitten!)
- **Wiener Linien** integration
- **District knowledge** (Bezirke)

## 🔐 Privacy

- **100% local** - No cloud API calls (except optional web search)
- **Your hardware** - RTX 4090 runs all AI
- **Your data** - SQLite file on your machine
- **MCP servers** - All on your Tailscale network (goliath)

## 📄 License

Private project - All rights reserved to Sandra Schipal

---

**Built with ❤️ in Vienna's 9th District**

*For daily life management, Benny care, and keeping track of when you last washed your hair* 😄
