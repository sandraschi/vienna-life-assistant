# Troubleshooting Guide

**Date**: 2025-12-03

## Issue: "Create Todo" Button Does Nothing

### Root Cause
Docker Desktop is not running, so PostgreSQL database is not available. Backend returns 500 error when trying to create todos.

### Solution

**Step 1: Start Docker Desktop**
```powershell
# Open Docker Desktop application
# Wait for it to fully start (whale icon in system tray should be steady)
```

**Step 2: Start Database Services**
```powershell
cd D:\Dev\repos\vienna-life-assistant
docker compose up -d postgres redis
```

**Step 3: Verify Database is Running**
```powershell
docker compose ps
# Should show vla-postgres and vla-redis as "running" and "healthy"
```

**Step 4: Restart Backend**
```powershell
# Stop any running backend processes
# Then start fresh:
cd D:\Dev\repos\vienna-life-assistant\backend
.\venv\Scripts\Activate.ps1
uvicorn api.main:app --reload --host 0.0.0.0 --port 9001
```

**Step 5: Test in Browser**
1. Open http://localhost:9173
2. Click "Todos" tab
3. Click "Add Todo"
4. Enter title and click "Create"
5. Should work now!

### Quick Test from Command Line

```powershell
# Test if backend can create todos
Invoke-RestMethod -Uri "http://localhost:9001/api/todos/" `
  -Method Post `
  -ContentType "application/json" `
  -Body '{"title":"Test Todo","priority":"normal"}'
```

If this works, the frontend will work too.

## Common Issues

### 1. Docker Desktop Not Running
**Symptoms**: 
- `docker compose` commands fail
- Backend returns 500 errors
- Frontend shows "Failed to load todos"

**Solution**: Start Docker Desktop and wait for it to be ready

### 2. Port Already in Use
**Symptoms**:
- Backend won't start
- "Address already in use" error

**Solution**:
```powershell
# Find process on port 9001
$pid = Get-NetTCPConnection -LocalPort 9001 | Select-Object -ExpandProperty OwningProcess
Stop-Process -Id $pid -Force
```

### 3. Database Not Healthy
**Symptoms**:
- Backend starts but database operations fail
- "Connection refused" errors

**Solution**:
```powershell
# Restart database
docker compose restart postgres
# Wait 10 seconds
Start-Sleep -Seconds 10
# Check status
docker compose ps postgres
```

### 4. Frontend Can't Connect to Backend
**Symptoms**:
- Frontend loads but API calls fail
- Network errors in browser console

**Solution**:
- Check backend is running on port 9001
- Check `http://localhost:9001/health` in browser
- Verify CORS settings in backend

### 5. Migrations Not Applied
**Symptoms**:
- "Table does not exist" errors
- "Column does not exist" errors

**Solution**:
```powershell
cd D:\Dev\repos\vienna-life-assistant\backend
.\venv\Scripts\Activate.ps1
alembic upgrade head
```

## Checking Logs

### Backend Logs
Backend runs in a PowerShell window - check that window for error messages

### Database Logs
```powershell
docker compose logs postgres
```

### Frontend Logs
Open browser DevTools (F12) → Console tab

## Complete Restart

If nothing works, do a complete restart:

```powershell
# 1. Stop everything
docker compose down
# Kill any backend/frontend processes

# 2. Start database
docker compose up -d postgres redis
Start-Sleep -Seconds 10

# 3. Start backend (new window)
cd D:\Dev\repos\vienna-life-assistant\backend
.\venv\Scripts\Activate.ps1
uvicorn api.main:app --reload --host 0.0.0.0 --port 9001

# 4. Start frontend (new window)
cd D:\Dev\repos\vienna-life-assistant\frontend
pnpm dev

# 5. Open browser
Start-Process "http://localhost:9173"
```

## Verification Checklist

- [ ] Docker Desktop is running
- [ ] `docker compose ps` shows postgres and redis as healthy
- [ ] Backend responds at http://localhost:9001/health
- [ ] Frontend loads at http://localhost:9173
- [ ] Can create todos via API (PowerShell test above)
- [ ] Can create todos via UI

## Still Not Working?

Check:
1. Windows Firewall isn't blocking ports 9001, 9173
2. Antivirus isn't blocking Docker or Python
3. Disk space available (Docker needs space)
4. PostgreSQL port 5432 not used by another service

## Contact/Support

Check these files for more info:
- `README.md` - Project overview
- `docs/SETUP.md` - Detailed setup guide
- `IMPLEMENTATION_STATUS.md` - Current status
- `FEATURES_ADDED.md` - Feature documentation

