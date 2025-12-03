# Vienna Life Assistant - Ecosystem Integration Plan

**Date**: 2025-12-03  
**Status**: 🎯 Planning Phase

## Current Ecosystem

### Media Collection (Quality of Life!)
- **Plex**: 50,000 anime episodes/movies + 5,000 Western movies
- **Calibre**: 15,000 ebooks library
- **Immich**: Photo management and organization
- **MCP Servers**: Already have servers for these services
- **MyAI**: calibre++ and plex++ subapps exist

### Home Control
- **Tapo Cameras MCP**: Home control dashboard
- **Location**: `D:\Dev\repos\tapo-camera-mcp`

### Infrastructure
- **Goliath**: AMD 24-core server with 30TB HDDs, RTX 4090
- **Tailscale**: Network connectivity
- **MCP Servers**: Running on Goliath under `d:/dev/repos`

## Integration Vision

### Central Hub Concept
Vienna Life Assistant becomes the **personal life command center** that integrates:
- Daily tasks (todos)
- Shopping and expenses
- Calendar and appointments
- **Media consumption** (what to watch/read tonight?)
- **Home monitoring** (camera feeds, automation)
- **Local AI** (content recommendations, summaries)

## Integration Architecture

```
┌─────────────────────────────────────────────────────────────┐
│         Vienna Life Assistant (Central Hub)                 │
│         http://localhost:9173                               │
└─────────────────┬───────────────────────────────────────────┘
                  │
    ┌─────────────┼─────────────┬─────────────┬───────────────┐
    │             │             │             │               │
┌───▼───┐   ┌────▼────┐   ┌────▼────┐   ┌───▼────┐   ┌──────▼──────┐
│ Plex  │   │ Calibre │   │ Immich  │   │  Tapo  │   │   Ollama    │
│  MCP  │   │   MCP   │   │   MCP   │   │   MCP  │   │    Local    │
└───┬───┘   └────┬────┘   └────┬────┘   └───┬────┘   └──────┬──────┘
    │            │             │            │               │
┌───▼────────────▼─────────────▼────────────▼───────────────▼────┐
│              Tailscale Network (Goliath)                        │
│  - Plex Server (50k+ items)                                     │
│  - Calibre Library (15k ebooks)                                 │
│  - Immich (photos)                                              │
│  - Tapo Cameras                                                 │
│  - MCP Servers (d:/dev/repos)                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Proposed Features

### 1. Media Dashboard Tab

**"Media & Home" Tab** - New section showing:

**Plex Widget**:
- Continue watching (from Plex API)
- Recently added anime/movies
- "What to watch tonight?" AI recommendation
- Quick launch to Plex
- Watch time statistics

**Calibre Widget**:
- Currently reading books
- Reading progress
- Recently added ebooks
- "What to read next?" AI recommendation
- Quick launch to Calibre++

**Immich Widget**:
- Recent photos
- Today in history (photos from this day in past years)
- Storage statistics
- Quick launch to Immich

**Tapo Home Control**:
- Camera feeds (thumbnails)
- Motion detection alerts
- Home automation status
- Quick controls for lights/devices
- Security status

### 2. Smart Todos Integration

**Media-Related Todos**:
- "Watch next episode of [Anime]" (from Plex continue watching)
- "Finish reading [Book]" (from Calibre progress)
- "Review photos from [Event]" (from Immich)

**Home-Related Todos**:
- "Check camera recording from [Time]"
- "Review motion alerts"

### 3. Calendar Integration

**Media Events**:
- Anime/movie releases (auto-add to calendar)
- Book club dates
- VRChat meetups

**Home Events**:
- Camera maintenance reminders
- Security check schedules

### 4. Expense Tracking Integration

**Media Expenses**:
- Track anime/manga purchases
- Book purchases
- Plex Pass subscription
- VRChat assets

**Smart Suggestions**:
- "You watched 5 hours of anime today" → "Buy related manga at Thalia?"
- Reading pattern analysis

### 5. AI-Powered Recommendations

**Using Your 15 Ollama Models**:
- **qwen3-coder:30b** - Code and technical content
- **deepseek-r1:8b** - Reasoning and recommendations
- **llama3.1:8b** - General assistance

**Features**:
- "What should I watch tonight?" (based on Plex history)
- "What book matches my mood?" (based on Calibre library)
- Summarize long articles/books
- Generate shopping lists from recipes
- Natural language todo creation

## Implementation Plan

### Phase 1: API Integration Layer (Week 1)

**Backend Services** (`backend/services/`):
```python
# backend/services/plex_service.py
class PlexService:
    def get_continue_watching()
    def get_recently_added()
    def get_watch_stats()
    def search_library()

# backend/services/calibre_service.py
class CalibreService:
    def get_currently_reading()
    def get_recent_books()
    def get_reading_progress()
    def search_library()

# backend/services/immich_service.py
class ImmichService:
    def get_recent_photos()
    def get_today_in_history()
    def get_storage_stats()

# backend/services/tapo_service.py
class TapoService:
    def get_camera_status()
    def get_recent_motion()
    def get_camera_snapshot()
```

**API Endpoints** (`backend/api/media/`):
- `/api/media/plex/continue-watching`
- `/api/media/plex/recently-added`
- `/api/media/calibre/currently-reading`
- `/api/media/calibre/recent`
- `/api/media/immich/recent-photos`
- `/api/media/tapo/cameras`
- `/api/media/tapo/motion-events`

### Phase 2: Frontend Dashboard (Week 2)

**Media & Home Tab** (`frontend/src/features/media/`):
```
MediaDashboard.tsx
├── PlexWidget.tsx       # Continue watching, recently added
├── CalibreWidget.tsx    # Currently reading, recent books
├── ImmichWidget.tsx     # Recent photos, storage
└── TapoWidget.tsx       # Camera feeds, motion alerts
```

**Responsive Grid Layout**:
- Desktop: 2x2 grid (4 widgets visible)
- Tablet: 2x2 grid (stacked)
- Mobile: Single column (swipeable cards)

### Phase 3: Smart Integrations (Week 3)

**AI Recommendations**:
- "Tonight's Entertainment" - AI suggests from Plex based on mood/time
- "Reading Recommendation" - Calibre book suggestions
- "Photo Memories" - Immich highlights

**Cross-Feature Integration**:
- Todo: "Watch [Anime]" → Links to Plex
- Calendar: "Anime night" → Auto-suggests from Plex
- Shopping: "Manga from [Series]" → Links to BookWalker/Thalia

### Phase 4: Advanced Features (Week 4+)

**Unified Search**:
- Search across Plex, Calibre, Immich, Todos, Calendar
- AI-powered semantic search
- "Find that anime about..."

**Automation**:
- Auto-create todos from Plex watch history
- Reading goals from Calibre
- Photo backup reminders from Immich
- Security alerts from Tapo

## Technical Implementation

### MCP Server Communication

**Option 1: Direct HTTP** (Simplest):
```python
# Call existing MCP servers via HTTP
import httpx

async def get_plex_data():
    async with httpx.AsyncClient() as client:
        response = await client.get("http://goliath:PORT/plex/continue-watching")
        return response.json()
```

**Option 2: MCP Client** (Most integrated):
```python
# Use MCP protocol
from mcp import Client

plex_client = Client("http://goliath:PORT/mcp")
data = await plex_client.call_tool("plex_get_continue_watching")
```

**Option 3: Shared Database** (Fastest):
```python
# Read from shared SQLite/PostgreSQL
# If MCP servers use databases we can access
```

### Configuration

**Environment Variables** (`.env`):
```bash
# Media Services
PLEX_URL=http://goliath:32400
PLEX_TOKEN=your-plex-token
CALIBRE_URL=http://goliath:8083
IMMICH_URL=http://goliath:2283
IMMICH_API_KEY=your-immich-key

# Tapo Cameras
TAPO_MCP_URL=http://localhost:PORT
TAPO_USERNAME=your-username
TAPO_PASSWORD=your-password

# Existing MyAI Apps
CALIBRE_PLUS_URL=http://goliath:PORT
PLEX_PLUS_URL=http://goliath:PORT
```

### Security Considerations

1. **API Keys**: Store securely in .env
2. **Tailscale**: Use for secure access to Goliath
3. **CORS**: Configure for cross-origin requests
4. **Authentication**: Use existing Plex/Calibre auth
5. **Rate Limiting**: Don't hammer services

## UI Mockup

### Media & Home Dashboard

```
┌────────────────────────────────────────────────────────┐
│  🎬 Plex                              🔴 Live          │
│  ┌──────────────────────────────────────────────────┐ │
│  │  Continue Watching:                              │ │
│  │  📺 Demon Slayer S2E15 - 23:15 remaining        │ │
│  │  📺 Bocchi the Rock S1E08                        │ │
│  │                                                   │ │
│  │  Recently Added:                                 │ │
│  │  🆕 Frieren S1E28 (Today)                       │ │
│  │  🆕 Spy x Family Movie (Yesterday)              │ │
│  └──────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────┐
│  📚 Calibre                           15,432 books     │
│  ┌──────────────────────────────────────────────────┐ │
│  │  Currently Reading:                              │ │
│  │  📖 Project Hail Mary - 67% complete             │ │
│  │  📖 三体 (The Three-Body Problem) - 34%          │ │
│  │                                                   │ │
│  │  Recommended:                                    │ │
│  │  📕 Foundation Series (Isaac Asimov)            │ │
│  └──────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────┐
│  📸 Immich                            2.3 TB used      │
│  ┌──────────────────────────────────────────────────┐ │
│  │  Today: 0 photos                                 │ │
│  │  This Week: 47 photos                            │ │
│  │                                                   │ │
│  │  On This Day (2024):                             │ │
│  │  🖼️ 12 photos from Vienna trip                  │ │
│  └──────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────┐
│  🏠 Tapo Home                         All systems OK   │
│  ┌──────────────────────────────────────────────────┐ │
│  │  📹 Cameras: 3 online                            │ │
│  │  🚨 Motion alerts: 2 today                       │ │
│  │  💡 Smart devices: 5 connected                   │ │
│  │                                                   │ │
│  │  [View Cameras] [Motion History] [Controls]     │ │
│  └──────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────┘
```

## Quick Wins (Implement First)

### 1. Plex "Continue Watching" Widget
- Show 3-5 items from continue watching
- Click to open in Plex
- Progress bars
- Estimated time remaining

### 2. Calibre "Currently Reading" Widget
- Show books in progress
- Reading percentage
- Last read date
- Click to open in Calibre++

### 3. Tapo Camera Status
- Camera online/offline status
- Last motion detection
- Quick snapshot view
- Link to full dashboard

### 4. Quick Actions
- "Add anime to watch list" → Creates todo
- "Add book to reading list" → Creates todo
- "Review security footage" → Creates calendar event

## Mobile Considerations

### iPhone/iPad Specific
- Touch-friendly buttons (44px minimum)
- Swipeable cards for media content
- Pull-to-refresh for feeds
- Native-feeling animations
- Safari viewport fixes
- Home screen icon (PWA)

### Responsive Breakpoints
- **iPhone SE** (375px): Single column, stacked widgets
- **iPhone 14** (390px): Single column, larger cards
- **iPad Mini** (768px): 2-column grid
- **iPad Pro** (1024px): 2-column or 3-column grid

## API Integration Examples

### Plex MCP Integration
```python
# backend/services/plex_service.py
import httpx

class PlexService:
    def __init__(self):
        self.base_url = os.getenv("PLEX_URL", "http://goliath:32400")
        self.token = os.getenv("PLEX_TOKEN")
    
    async def get_continue_watching(self):
        """Get continue watching from Plex"""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/hubs/continueWatching/items",
                headers={"X-Plex-Token": self.token}
            )
            return response.json()
    
    async def get_on_deck(self):
        """Get on-deck items"""
        # Next episodes to watch
        pass
```

### Calibre Integration
```python
# Use existing Calibre++ MCP
# Or access Calibre database directly
import sqlite3

def get_currently_reading():
    # Query Calibre's metadata.db
    conn = sqlite3.connect("path/to/calibre/metadata.db")
    # Get books with reading progress
```

### Tapo Integration
```python
# Use existing tapo-camera-mcp
# Already at: D:\Dev\repos\tapo-camera-mcp

from tapo_camera_mcp import TapoClient

async def get_camera_status():
    # Get status from existing MCP server
    response = await client.get("http://localhost:PORT/api/cameras")
    return response.json()
```

## Data Models

### Media Consumption Tracking
```python
class MediaItem(Base):
    __tablename__ = "media_items"
    
    id = Column(String(36), primary_key=True)
    source = Column(String(20))  # plex, calibre, immich
    external_id = Column(String(255))
    title = Column(String(255))
    media_type = Column(String(50))  # anime, movie, book, photo
    progress = Column(Integer)  # Percentage
    last_accessed = Column(DateTime)
    todo_linked = Column(String(36), ForeignKey("todo_items.id"))
```

### Home Automation Events
```python
class HomeEvent(Base):
    __tablename__ = "home_events"
    
    id = Column(String(36), primary_key=True)
    event_type = Column(String(50))  # motion, alert, automation
    source = Column(String(50))  # tapo, camera_name
    timestamp = Column(DateTime)
    details = Column(JSON)
    resolved = Column(Boolean, default=False)
```

## Configuration File

**`config/integrations.yaml`**:
```yaml
integrations:
  plex:
    enabled: true
    url: http://goliath:32400
    mcp_server: http://goliath:PORT
    features:
      - continue_watching
      - recently_added
      - recommendations
  
  calibre:
    enabled: true
    url: http://goliath:8083
    library_path: /path/to/calibre
    features:
      - currently_reading
      - recent_additions
      - reading_goals
  
  immich:
    enabled: true
    url: http://goliath:2283
    features:
      - recent_photos
      - today_in_history
      - storage_stats
  
  tapo:
    enabled: true
    mcp_server: http://localhost:PORT
    features:
      - camera_status
      - motion_alerts
      - quick_controls
  
  ollama:
    enabled: true
    url: http://localhost:11434
    default_model: llama3.2:3b
    features:
      - recommendations
      - summaries
      - natural_language
```

## UI Components to Create

### 1. MediaWidget Component
```typescript
interface MediaWidgetProps {
  source: 'plex' | 'calibre' | 'immich';
  title: string;
  items: MediaItem[];
  onItemClick: (item: MediaItem) => void;
}
```

### 2. QuickLaunchButton Component
```typescript
interface QuickLaunchProps {
  service: string;
  url: string;
  icon: ReactNode;
  label: string;
}
```

### 3. CameraThumbnail Component
```typescript
interface CameraThumbnailProps {
  cameraId: string;
  name: string;
  status: 'online' | 'offline';
  lastMotion?: Date;
  snapshotUrl?: string;
}
```

## Benefits

### Quality of Life Improvements
- **One place** for everything important
- **Quick access** to media and home
- **Smart suggestions** from AI
- **Context aware** (knows what you're watching/reading)
- **Austrian focused** (Spar/Billa + your media)

### Workflow Examples

**Evening Routine**:
1. Check todos (Benny walked? ✅)
2. Check Tapo (home secure? ✅)
3. Check Plex (continue watching Demon Slayer)
4. Check shopping (need snacks for anime night?)

**Weekend**:
1. Review Immich (photos from week)
2. Check Calibre (finish current book)
3. Plan shopping (Spar offers this week)
4. Schedule vet appointment (calendar)

**Japan Trip Planning** (October):
1. Calendar: Travel dates
2. Todos: Visa, hotels, JR Pass
3. Calibre: Japanese phrasebook
4. Immich: Prepare camera for trip
5. Plex: Download anime for flight

## Next Steps

### Immediate (This Session)
1. ✅ Enhance mobile responsiveness
2. ⏳ Create Media & Home tab placeholder
3. ⏳ Design integration architecture

### Short Term (Next Week)
1. Implement Plex continue watching widget
2. Implement Calibre currently reading widget
3. Implement Tapo camera status
4. Add quick launch buttons

### Medium Term (Weeks 2-4)
1. AI recommendations with Ollama
2. Cross-feature todos (media → tasks)
3. Unified search
4. Smart notifications

### Long Term (Months)
1. Full Immich integration
2. Advanced automation
3. iOS/iPadOS native apps
4. Tailscale integration for remote access

## Questions to Resolve

1. **MCP Server Ports**: What ports do your MCP servers use?
2. **Authentication**: How are Plex/Calibre/etc authenticated?
3. **Access Method**: Direct HTTP or through MCP protocol?
4. **Goliath Access**: Tailscale hostname or IP?
5. **Priority**: Which integration is most valuable first?

## Notes

This integration turns Vienna Life Assistant from a simple todo app into a **comprehensive personal command center** that respects your existing infrastructure and quality of life priorities!

---

**Ready to make this your central hub for Vienna life + media + home!** 🎬📚📸🏠

