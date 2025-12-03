# Vienna Life Assistant - Architecture

**Last Updated**: 2025-12-03

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Calendar │  │  Todos   │  │ Shopping │  │ Expenses │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
│       │             │              │              │          │
│       └─────────────┴──────────────┴──────────────┘          │
│                          │                                   │
│                    React Router                              │
│                          │                                   │
│                     API Client                               │
└──────────────────────────┼──────────────────────────────────┘
                           │ HTTP/WebSocket
┌──────────────────────────┼──────────────────────────────────┐
│                     FastAPI Backend                          │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              API Routes (REST + WebSocket)             │ │
│  └───┬─────────┬─────────┬──────────┬────────────────────┘ │
│      │         │         │          │                       │
│  ┌───▼───┐ ┌──▼────┐ ┌──▼─────┐ ┌──▼────────┐             │
│  │Calendar│ │ Todos │ │Shopping│ │  Scrapers │             │
│  │Service │ │Service│ │Service │ │  (Celery) │             │
│  └───┬───┘ └──┬────┘ └──┬─────┘ └──┬────────┘             │
│      └────────┼─────────┼──────────┘                        │
│               │         │                                   │
│         ┌─────▼─────────▼────┐                              │
│         │   SQLAlchemy ORM   │                              │
│         └─────────┬───────────┘                              │
└───────────────────┼──────────────────────────────────────────┘
                    │
┌───────────────────┼──────────────────────────────────────────┐
│           Data Layer                                          │
│  ┌────────────────▼────────────┐  ┌────────────────────┐   │
│  │       PostgreSQL             │  │      Redis         │   │
│  │  - Calendar events           │  │  - Cache           │   │
│  │  - Todos                     │  │  - Celery broker   │   │
│  │  - Shopping lists            │  │  - Store offers    │   │
│  │  - Expenses                  │  │  - Sessions        │   │
│  └──────────────────────────────┘  └────────────────────┘   │
└───────────────────────────────────────────────────────────────┘
                    │
┌───────────────────┼──────────────────────────────────────────┐
│        External Services                                      │
│  ┌──────────────────────┐  ┌──────────────────────────┐     │
│  │  Microsoft Graph API │  │  Web Scraping (Celery)   │     │
│  │  - Outlook Calendar  │  │  - Spar.at               │     │
│  │  - OAuth2 Auth       │  │  - Billa.at              │     │
│  └──────────────────────┘  └──────────────────────────┘     │
└───────────────────────────────────────────────────────────────┘
```

## Component Breakdown

### Frontend (React + TypeScript)

**State Management:**
- **Zustand stores** for local state (todos, shopping lists, UI state)
- **React Query** for server state (calendar events, expenses)
- **React Hook Form** for form state

**Key Components:**
```
src/
├── features/
│   ├── calendar/
│   │   ├── CalendarView.tsx      # Main calendar component
│   │   ├── EventModal.tsx        # Create/edit events
│   │   ├── useCalendar.ts        # Calendar hook
│   │   └── calendarStore.ts      # Zustand store
│   ├── todos/
│   │   ├── TodoList.tsx          # Todo list component
│   │   ├── TodoItem.tsx          # Individual todo
│   │   ├── useTodos.ts           # Todos hook
│   │   └── todosStore.ts         # Zustand store
│   ├── shopping/
│   │   ├── ShoppingList.tsx      # Shopping list
│   │   ├── OffersFeed.tsx        # Spar/Billa offers
│   │   ├── useShopping.ts        # Shopping hook
│   │   └── shoppingStore.ts      # Zustand store
│   └── expenses/
│       ├── ExpenseTracker.tsx    # Expense entry
│       ├── ExpenseCharts.tsx     # Visualizations
│       ├── useExpenses.ts        # Expenses hook
│       └── expensesStore.ts      # Zustand store
├── components/
│   ├── Layout.tsx                # App shell
│   ├── Navigation.tsx            # Nav bar
│   └── ErrorBoundary.tsx         # Error handling
├── services/
│   └── api.ts                    # API client (axios)
└── hooks/
    ├── useAuth.ts                # OAuth authentication
    └── useWebSocket.ts           # Real-time updates
```

### Backend (FastAPI + Python)

**API Structure:**
```
backend/
├── api/
│   ├── main.py                   # App entry, CORS, middleware
│   ├── calendar/
│   │   ├── __init__.py
│   │   ├── routes.py             # Calendar endpoints
│   │   └── schemas.py            # Pydantic models
│   ├── todos/
│   │   ├── __init__.py
│   │   ├── routes.py             # Todo endpoints
│   │   └── schemas.py            # Pydantic models
│   ├── shopping/
│   │   ├── __init__.py
│   │   ├── routes.py             # Shopping endpoints
│   │   └── schemas.py            # Pydantic models
│   └── scrapers/
│       ├── __init__.py
│       ├── spar.py               # Spar scraper
│       └── billa.py              # Billa scraper
├── models/
│   ├── base.py                   # SQLAlchemy base
│   ├── calendar.py               # CalendarEvent model
│   ├── todo.py                   # TodoItem model
│   ├── shopping.py               # ShoppingItem, StoreOffer
│   └── expense.py                # Expense model
├── services/
│   ├── calendar_service.py       # Business logic
│   ├── todo_service.py           # Business logic
│   ├── shopping_service.py       # Business logic
│   ├── expense_service.py        # Business logic
│   └── outlook_service.py        # Microsoft Graph integration
└── workers/
    ├── celery_app.py             # Celery configuration
    ├── scraping_tasks.py         # Scheduled scraping
    └── sync_tasks.py             # Outlook sync
```

## Data Flow

### Calendar Sync Flow

```
1. User opens app
   ↓
2. Frontend requests calendar events
   ↓
3. Backend checks database for recent sync
   ↓
4. If stale, fetch from Microsoft Graph API
   ↓
5. Store in PostgreSQL
   ↓
6. Return to frontend
   ↓
7. Frontend renders calendar
   ↓
8. User creates new event
   ↓
9. Frontend POSTs to backend
   ↓
10. Backend saves to database
    ↓
11. Backend pushes to Outlook (Graph API)
    ↓
12. WebSocket notifies all clients
```

### Store Scraping Flow

```
1. Celery Beat triggers daily at 6 AM
   ↓
2. Celery worker starts scraping task
   ↓
3. Playwright opens Spar.at/Billa.at
   ↓
4. Extract products, prices, validity dates
   ↓
5. Store in Redis (fast access)
   ↓
6. Store in PostgreSQL (history)
   ↓
7. WebSocket notifies frontend
   ↓
8. Frontend updates offers feed
```

## Database Schema

### Core Tables

**calendar_events**
```sql
CREATE TABLE calendar_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    category VARCHAR(50),
    location VARCHAR(255),
    outlook_id VARCHAR(255) UNIQUE,
    color VARCHAR(7),
    recurrence_rule JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**todo_items**
```sql
CREATE TABLE todo_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    due_date TIMESTAMP WITH TIME ZONE,
    priority VARCHAR(20) DEFAULT 'normal',
    category VARCHAR(50),
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP WITH TIME ZONE,
    recurrence_rule JSONB,
    linked_event_id UUID REFERENCES calendar_events(id),
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**shopping_items**
```sql
CREATE TABLE shopping_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    quantity NUMERIC(10, 2),
    unit VARCHAR(20),
    estimated_price NUMERIC(10, 2),
    store_preference VARCHAR(50),
    purchased BOOLEAN DEFAULT FALSE,
    list_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**expenses**
```sql
CREATE TABLE expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'EUR',
    category VARCHAR(50),
    store VARCHAR(100),
    description TEXT,
    receipt_image VARCHAR(255),
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**store_offers**
```sql
CREATE TABLE store_offers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store VARCHAR(50) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    original_price NUMERIC(10, 2),
    discounted_price NUMERIC(10, 2),
    discount_percentage INTEGER,
    valid_from DATE,
    valid_until DATE,
    category VARCHAR(100),
    image_url VARCHAR(500),
    scraped_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(store, product_name, valid_from)
);
```

### Indexes

```sql
-- Calendar events
CREATE INDEX idx_calendar_start ON calendar_events(start_time);
CREATE INDEX idx_calendar_outlook ON calendar_events(outlook_id);

-- Todos
CREATE INDEX idx_todos_due ON todo_items(due_date);
CREATE INDEX idx_todos_completed ON todo_items(completed);

-- Expenses
CREATE INDEX idx_expenses_date ON expenses(date);
CREATE INDEX idx_expenses_category ON expenses(category);

-- Store offers
CREATE INDEX idx_offers_store ON store_offers(store);
CREATE INDEX idx_offers_valid ON store_offers(valid_from, valid_until);
```

## Authentication Flow

```
1. User clicks "Connect Outlook"
   ↓
2. Frontend redirects to Microsoft OAuth2 endpoint
   ↓
3. User logs in with Microsoft account
   ↓
4. Microsoft redirects back with authorization code
   ↓
5. Frontend sends code to backend
   ↓
6. Backend exchanges code for access token + refresh token
   ↓
7. Backend stores tokens securely (encrypted)
   ↓
8. Backend generates JWT for app authentication
   ↓
9. Frontend stores JWT in localStorage
   ↓
10. All subsequent requests include JWT in Authorization header
```

## Deployment Architecture

### Development
- Docker Compose on local machine
- Hot reload for frontend and backend
- Direct database access

### Production (Self-Hosted)
```
┌─────────────────────────────────┐
│     Reverse Proxy (Nginx)       │
│    - SSL termination            │
│    - Rate limiting              │
└────────┬────────────────────────┘
         │
    ┌────┴────┐
    │         │
┌───▼───┐ ┌──▼───────┐
│React  │ │ FastAPI  │
│(SPA)  │ │ Backend  │
└───────┘ └──┬───────┘
              │
       ┌──────┴──────┐
       │             │
   ┌───▼───┐   ┌────▼────┐
   │  DB   │   │  Redis  │
   └───────┘   └─────────┘
```

## Security Considerations

1. **Authentication**: OAuth2 for Outlook, JWT for app
2. **Authorization**: Role-based (for future multi-user)
3. **Data Encryption**: At rest and in transit
4. **API Security**: Rate limiting, input validation
5. **CORS**: Whitelist trusted origins only
6. **Secrets**: Environment variables, never in code
7. **SQL Injection**: Parameterized queries (SQLAlchemy)
8. **XSS**: React escapes by default, validate HTML inputs

## Performance Optimizations

1. **Caching**: Redis for store offers, API responses
2. **Database**: Indexes on frequently queried columns
3. **Frontend**: Code splitting, lazy loading
4. **API**: Pagination for large result sets
5. **WebSocket**: Only for critical real-time updates
6. **Scraping**: Rate limiting, respect robots.txt

## Monitoring & Logging

- **Backend**: Structured logging (JSON)
- **Frontend**: Error boundary, Sentry (optional)
- **Database**: Query performance monitoring
- **Celery**: Task success/failure tracking
- **Metrics**: Response times, error rates

## Future Enhancements

1. **Multi-user Support**: User accounts, shared calendars
2. **Mobile Apps**: Native iOS/macOS apps
3. **Desktop App**: Tauri for Windows/Mac/Linux
4. **AI Features**: Natural language input, smart suggestions
5. **Integrations**: Google Calendar, Apple Calendar
6. **Analytics**: Advanced spending insights, trends
7. **Notifications**: Push notifications, email digests
8. **Offline Mode**: Local-first architecture

