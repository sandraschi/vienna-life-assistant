# Vienna Life Assistant

**Timestamp**: 2025-12-03  
**Status**: Initial Setup  

A beautiful, modular personal life management app combining calendaring, todo management, and shopping/expense tracking. Built for real-world mundane tasks like tracking condiments, hair washing schedules, vet appointments, and Austrian grocery store offers (Spar, Billa).

## Features

- 📅 **Calendar**: Outlook/Microsoft Graph integration with beautiful views
- ✅ **Smart Todos**: Recurring tasks, context-based lists, priorities
- 🛒 **Shopping Intelligence**: Spar/Billa offer scrapers, smart lists
- 💰 **Expense Tracking**: Receipt OCR, categories, budgets, analytics
- 🇦🇹 **Austrian Locale**: Euro, German/English, local stores

## Tech Stack

### Frontend (Web)
- React 18 + TypeScript
- Material-UI (MUI) v5
- Zustand state management
- react-big-calendar
- Recharts for visualizations

### Backend
- FastAPI (Python 3.11+)
- PostgreSQL + SQLAlchemy
- Redis (caching)
- Celery (task queue)
- WebSocket support

### Desktop
- Tauri (Rust + web frontend)
- System tray integration
- Offline mode

### Mobile (Scaffolds)
- iOS: SwiftUI
- macOS: SwiftUI

## Quick Start

### Prerequisites
- Docker Desktop
- Node.js 20+
- Python 3.11+
- pnpm (recommended) or npm

### Development Setup

```powershell
# Clone and setup
cd D:\Dev\repos\vienna-life-assistant

# Start backend + database
docker compose up -d

# Install frontend dependencies
cd frontend
pnpm install

# Start frontend dev server
pnpm dev
```

Visit: http://localhost:9173

## Project Structure

```
vienna-life-assistant/
├── backend/              # FastAPI backend
├── frontend/             # React web app
├── desktop/              # Tauri desktop app
├── mobile/               # iOS/macOS scaffolds
└── shared/               # Shared API types
```

## Implementation Phases

- [x] Phase 1: Project setup
- [ ] Phase 1: MVP Web App (Calendar + Todos)
- [ ] Phase 2: Shopping Intelligence (Store scrapers)
- [ ] Phase 3: Advanced Features (NLP, OCR, analytics)
- [ ] Phase 4: Desktop App (Tauri)
- [ ] Phase 5: Mobile Scaffolds

## Documentation

See `docs/` for detailed documentation:
- Architecture decisions
- API documentation
- Design system
- Deployment guide

## License

Private project - All rights reserved

