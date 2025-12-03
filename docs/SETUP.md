# Vienna Life Assistant - Setup Guide

**Last Updated**: 2025-12-03

## Prerequisites

### Required
- **Docker Desktop** (for PostgreSQL + Redis)
- **Node.js 20+** and **pnpm** (or npm)
- **Python 3.11+** and **pip**
- **Git**

### Optional
- **Visual Studio Code** with extensions:
  - Python
  - Pylance
  - ESLint
  - Prettier
  - Docker

## Initial Setup

### 1. Clone Repository
```powershell
cd D:\Dev\repos
git clone <repository-url> vienna-life-assistant
cd vienna-life-assistant
```

### 2. Environment Configuration

Create `.env` file in project root:
```powershell
Copy-Item .env.example .env
```

Edit `.env` and set:
- `SECRET_KEY` (generate with: `openssl rand -hex 32`)
- `MICROSOFT_CLIENT_ID` (from Azure AD app registration)
- `MICROSOFT_CLIENT_SECRET` (from Azure AD app registration)

### 3. Backend Setup

```powershell
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
.\venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Install Playwright browsers (for scraping)
playwright install chromium
```

### 4. Frontend Setup

```powershell
# Navigate to frontend (from project root)
cd frontend

# Install dependencies
pnpm install
# or: npm install
```

### 5. Database Setup

```powershell
# Start PostgreSQL and Redis
docker compose up -d postgres redis

# Wait for healthy status
docker compose ps

# Run migrations (once implemented)
cd backend
alembic upgrade head
```

## Running the Application

### Development Mode

**Terminal 1 - Backend:**
```powershell
cd D:\Dev\repos\vienna-life-assistant
docker compose up -d postgres redis
cd backend
.\venv\Scripts\Activate.ps1
uvicorn api.main:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 - Frontend:**
```powershell
cd D:\Dev\repos\vienna-life-assistant\frontend
pnpm dev
```

**Terminal 3 - Celery Worker (optional, for scrapers):**
```powershell
cd D:\Dev\repos\vienna-life-assistant\backend
.\venv\Scripts\Activate.ps1
celery -A workers.celery_app worker --loglevel=info
```

### Access Points
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **Redoc**: http://localhost:8000/redoc

### Using Docker Compose (Full Stack)

```powershell
# Start everything
docker compose up -d

# View logs
docker compose logs -f

# Stop everything
docker compose down
```

## Microsoft Outlook Integration Setup

### 1. Register Azure AD Application

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to "Azure Active Directory" → "App registrations"
3. Click "New registration"
4. Name: "Vienna Life Assistant"
5. Supported account types: "Personal Microsoft accounts only"
6. Redirect URI: `http://localhost:5173/auth/callback`
7. Click "Register"

### 2. Configure Application

1. Note the **Application (client) ID** → Add to `.env` as `MICROSOFT_CLIENT_ID`
2. Go to "Certificates & secrets" → "New client secret"
3. Note the secret **Value** → Add to `.env` as `MICROSOFT_CLIENT_SECRET`
4. Go to "API permissions" → "Add a permission" → "Microsoft Graph"
5. Add delegated permissions:
   - `Calendars.ReadWrite`
   - `User.Read`
6. Click "Grant admin consent" (if applicable)

### 3. Test Authentication

1. Start the application
2. Navigate to http://localhost:5173
3. Click "Connect Outlook"
4. Sign in with Microsoft account
5. Grant permissions
6. Verify calendar events appear

## Database Migrations

```powershell
cd backend

# Create new migration
alembic revision --autogenerate -m "description"

# Apply migrations
alembic upgrade head

# Rollback one migration
alembic downgrade -1

# View migration history
alembic history
```

## Testing

### Backend Tests
```powershell
cd backend
pytest
pytest --cov=api --cov-report=html
```

### Frontend Tests
```powershell
cd frontend
pnpm test
pnpm test:coverage
```

## Troubleshooting

### Port Already in Use
```powershell
# Find process using port 8000
netstat -ano | findstr :8000

# Kill process
Stop-Process -Id <PID> -Force
```

### Database Connection Issues
```powershell
# Check if PostgreSQL is running
docker compose ps postgres

# View PostgreSQL logs
docker compose logs postgres

# Restart PostgreSQL
docker compose restart postgres
```

### Frontend Build Errors
```powershell
# Clear node_modules and reinstall
cd frontend
Remove-Item -Recurse -Force node_modules
pnpm install
```

### Python Import Errors
```powershell
# Ensure virtual environment is activated
cd backend
.\venv\Scripts\Activate.ps1

# Reinstall dependencies
pip install -r requirements.txt
```

## Development Workflow

### Making Changes

1. **Backend API changes:**
   - Edit files in `backend/`
   - FastAPI auto-reloads
   - Check http://localhost:8000/docs

2. **Frontend changes:**
   - Edit files in `frontend/src/`
   - Vite hot-reloads automatically
   - Check browser console for errors

3. **Database schema changes:**
   - Edit models in `backend/models/`
   - Create migration: `alembic revision --autogenerate -m "description"`
   - Apply: `alembic upgrade head`

4. **Docker changes:**
   - After Dockerfile/requirements.txt changes:
   ```powershell
   docker compose down
   docker compose build
   docker compose up -d
   ```

### Debugging

**Backend:**
- Use VS Code debugger with Python extension
- Or add: `import pdb; pdb.set_trace()`
- Check logs: `docker compose logs backend`

**Frontend:**
- Use browser DevTools
- React DevTools extension
- Check console for errors

## Next Steps

1. ✅ Initial setup complete
2. [ ] Implement calendar API endpoints
3. [ ] Implement todos API endpoints
4. [ ] Create calendar UI component
5. [ ] Create todos UI component
6. [ ] Implement Outlook OAuth flow
7. [ ] Add expense tracking
8. [ ] Implement store scrapers

## Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [Material-UI](https://mui.com/)
- [Microsoft Graph API](https://learn.microsoft.com/en-us/graph/)
- [SQLAlchemy 2.0](https://docs.sqlalchemy.org/)

