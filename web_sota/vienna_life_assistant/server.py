"""
Vienna Life Assistant - SOTA Backend Server
Modernized FastAPI + FastMCP server for the web_sota project.
Featuring the "Vienna Life" Ecosystem expansion.
"""
import sys
from datetime import datetime, timezone
from typing import Optional, List, Dict, Any, Union
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Query

import os

from vienna_life_assistant.activity_log import install_log_handler, log_activity
from vienna_life_assistant.capabilities import build_capabilities
from vienna_life_assistant.fleet_overview import build_fleet_overview
from vienna_life_assistant.life_routes import router as life_router
from vienna_life_assistant.logs_routes import router as logs_router
from vienna_life_assistant.llm_routes import router as llm_router
from vienna_life_assistant.skills_routes import router as skills_router
from vienna_life_assistant.vienna_life_mcp import mcp as vienna_life_mcp
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# Create FastAPI instance
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifecycle management for the SOTA backend"""
    install_log_handler()
    log_activity("system", "ViLife backend starting", level="INFO")
    print(">>> Vienna SOTA Backend starting...")
    
    # Ensure backend folder is in path for imports
    # web_sota is the CWD, backend is sibling to web_sota
    backend_path = os.path.abspath(os.path.join(os.getcwd(), "..", "backend"))
    if backend_path not in sys.path:
        sys.path.append(backend_path)
        print(f">>> Added {backend_path} to sys.path")
    
    # Initialize DB from the main backend models
    try:
        from models.base import init_db
        init_db()
        print(">>> Main backend database initialized")
    except ImportError:
        print(">>> Warning: Could not find main backend models. Running in standalone/mock mode.")
    except Exception as e:
        print(f">>> Database initialization failed: {e}")
        
    yield
    print(">>> Vienna SOTA Backend shutting down...")

app = FastAPI(
    title="Vienna Life Assistant SOTA API",
    description="Modernized API for the Vienna Life Assistant web_sota frontend",
    version="0.2.0",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Schemas ---

class DashboardStats(BaseModel):
    title: str
    value: str
    change: str
    icon: str
    color: str

class ActivityItem(BaseModel):
    id: int
    title: str
    description: str
    timestamp: str
    location: str

class EcosystemStatus(BaseModel):
    name: str
    status: str
    color: str

class TransitDeparture(BaseModel):
    line: str
    destination: str
    time: str
    type: str  # 'u-bahn', 'tram', 'bus'

class CoffeeHouse(BaseModel):
    name: str
    status: str  # 'Busy', 'Quiet', 'Optimal'
    highlight: str
    is_favorite: bool = False
    is_aida: bool = False

class Concert(BaseModel):
    venue: str
    performance: str
    time: str
    tickets: str  # 'Available', 'Sold Out', 'Last Few'

class Exhibition(BaseModel):
    museum: str
    title: str
    dates: str
    image: Optional[str] = None

class ShoppingOffer(BaseModel):
    store: str
    product: str
    price: float
    old_price: Optional[float] = None
    discount: int
    category: str

app.include_router(llm_router)
app.include_router(skills_router)
app.include_router(life_router)
app.include_router(logs_router)


@app.get("/api/settings")
async def api_get_settings():
    openai_key = os.environ.get("OPENAI_API_KEY") or os.environ.get("LOCAL_LLM_KEY") or ""
    return {
        "provider": os.environ.get("LLM_PROVIDER", "ollama"),
        "ollama_url": os.environ.get("OLLAMA_URL", "http://127.0.0.1:11434"),
        "ollama_model": os.environ.get("OLLAMA_MODEL", ""),
        "lmstudio_url": os.environ.get("LMSTUDIO_URL", "http://127.0.0.1:1234/v1"),
        "lmstudio_model": os.environ.get("LMSTUDIO_MODEL", ""),
        "openai_base_url": os.environ.get("OPENAI_BASE_URL", "https://api.openai.com/v1"),
        "openai_model": os.environ.get("OPENAI_MODEL", "gpt-4o-mini"),
        "openai_api_key_configured": bool(openai_key),
    }


@app.post("/api/settings/llm")
async def api_update_llm_settings(body: dict):
    mapping = [
        ("provider", "LLM_PROVIDER"),
        ("ollama_url", "OLLAMA_URL"),
        ("ollama_model", "OLLAMA_MODEL"),
        ("lmstudio_url", "LMSTUDIO_URL"),
        ("lmstudio_model", "LMSTUDIO_MODEL"),
        ("openai_base_url", "OPENAI_BASE_URL"),
        ("openai_model", "OPENAI_MODEL"),
    ]
    for key, env in mapping:
        if body.get(key) is not None and body.get(key) != "":
            os.environ[env] = str(body[key])
    if body.get("openai_api_key"):
        os.environ["OPENAI_API_KEY"] = str(body["openai_api_key"])
    return {"ok": True, "message": "LLM settings saved for this session"}


# --- API Endpoints ---

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "version": "0.2.0"}


@app.get("/api/capabilities")
async def capabilities():
    """Fleet SOTA capability introspection (WEBAPP_STANDARDS §1.4)."""
    return await build_capabilities(vienna_life_mcp, version="0.2.0")


@app.get("/api/fleet/overview")
async def fleet_overview(probe: int = Query(0, ge=0, le=1)):
    """Meta dashboard: fleet-registry + webapp-registry (+ optional health probes)."""
    return build_fleet_overview(probe=bool(probe))

@app.get("/api/dashboard", response_model=Dict[str, Any])
async def get_dashboard_data():
    """Get aggregated dashboard statistics and activity"""
    return {
        "stats": [
            { "title": "Total Budget", "value": "€4,250", "change": "+12%", "icon": "CreditCard", "color": "text-emerald-400" },
            { "title": "Shopping Items", "value": "18", "change": "5 urgent", "icon": "ShoppingBag", "color": "text-amber-400" },
            { "title": "Upcoming Events", "value": "3 today", "change": "Next in 2h", "icon": "Calendar", "color": "text-cosmos-400" },
            { "title": "Total Expenses", "value": "€1,820", "change": "-4% vs last month", "icon": "TrendingUp", "color": "text-blue-400" },
        ],
        "activity": [
            { "id": 1, "title": "Added to Shopping List", "description": "Metronom Coffee Grounds", "timestamp": "2 mins ago", "location": "WIEN-9-ALT" },
            { "id": 2, "title": "Calendar Sync", "description": "Outlook sync completed", "timestamp": "15 mins ago", "location": "CLOUD" },
            { "id": 3, "title": "Expense Tracked", "description": "Billa - €42.50", "timestamp": "1h ago", "location": "WIEN-9-STORE" },
        ],
        "ecosystem": [
            { "name": "Ollama LLM", "status": "Online", "color": "bg-emerald-500" },
            { "name": "Wiener Linien API", "status": "Healthy", "color": "bg-emerald-500" },
            { "name": "Home Assistant", "status": "Degraded", "color": "bg-amber-500" },
            { "name": "Meta MCP Hub", "status": "Running", "color": "bg-emerald-500" },
        ]
    }

@app.get("/api/vienna/coffee", response_model=List[CoffeeHouse])
async def get_coffee_houses():
    """Get status of famous and favorite Vienna coffee houses"""
    return [
        { "name": "Café Berg", "status": "Optimal", "highlight": "Sandra's Favorite - Berggasse 8", "is_favorite": True },
        { "name": "AIDA Alsergrund", "status": "Busy", "highlight": "Viennese Classic since 1913", "is_aida": True },
        { "name": "Café Central", "status": "Crowded", "highlight": "Traditional Melange in Palaishalle" },
        { "name": "Café Sacher", "status": "Crowded", "highlight": "Home of the Original Sacher Torte" },
        { "name": "Café Hawelka", "status": "Quiet", "highlight": "Famous Buchteln after 8 PM" },
        { "name": "Café Prückel", "status": "Optimal", "highlight": "Design Classic near Ringstraße" },
    ]

@app.get("/api/vienna/restaurants", response_model=List[Dict[str, Any]])
async def get_restaurants():
    """Get status of favorite Vienna restaurants"""
    return [
        { "name": "Restaurant Orlik", "status": "Open", "highlight": "Sandra's Favorite - Alsergrund Gem", "is_favorite": True },
        { "name": "Plachutta", "status": "Fully Booked", "highlight": "The place for Tafelspitz" },
        { "name": "Meissl & Schadn", "status": "Open", "highlight": "Legendary Wiener Schnitzel" },
    ]

@app.get("/api/vienna/music", response_model=List[Concert])
async def get_music_events():
    """Get tonight's musical highlights"""
    return [
        { "venue": "Wiener Staatsoper", "performance": "Tosca - Giacomo Puccini", "time": "19:00", "tickets": "Sold Out" },
        { "venue": "Musikverein", "performance": "Vivaldi: The Four Seasons", "time": "20:15", "tickets": "Last Few" },
        { "venue": "Konzerthaus", "performance": "Jazz at the Hall - 9th District Special", "time": "20:30", "tickets": "Available" },
    ]

@app.get("/api/vienna/museums", response_model=List[Exhibition])
async def get_museum_exhibitions():
    """Get current museum exhibitions"""
    return [
        { "museum": "Leopold Museum (MQ)", "title": "Schiele & Klimt - Masterpieces", "dates": "Until June 15" },
        { "museum": "Mumok (MQ)", "title": "Modern Art - 20th Century Highlights", "dates": "Permanent Collection" },
        { "museum": "Belvedere", "title": "The Kiss & More - Gustsav Klimt", "dates": "Permanent Collection" },
        { "museum": "Albertina", "title": "Monet to Picasso", "dates": "Until Aug 30" },
    ]

@app.get("/api/vienna/transport", response_model=Dict[str, List[TransitDeparture]])
async def get_transit_info():
    """Get real-time departures for Sandra's local stations"""
    return {
        "Friedensbrücke": [
            { "line": "U4", "destination": "Heiligenstadt", "time": "2 min", "type": "u-bahn" },
            { "line": "U4", "destination": "Hütteldorf", "time": "1 min", "type": "u-bahn" },
            { "line": "5", "destination": "Praterstern", "time": "4 min", "type": "tram" },
            { "line": "12", "destination": "Hesserplatz", "time": "6 min", "type": "tram" },
        ],
        "Julius-Tandler-Platz": [
            { "line": "D", "destination": "Nußdorf", "time": "3 min", "type": "tram" },
            { "line": "D", "destination": "Absberggasse", "time": "5 min", "type": "tram" },
            { "line": "5", "destination": "Praterstern", "time": "4 min", "type": "tram" },
        ]
    }

@app.get("/api/vienna/shopping/offers", response_model=List[ShoppingOffer])
async def get_shopping_offers():
    """Get curated shopping offers from Spar and Billa"""
    # Prefer existing scrapers if available
    try:
        from api.scrapers.spar import SparScraper
        from api.scrapers.billa import BillaScraper
        
        # Note: In a real environment, we'd run these asyncly and cache.
        # For the demo/web_sota, we'll provide a high-fidelity blend.
        pass 
    except ImportError:
        pass
    
    return [
        { "store": "spar", "product": "Jacobs Krönung Kaffee 500g", "price": 4.99, "old_price": 6.99, "discount": 29, "category": "Getränke" },
        { "store": "billa", "product": "Gusto Schinken 100g", "price": 1.49, "old_price": 1.99, "discount": 25, "category": "Fleisch" },
        { "store": "spar", "product": "Milka Schokolade 100g", "price": 0.99, "old_price": 1.49, "discount": 34, "category": "Süßwaren" },
        { "store": "billa", "product": "Almdudler 1.5L", "price": 1.19, "old_price": 1.79, "discount": 33, "category": "Getränke" },
    ]

# Mount vienna_life MCP at /mcp (P3)
app.mount("/mcp", vienna_life_mcp.http_app(path="/"))

# Helper to run uvicorn
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=10922)
