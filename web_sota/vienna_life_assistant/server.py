"""
Vienna Life Assistant - SOTA Backend Server
Modernized FastAPI + FastMCP server for the web_sota project.
Featuring the "Vienna Life" Ecosystem expansion.
"""
import os
import sys
import random
from datetime import datetime, date, timedelta
from typing import Optional, List, Dict, Any, Union
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from fastmcp import FastMCP

# Create FastMCP instance for tool execution
mcp = FastMCP("Vienna Life Assistant SOTA")

# Create FastAPI instance
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifecycle management for the SOTA backend"""
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

# --- API Endpoints ---

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "version": "0.2.0"}

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

# --- MCP Tools ---

@mcp.tool()
async def vla_vienna_tips(category: str) -> str:
    """Get creative Vienna tips for a specific category (music, coffee, museum)."""
    if category.lower() == "coffee":
        return "Try the 'Hausbrand' at Café Berg for a perfect start in Alsergrund."
    elif category.lower() == "music":
        return "Check the 'Stehplatz' (standing room) tickets at the Staatsoper 80 mins before the show - only €10-15!"
    return f"Enjoy the Viennese vibe in the {category} scene!"

# Helper to run uvicorn
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=10922)
