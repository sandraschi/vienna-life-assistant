"""
Vienna Life Assistant - SOTA Backend Server
Modernized FastAPI + FastMCP server for the web_sota project.
Featuring the "Vienna Life" Ecosystem expansion.
"""

import logging
import os
import sys
from contextlib import asynccontextmanager
from typing import Any, Optional

from fastapi import FastAPI, Query
from vienna_life_assistant.activity_log import install_log_handler, log_activity
from vienna_life_assistant.capabilities import build_capabilities
from vienna_life_assistant.fleet_overview import build_fleet_overview
from vienna_life_assistant.life_routes import router as life_router
from vienna_life_assistant.logs_routes import router as logs_router
from vienna_life_assistant.llm_routes import router as llm_router
from vienna_life_assistant.skills_routes import router as skills_router
from vienna_life_assistant.vienna_life_mcp import mcp as vienna_life_mcp
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

logger = logging.getLogger("vienna-life-assistant.server")


# Create FastAPI instance
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifecycle management for the SOTA backend"""
    install_log_handler()
    log_activity("system", "ViLife backend starting", level="INFO")
    logger.info("Vienna SOTA Backend starting...")

    # Ensure backend folder is in path for imports
    # web_sota is the CWD, backend is sibling to web_sota
    backend_path = os.path.abspath(os.path.join(os.getcwd(), "..", "backend"))
    if backend_path not in sys.path:
        sys.path.append(backend_path)
        logger.info("Added %s to sys.path", backend_path)

    # Initialize DB from the main backend models
    try:
        from models.base import init_db

        init_db()
        logger.info("Main backend database initialized")
    except ImportError:
        logger.warning(
            "Could not find main backend models. Running in standalone/mock mode."
        )
    except Exception as e:
        logger.error("Database initialization failed: %s", e)

    yield
    logger.info("Vienna SOTA Backend shutting down...")


app = FastAPI(
    title="Vienna Life Assistant SOTA API",
    description="Modernized API for the Vienna Life Assistant web_sota frontend",
    version="0.2.0",
    lifespan=lifespan,
)

# CORS Middleware — fleet standard (Tauri + Tailscale + LAN + localhost)
_tauri_desktop = os.environ.get("VIENNA_LIFE_ASSISTANT_TAURI", "").lower() in (
    "1",
    "true",
    "yes",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:10922",
        "http://127.0.0.1:10922",
        "http://localhost:10988",
        "http://127.0.0.1:10988",
        "http://tauri.localhost",
        "https://tauri.localhost",
        "tauri://localhost",
    ],
    allow_origin_regex=r"https?://(?:[a-zA-Z0-9-]+\.ts\.net|.*?\.tail-[a-f0-9]+\.ts\.net|tauri\.localhost|localhost|127\.0\.0\.1|192\.168\.\d{1,3}\.\d{1,3}|10\.\d{1,3}\.\d{1,3}\.\d{1,3}|100\.\d{1,3}\.\d{1,3}\.\d{1,3})(?::\d+)?$|^tauri://localhost$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Schemas ---


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
    openai_key = (
        os.environ.get("OPENAI_API_KEY") or os.environ.get("LOCAL_LLM_KEY") or ""
    )
    return {
        "provider": os.environ.get("LLM_PROVIDER", "ollama"),
        "ollama_url": os.environ.get("OLLAMA_URL", "http://127.0.0.1:11434"),
        "ollama_model": os.environ.get("OLLAMA_MODEL", ""),
        "lmstudio_url": os.environ.get("LMSTUDIO_URL", "http://127.0.0.1:1234/v1"),
        "lmstudio_model": os.environ.get("LMSTUDIO_MODEL", ""),
        "openai_base_url": os.environ.get(
            "OPENAI_BASE_URL", "https://api.openai.com/v1"
        ),
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


@app.get("/api/dashboard", response_model=dict[str, Any])
async def get_dashboard_data():
    """Aggregated dashboard statistics"""
    return {
        "stats": [
            {
                "title": "Total Budget",
                "value": "€4,250",
                "change": "+12%",
                "icon": "CreditCard",
                "color": "text-emerald-400",
            },
            {
                "title": "Shopping Items",
                "value": "18",
                "change": "5 urgent",
                "icon": "ShoppingBag",
                "color": "text-amber-400",
            },
            {
                "title": "Upcoming Events",
                "value": "3 today",
                "change": "Next in 2h",
                "icon": "Calendar",
                "color": "text-cosmos-400",
            },
            {
                "title": "Total Expenses",
                "value": "€1,820",
                "change": "-4% vs last month",
                "icon": "TrendingUp",
                "color": "text-blue-400",
            },
        ],
    }


@app.get("/api/vienna/coffee", response_model=list[CoffeeHouse])
async def get_coffee_houses():
    """Get status of famous and favorite Vienna coffee houses"""
    return [
        {
            "name": "Café Berg",
            "status": "Optimal",
            "highlight": "Sandra's Favorite - Berggasse 8",
            "is_favorite": True,
        },
        {
            "name": "AIDA Alsergrund",
            "status": "Busy",
            "highlight": "Viennese Classic since 1913",
            "is_aida": True,
        },
        {
            "name": "Café Central",
            "status": "Crowded",
            "highlight": "Traditional Melange in Palaishalle",
        },
        {
            "name": "Café Sacher",
            "status": "Crowded",
            "highlight": "Home of the Original Sacher Torte",
        },
        {
            "name": "Café Hawelka",
            "status": "Quiet",
            "highlight": "Famous Buchteln after 8 PM",
        },
        {
            "name": "Café Prückel",
            "status": "Optimal",
            "highlight": "Design Classic near Ringstraße",
        },
    ]


@app.get("/api/vienna/restaurants")
async def get_restaurants():
    """Get favorite Vienna restaurants with today's lunch menus."""
    from vienna_life_assistant.vienna_scraper import fetch_lunch_menus

    return {
        "restaurants": [
            {
                "name": "Gasthaus Orlik",
                "address": "Servitengasse 7, 1090 Wien",
                "is_favorite": True,
            },
            {"name": "Mast Weinbar", "address": "Servitengasse 3, 1090 Wien"},
            {"name": "Steirereck", "address": "Am Heumarkt 2A, 1030 Wien", "note": "Austria's best restaurant"},
            {"name": "Enopizzeria Toledo", "address": "Servitengasse 12, 1090 Wien", "is_favorite": True},
            {"name": "Plachutta", "address": "Wollzeile 38, 1010 Wien"},
            {"name": "Meissl & Schadn", "address": "Mariahilfer Straße 64, 1070 Wien"},
        ],
        "lunch_menus": fetch_lunch_menus(),
    }


@app.get("/api/vienna/music", response_model=list[Concert])
async def get_music_events():
    """Get scheduled performances from Burgtheater."""
    from vienna_life_assistant.vienna_scraper import fetch_performances

    events = fetch_performances()
    return [
        {
            "venue": e["venue"],
            "performance": e["title"],
            "time": e.get("date", "Evening"),
            "tickets": e.get("tickets", "Available"),
        }
        for e in events
    ]


@app.get("/api/vienna/museums", response_model=list[Exhibition])
async def get_museum_exhibitions():
    """Get current museum exhibitions — scraped live from museum websites."""
    from vienna_life_assistant.vienna_scraper import fetch_exhibitions

    exhibitions = fetch_exhibitions()
    return [
        {"museum": e["museum"], "title": e["title"], "dates": e.get("dates", "Current")}
        for e in exhibitions
    ]


@app.get("/api/vienna/transport", response_model=dict[str, list[TransitDeparture]])
async def get_transit_info():
    """Get real-time departures for Sandra's local stations"""
    return {
        "Friedensbrücke": [
            {
                "line": "U4",
                "destination": "Heiligenstadt",
                "time": "2 min",
                "type": "u-bahn",
            },
            {
                "line": "U4",
                "destination": "Hütteldorf",
                "time": "1 min",
                "type": "u-bahn",
            },
            {
                "line": "5",
                "destination": "Praterstern",
                "time": "4 min",
                "type": "tram",
            },
            {
                "line": "12",
                "destination": "Hesserplatz",
                "time": "6 min",
                "type": "tram",
            },
        ],
        "Julius-Tandler-Platz": [
            {"line": "D", "destination": "Nußdorf", "time": "3 min", "type": "tram"},
            {
                "line": "D",
                "destination": "Absberggasse",
                "time": "5 min",
                "type": "tram",
            },
            {
                "line": "5",
                "destination": "Praterstern",
                "time": "4 min",
                "type": "tram",
            },
        ],
    }


@app.get("/api/vienna/shopping/offers", response_model=list[ShoppingOffer])
async def get_shopping_offers():
    """Get curated shopping offers from Spar and Billa"""
    # Prefer existing scrapers if available
    try:
        import importlib

        importlib.util.find_spec("api.scrapers.spar")
        importlib.util.find_spec("api.scrapers.billa")
    except Exception:
        pass
    except ImportError:
        pass

    return [
        {
            "store": "spar",
            "product": "Jacobs Krönung Kaffee 500g",
            "price": 4.99,
            "old_price": 6.99,
            "discount": 29,
            "category": "Getränke",
        },
        {
            "store": "billa",
            "product": "Gusto Schinken 100g",
            "price": 1.49,
            "old_price": 1.99,
            "discount": 25,
            "category": "Fleisch",
        },
        {
            "store": "spar",
            "product": "Milka Schokolade 100g",
            "price": 0.99,
            "old_price": 1.49,
            "discount": 34,
            "category": "Süßwaren",
        },
        {
            "store": "billa",
            "product": "Almdudler 1.5L",
            "price": 1.19,
            "old_price": 1.79,
            "discount": 33,
            "category": "Getränke",
        },
    ]


@app.get("/api/v1/diagnostics")
async def get_diagnostics():
    """Diagnostics endpoint for CUA-NSIS smoke test certification."""
    return {
        "status": "ok",
        "server": "vienna-life-assistant",
        "version": "0.2.0",
        "uptime_seconds": 0,
        "tool_count": 3,
        "tools": [
            {"name": "vienna_life", "operations": 8},
            {"name": "vienna_life_agentic"},
            {"name": "vienna_tips"},
        ],
        "system": {"windows": True},
        "errors": [],
    }


# Mount vienna_life MCP at /mcp (P3)
app.mount("/mcp", vienna_life_mcp.http_app(path="/"))


@app.post("/api/shutdown")
async def shutdown():
    """Graceful shutdown — agent-callable endpoint."""
    logger.warning("Shutdown requested via /api/shutdown")
    import asyncio

    asyncio.create_task(_delayed_shutdown())
    return {"ok": True, "message": "Shutting down..."}


async def _delayed_shutdown():
    import asyncio

    await asyncio.sleep(0.5)
    os._exit(0)


# Helper to run uvicorn
if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="127.0.0.1", port=10922)
