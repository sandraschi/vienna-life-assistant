# Vienna Life Assistant - Project Status

**Created**: 2025-12-03  
**Status**: ✅ Initial Scaffold Complete  

## 🎉 What's Been Created

### ✅ Complete Project Structure
```
vienna-life-assistant/
├── 📁 backend/              FastAPI backend with models, API, workers
├── 📁 frontend/             React + TypeScript + Material-UI
├── 📁 desktop/              Tauri desktop app (future)
├── 📁 mobile/               iOS/macOS scaffolds (future)
├── 📁 shared/               Shared API types
├── 📁 docs/                 Documentation (SETUP, ARCHITECTURE)
├── 🐳 docker-compose.yml    PostgreSQL + Redis + Celery
├── 📋 .cursorrules          Project standards
├── 🚀 start-dev.ps1         Quick start script
└── 📖 README.md             Project overview
```

### ✅ Backend (FastAPI + Python)
- FastAPI application with health check endpoint
- SQLAlchemy database models (base setup)
- Docker configuration for development
- Celery worker setup for background tasks
- Requirements.txt with all dependencies
- Modular structure for calendar, todos, shopping, scrapers

### ✅ Frontend (React + TypeScript)
- React 18 with TypeScript and Vite
- Material-UI component library
- Beautiful landing page with feature cards
- Zustand for state management (ready to configure)
- React Query for server state (ready to configure)
- Modular feature structure (calendar, todos, shopping, expenses)
- Responsive design with modern gradient hero

### ✅ Configuration Files
- Docker Compose for PostgreSQL, Redis, Celery
- Vite configuration with API proxy
- TypeScript strict mode configuration
- ESLint and Prettier setup
- Environment variable template (.env.example)

### ✅ Documentation
- **README.md**: Project overview and quick start
- **docs/SETUP.md**: Detailed setup instructions with Azure AD
- **docs/ARCHITECTURE.md**: System architecture and data flow
- **.cursorrules**: Project-specific development standards

## 🚦 Quick Start

### 1. Install Dependencies

**Backend:**
```powershell
cd D:\Dev\repos\vienna-life-assistant\backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
playwright install chromium  # For web scraping
```

**Frontend:**
```powershell
cd D:\Dev\repos\vienna-life-assistant\frontend
pnpm install
```

### 2. Start Development

**Easy Way (Recommended):**
```powershell
cd D:\Dev\repos\vienna-life-assistant
.\start-dev.ps1
# Then follow on-screen instructions
```

**Manual Way:**
```powershell
# Terminal 1: Start databases
docker compose up -d postgres redis

# Terminal 2: Start backend
cd backend
.\venv\Scripts\Activate.ps1
uvicorn api.main:app --reload

# Terminal 3: Start frontend
cd frontend
pnpm dev
```

### 3. Access Application
- **Frontend**: http://localhost:5173 (Beautiful landing page!)
- **Backend API**: http://localhost:7334
- **API Docs**: http://localhost:7334/docs
- **Health Check**: http://localhost:7334/health

## 📋 Next Steps (Phase 1 MVP)

### Immediate (Week 1)
- [ ] Set up Python virtual environment
- [ ] Install all dependencies (backend + frontend)
- [ ] Create database models:
  - [ ] CalendarEvent model
  - [ ] TodoItem model
  - [ ] ShoppingItem model
  - [ ] Expense model
- [ ] Set up Alembic migrations
- [ ] Create initial migration

### Backend Development (Weeks 1-2)
- [ ] Calendar API endpoints (CRUD)
- [ ] Todo API endpoints (CRUD)
- [ ] Shopping API endpoints (CRUD)
- [ ] Expense API endpoints (CRUD)
- [ ] Pydantic schemas for validation
- [ ] Error handling middleware
- [ ] CORS configuration

### Frontend Development (Weeks 1-2)
- [ ] Create Zustand stores for each feature
- [ ] Build Calendar view component (react-big-calendar)
- [ ] Build Todo list component
- [ ] Build Shopping list component
- [ ] Build Expense tracker component
- [ ] Create API service layer (axios)
- [ ] Add routing (react-router)
- [ ] Form validation (react-hook-form)

### Microsoft Outlook Integration (Week 2)
- [ ] Register app in Azure AD portal
- [ ] Configure OAuth2 redirect URIs
- [ ] Implement OAuth2 flow in backend
- [ ] Create Outlook service (Microsoft Graph API)
- [ ] Sync calendar events (bidirectional)
- [ ] Handle token refresh
- [ ] Test with real Outlook account

### Polish & Testing (Week 3)
- [ ] Error boundaries and error handling
- [ ] Loading states and skeletons
- [ ] Dark mode toggle
- [ ] German/English language toggle
- [ ] Responsive design improvements
- [ ] Backend tests (pytest)
- [ ] Frontend tests (React Testing Library)

## 🎨 Current Features

### Landing Page (Live!)
The frontend already has a beautiful landing page showing:
- Gradient hero with app name and tagline
- 4 feature cards: Calendar, Todos, Shopping, Expenses
- Status indicator showing development phase
- Fully responsive Material-UI design

Visit http://localhost:5173 after starting the dev server!

## 📚 Key Technologies

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| Frontend Framework | React | 18.2+ | UI library |
| Language | TypeScript | 5.3+ | Type safety |
| UI Library | Material-UI | 5.15+ | Components |
| State Management | Zustand | 4.5+ | Client state |
| Server State | React Query | 5.17+ | API caching |
| Build Tool | Vite | 5.0+ | Fast dev server |
| Backend Framework | FastAPI | 0.109+ | Python API |
| Database | PostgreSQL | 16 | Primary data store |
| Cache | Redis | 7 | Caching & Celery |
| Task Queue | Celery | 5.3+ | Background jobs |
| ORM | SQLAlchemy | 2.0+ | Database access |
| Web Scraping | Playwright | 1.41+ | Store scrapers |

## 🔐 Microsoft Outlook Setup

To enable Outlook integration:

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to "Azure Active Directory" → "App registrations"
3. Create new app registration:
   - Name: "Vienna Life Assistant"
   - Account type: "Personal Microsoft accounts only"
   - Redirect URI: `http://localhost:5173/auth/callback`
4. Note **Client ID** → Add to `.env`
5. Create **Client Secret** → Add to `.env`
6. Add permissions: `Calendars.ReadWrite`, `User.Read`

See `docs/SETUP.md` for detailed instructions.

## 🛠️ Development Tips

### Rebuilding Docker Containers
After code changes to backend:
```powershell
docker compose down
docker compose build
docker compose up -d
```

Only use `--no-cache` for dependency changes (requirements.txt).

### Database Migrations
```powershell
cd backend
.\venv\Scripts\Activate.ps1
alembic revision --autogenerate -m "description"
alembic upgrade head
```

### Debugging
- **Backend**: Check http://localhost:7334/docs for interactive API docs
- **Frontend**: Use React DevTools browser extension
- **Database**: `docker compose logs postgres`
- **Redis**: `docker compose logs redis`

## 📖 Documentation

All documentation is in the `docs/` folder:
- **SETUP.md**: Complete setup guide with troubleshooting
- **ARCHITECTURE.md**: System architecture, data flow, security

## 🎯 Project Goals

### Phase 1 MVP (3 weeks)
✅ **Status**: Scaffold complete, ready for implementation

Core features:
- Calendar with Outlook sync
- Todo list with recurring tasks
- Manual expense tracking
- Beautiful, responsive UI

### Phase 2 (2 weeks)
- Spar.at & Billa.at offer scrapers
- Smart shopping lists
- Price history tracking

### Phase 3 (2 weeks)
- Natural language input
- Receipt OCR
- Expense analytics
- Dark mode

### Phase 4 (1 week)
- Tauri desktop app

### Phase 5 (1 week)
- iOS/macOS scaffolds

## 🌟 Special Features

### Austrian Locale
- Currency: Euro (€)
- Stores: Spar, Billa, Hofer, DM, Fressnapf
- Date format: DD.MM.YYYY
- Timezone: Europe/Vienna

### Use Cases
- Track Benny's vet appointments 🐕
- Never forget to buy condiments 🧂
- See Spar/Billa offers this week 🛒
- Monitor monthly spending 💰
- Schedule hair washing 💇‍♀️

## 🤝 Contributing (Future)

This is currently a personal project. May be open-sourced in the future.

## 📝 Notes

- Project follows Windows/PowerShell standards (no Linux syntax)
- All dates use Europe/Vienna timezone
- Docker rebuild required after code changes
- Consult `mcp-central-docs` for MCP server patterns
- Advanced Memory note created with full project plan

## ✨ Next Session

When you're ready to continue development:

1. **Run the setup:**
   ```powershell
   cd D:\Dev\repos\vienna-life-assistant
   .\start-dev.ps1
   ```

2. **Pick a feature to implement:**
   - Calendar API + UI
   - Todo list API + UI
   - Shopping list API + UI
   - Expense tracker API + UI

3. **Or set up integrations:**
   - Microsoft Outlook OAuth
   - Spar.at web scraper
   - Billa.at web scraper

---

**🎉 Ready to build something awesome!**

