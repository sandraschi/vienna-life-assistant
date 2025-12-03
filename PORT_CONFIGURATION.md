# Port Configuration

**Date**: 2025-12-03  
**Status**: ✅ Updated to meet requirements

## Current Port Assignments

### Application Ports
- **Frontend**: `9173` ✅ (>= 9000, no 00 ending)
- **Backend API**: `9001` ✅ (>= 9000, no 00 ending)

### Infrastructure Ports  
- **PostgreSQL**: `5432` (standard PostgreSQL port, internal)
- **Redis**: `6380` (internal, changed from 6379 to avoid conflict)

## Requirements Met

✅ All application ports are >= 9000  
✅ No ports end with 00  
✅ No conflicts with other services

## Access URLs

- **Frontend**: http://localhost:9173
- **Backend API**: http://localhost:9001
- **API Docs**: http://localhost:9001/docs
- **Redoc**: http://localhost:9001/redoc

## Changed From

Previous configuration:
- Frontend: ~~5173~~ → **9173**
- Backend: ~~8000~~ → **9001**

## Configuration Files Updated

1. `frontend/vite.config.ts` - Dev server port and API proxy
2. `frontend/src/services/api.ts` - API base URL
3. `docker-compose.yml` - Backend container port mapping
4. `backend/Dockerfile` - Exposed port
5. `start-dev.ps1` - Startup script instructions
6. `README.md` - Documentation
7. `FRONTEND_GUIDE.md` - Frontend documentation
8. `IMPLEMENTATION_STATUS.md` - Implementation docs

## Development Commands

### Start Backend
```powershell
cd D:\Dev\repos\vienna-life-assistant\backend
.\venv\Scripts\Activate.ps1
uvicorn api.main:app --reload --host 0.0.0.0 --port 9001
```

### Start Frontend
```powershell
cd D:\Dev\repos\vienna-life-assistant\frontend
pnpm dev
```

The frontend will automatically start on port 9173 and proxy API requests to port 9001.

## Docker Compose

When using Docker Compose, the backend runs on port 9001 inside the container and is exposed on host port 9001.

```powershell
docker compose up -d
```

## Notes

- Database ports (5432, 6380) remain unchanged as they are standard/internal ports
- Frontend hot-reload works on the new port
- API proxy automatically forwards `/api/*` requests to backend
- All documentation has been updated to reflect new ports

