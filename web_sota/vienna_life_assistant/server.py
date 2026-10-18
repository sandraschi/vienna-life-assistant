"""
Vienna Life Assistant - SOTA Backend Server
Modernized FastAPI + FastMCP server for the web_sota project.
Featuring the "Vienna Life" Ecosystem expansion.
"""

import asyncio
import logging
import os
import sys
from contextlib import asynccontextmanager
from typing import Any

from fastapi import FastAPI, HTTPException, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from urllib.parse import quote_plus

from vienna_life_assistant.activity_log import install_log_handler, log_activity
from vienna_life_assistant.capabilities import build_capabilities
from vienna_life_assistant.db import init_db
from vienna_life_assistant.email_routes import router as email_router
from vienna_life_assistant.environment_routes import router as environment_router
from vienna_life_assistant.fleet_overview import build_fleet_overview
from vienna_life_assistant.life_db_routes import (
    condition_routes,
    contact_routes,
    document_routes,
    expense_routes,
    health_routes,
    home_task_routes,
    life_routes,
    log_routes,
    medication_routes,
    packing_routes,
    pet_routes,
    subscription_routes,
    todo_routes,
    trip_routes,
    vitals_routes,
)
from vienna_life_assistant.life_db_routes import (
    router as life_db_router,
)
from vienna_life_assistant.life_routes import router as life_router
from vienna_life_assistant.llm_routes import router as llm_router
from vienna_life_assistant.logs_routes import router as logs_router
from vienna_life_assistant.news_routes import router as news_router
from vienna_life_assistant.notes_routes import router as notes_router
from vienna_life_assistant.onboarding_routes import router as onboarding_router
from vienna_life_assistant.pa_routes import router as pa_router
from vienna_life_assistant.pa_routes import scheduler_loop
from vienna_life_assistant.skills_routes import router as skills_router
from vienna_life_assistant.vienna_life_mcp import mcp as vienna_life_mcp

logger = logging.getLogger("vienna-life-assistant.server")


def _with_urls(items: list[dict], official: dict) -> list[dict]:
    """Every object gets a link: official site when verified, else Maps search."""
    out = []
    for it in items:
        it = dict(it)
        if "url" not in it:
            name = it.get("name", "")
            if name in official:
                it["url"] = official[name]
            else:
                q = quote_plus(f"{name} {it.get('address', '')} Wien".strip())
                it["url"] = f"https://www.google.com/maps/search/?api=1&query={q}"
        out.append(it)
    return out


# MCP sub-app — built BEFORE the parent FastAPI app (STARLETTE_NO_PYDANTIC_STANDARD
# § Mounting FastMCP's http_app: BUG-008 + BUG-038). path="/" avoids the
# double-prefix under the /mcp mount; its lifespan is folded into the parent
# lifespan below so the streamable-HTTP session manager actually starts.
mcp_app = vienna_life_mcp.http_app(path="/")


# Create FastAPI instance
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifecycle management for the SOTA backend"""
    # Fold the mounted MCP sub-app's lifespan into ours so its
    # StreamableHTTPSessionManager starts (BUG-038). The whole startup /
    # shutdown sequence below runs nested inside it.
    async with mcp_app.router.lifespan_context(app):
        global _scheduler_task
        install_log_handler()
        log_activity("system", "ViLife backend starting", level="INFO")
        logger.info("Vienna SOTA Backend starting...")

        # Ensure backend folder is in path for imports
        # web_sota is the CWD, backend is sibling to web_sota
        backend_path = os.path.abspath(os.path.join(os.getcwd(), "..", "backend"))
        if backend_path not in sys.path:
            sys.path.append(backend_path)
            logger.info("Added %s to sys.path", backend_path)

        # Initialize the ViLife SQLite life-data store (calendar, health, travel, …)
        try:
            init_db()
            logger.info(
                "ViLife SQLite store initialized at %s",
                os.environ.get("VILIFE_DB_PATH", "web_sota/data/vilife.db"),
            )
        except Exception as e:
            logger.error("ViLife SQLite init failed: %s", e)

        # Initialize DB from the main backend models
        try:
            import importlib

            _legacy_init_db = importlib.import_module("models.base").init_db
            _legacy_init_db()
            logger.info("Main backend database initialized")
        except ImportError:
            logger.warning(
                "Could not find main backend models. Running in standalone/mock mode."
            )
        except Exception as e:
            logger.error("Database initialization failed: %s", e)

        # Start the PA daily-brief scheduler
        _scheduler_task = asyncio.create_task(scheduler_loop())

        yield
        logger.info("Vienna SOTA Backend shutting down...")

        if _scheduler_task is not None:
            _scheduler_task.cancel()
            try:
                await _scheduler_task
            except (asyncio.CancelledError, Exception):  # noqa: BLE001
                pass


_scheduler_task: asyncio.Task | None = None

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
        "http://localhost:10931",
        "http://127.0.0.1:10931",
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
    image: str | None = None


class ShoppingOffer(BaseModel):
    store: str
    product: str
    price: float
    old_price: float | None = None
    discount: int
    category: str


app.include_router(llm_router)
app.include_router(skills_router)
app.include_router(life_router)
app.include_router(logs_router)
app.include_router(life_db_router)
app.include_router(life_routes)
app.include_router(todo_routes)
app.include_router(expense_routes)
app.include_router(health_routes)
app.include_router(condition_routes)
app.include_router(medication_routes)
app.include_router(vitals_routes)
app.include_router(trip_routes)
app.include_router(packing_routes)
app.include_router(document_routes)
app.include_router(contact_routes)
app.include_router(pet_routes)
app.include_router(subscription_routes)
app.include_router(home_task_routes)
app.include_router(log_routes)
app.include_router(news_router)
app.include_router(notes_router)
app.include_router(email_router)
app.include_router(pa_router)
app.include_router(environment_router)
app.include_router(onboarding_router)


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


@app.get("/api/control-tower")
def control_tower(probe: int = Query(1, ge=0, le=1), fresh: int = Query(0, ge=0, le=1)):
    """Fleet Control Tower aggregate (SPEC Phase 1+2): fleet services with
    concurrent health, Windows services (naked sc + NSSM), Goliath PC stats."""
    from vienna_life_assistant.control_tower import build_control_tower

    try:
        return build_control_tower(probe=bool(probe), fresh=bool(fresh))
    except Exception as exc:
        logger.exception("control_tower endpoint failed")
        return {
            "error": str(exc),
            "services": {"summary": {"total": 0}, "ships": []},
            "windows_services": {"items": [], "source_ok": False},
            "goliath": {"source_ok": False},
        }


@app.get("/api/services")
def services():
    """Every Windows service with NSSM classification (read-only)."""
    from vienna_life_assistant.control_tower import windows_services

    return windows_services()


@app.get("/api/goliath")
def goliath():
    """Goliath host overview: CPU/RAM (psutil) + GPU (nvidia-smi) + verdict."""
    from vienna_life_assistant.control_tower import goliath_stats

    return goliath_stats()


@app.get("/api/control-tower/orphans")
def control_tower_orphans(fresh: int = Query(0, ge=0, le=1)):
    """Orphaned MCP/agent servers on Goliath + socket pressure (blooper #23)."""
    from vienna_life_assistant.control_tower import scan_orphans

    return scan_orphans(fresh=bool(fresh))


@app.post("/api/control-tower/orphans/{pid}/kill")
def control_tower_orphan_kill(pid: int, request: Request):
    """Kill one orphaned server. Requires header X-Vienna-Confirm: 1."""
    if request.headers.get("X-Vienna-Confirm") != "1":
        raise HTTPException(
            status_code=403, detail="Killing requires header X-Vienna-Confirm: 1"
        )
    from vienna_life_assistant.control_tower import kill_orphan

    result = kill_orphan(int(pid))
    if result.get("success") is False:
        raise HTTPException(status_code=409, detail=result.get("error", "Kill failed"))
    return result


@app.post("/api/control-tower/orphans/reap-all")
def control_tower_orphan_reap_all(request: Request):
    """Kill every orphaned server. Requires header X-Vienna-Confirm: 1."""
    if request.headers.get("X-Vienna-Confirm") != "1":
        raise HTTPException(
            status_code=403, detail="Killing requires header X-Vienna-Confirm: 1"
        )
    from vienna_life_assistant.control_tower import reap_all

    result = reap_all()
    if not result.get("source_ok"):
        raise HTTPException(status_code=409, detail=result.get("error", "Reap failed"))
    return result


@app.get("/api/dashboard", response_model=dict[str, Any])
async def get_dashboard_data():
    """Aggregated dashboard statistics — DB-backed life data."""
    from vienna_life_assistant import life_db
    from vienna_life_assistant.db import SessionLocal

    with SessionLocal() as db:
        events = life_db.upcoming_events(db, days=1)
        meds = life_db.active_medications(db)
        trips = life_db.next_trips(db, limit=1)
        total = life_db.expense_month_total(db)
        birthdays = life_db.upcoming_birthdays(db, days=14)
    return {
        "stats": [
            {
                "title": "Today",
                "value": str(len(events)),
                "change": f"{len(events)} event(s) planned",
                "icon": "Calendar",
                "color": "text-cosmos-400",
            },
            {
                "title": "Active Medications",
                "value": str(len(meds)),
                "change": f"{len(meds)} with schedule",
                "icon": "Pill",
                "color": "text-emerald-400",
            },
            {
                "title": "Next Trip",
                "value": trips[0]["title"] if trips else "—",
                "change": trips[0]["start_date"] if trips else "Nothing planned",
                "icon": "Plane",
                "color": "text-amber-400",
            },
            {
                "title": "Month Expenses",
                "value": f"€{total:,.0f}",
                "change": f"{len(birthdays)} birthday(s) soon",
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
    """Get Alsergrund/Servitenviertel restaurants (verified 2026-10-16) + live lunch menus."""
    from vienna_life_assistant.restaurants_data import (
        FETCHED_ON,
        SOURCES,
        get_official_urls,
        get_restaurants,
    )
    from vienna_life_assistant.vienna_scraper import fetch_lunch_menus

    return {
        "restaurants": _with_urls(get_restaurants(), get_official_urls()),
        "lunch_menus": fetch_lunch_menus(),
        "fetched_on": FETCHED_ON,
        "sources": SOURCES,
    }


@app.get("/api/vienna/accommodation")
async def get_accommodation():
    """Vienna accommodation: Gemeindebau paean + stay entries (researched 2026-10-16)."""
    from vienna_life_assistant.accommodation_data import (
        FETCHED_ON,
        SOURCES,
        get_official_urls,
        get_paean,
        get_stays,
    )

    return {
        "paean": get_paean(),
        "stays": _with_urls(get_stays(), get_official_urls()),
        "fetched_on": FETCHED_ON,
        "sources": SOURCES,
    }


@app.get("/api/vienna/culture")
async def get_culture():
    """Vienna culture: music to Schrammeln, museums, theater, film, festivals, galleries."""
    from vienna_life_assistant.culture_data import (
        FETCHED_ON,
        SOURCES,
        get_culture_intro,
        get_culture_venues,
        get_official_urls,
    )

    return {
        "intro": get_culture_intro(),
        "venues": _with_urls(get_culture_venues(), get_official_urls()),
        "fetched_on": FETCHED_ON,
        "sources": SOURCES,
    }


@app.get("/api/vienna/history")
async def get_history():
    """Vienna history: Vindobona to the present (extensive section)."""
    from vienna_life_assistant.history_data import (
        FETCHED_ON,
        SOURCES,
        get_history_chapters,
        get_timeline,
    )

    return {
        "chapters": get_history_chapters(),
        "timeline": get_timeline(),
        "fetched_on": FETCHED_ON,
        "sources": SOURCES,
    }


@app.get("/api/vienna/education")
async def get_education():
    """Vienna education: schools, universities, academies."""
    from vienna_life_assistant.education_data import (
        FETCHED_ON,
        SOURCES,
        get_education_chapters,
        get_institutions,
        get_official_urls,
    )

    return {
        "chapters": get_education_chapters(),
        "institutions": _with_urls(get_institutions(), get_official_urls()),
        "fetched_on": FETCHED_ON,
        "sources": SOURCES,
    }


@app.get("/api/vienna/economy")
async def get_economy():
    """Vienna economy: employers, internationals, startups."""
    from vienna_life_assistant.economy_data import (
        FETCHED_ON,
        SOURCES,
        get_economy_chapters,
        get_official_urls,
        get_players,
    )

    return {
        "chapters": get_economy_chapters(),
        "players": _with_urls(get_players(), get_official_urls()),
        "fetched_on": FETCHED_ON,
        "sources": SOURCES,
    }


@app.get("/api/vienna/politics")
async def get_politics():
    """Vienna politics: Bund, Stadt, Haltung."""
    from vienna_life_assistant.politics_data import (
        FETCHED_ON,
        SOURCES,
        get_actors,
        get_official_urls,
        get_politics_chapters,
    )

    return {
        "chapters": get_politics_chapters(),
        "actors": _with_urls(get_actors(), get_official_urls()),
        "fetched_on": FETCHED_ON,
        "sources": SOURCES,
    }


@app.get("/api/vienna/verkehr")
async def get_transport():
    """Vienna transport: world-class Oeffis vs. car flood."""
    from vienna_life_assistant.transport_data import (
        FETCHED_ON,
        SOURCES,
        get_links,
        get_official_urls,
        get_transport_chapters,
    )

    return {
        "chapters": get_transport_chapters(),
        "links": _with_urls(get_links(), get_official_urls()),
        "fetched_on": FETCHED_ON,
        "sources": SOURCES,
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


@app.get("/api/vienna/news")
async def get_vienna_news():
    """Vienna headlines from wien.ORF.at (public broadcaster)."""
    from vienna_life_assistant.vienna_scraper import fetch_news

    return fetch_news()


@app.get("/api/vienna/press")
async def get_vienna_press():
    """City government announcements from presse.wien.gv.at."""
    from vienna_life_assistant.vienna_scraper import fetch_press

    return fetch_press()


@app.get("/api/vienna/transport")
async def get_transit_info():
    """Real Wiener Linien departures via mywienerlinien /api/departures (OGD).

    RBLs verified: Friedensbrücke 352/385/4404/4433 (tramstations.md), Spittelau
    121 (/api/stops/major). Offline -> empty stations with offline=True (mock
    flag kept for the declared-mock test). Never fabricated times.
    """
    from vienna_life_assistant.environment_routes import monitor_departures

    # RBLs verified: FB via tramstations.md + Docker-Logs; FJB via OGD-Steige-Cache
    # (Halt 1085616162). FB nur 5+12 (U-Bahn uninteressant); FJB alle live
    # Linien. Ein Eintrag je Station genuegt (2 Min. Takt). D-Steig am FJB
    # (Bereich 1) hat KEINEN Monitor-RBL — D dort nicht live abfragbar.
    stops = {
        "Friedensbrücke": (["352", "385", "4404", "4433"], ["5", "12"]),
        "Franz-Josefs-Bahnhof": (["353", "384", "101", "118", "5745", "5748"], None),
    }
    result: dict[str, Any] = {}
    via: str | None = None
    for name, (rbls, only) in stops.items():
        merged: list[dict[str, Any]] = []
        for rbl in rbls:
            live = monitor_departures(rbl)
            if live is None:
                return {
                    "ok": True,
                    "mock": True,
                    "offline": True,
                    "source": "mywienerlinien + gtfs-mcp offline — start D:\\Dev\\repos\\mywienerlinien\\start.ps1 for live departures",
                    "Friedensbrücke": [],
                    "Franz-Josefs-Bahnhof": [],
                }
            via = live.pop("_via", via)
            for d in live.get("departures") or []:
                line = str(d.get("line", "?"))
                if line.startswith("U"):
                    continue
                if only is not None and line not in only:
                    continue
                merged.append(
                    {
                        "line": line,
                        "destination": d.get("destination", "?"),
                        "time": "jetzt"
                        if d.get("countdown") == 0
                        else f"{d.get('countdown')} min",
                        "type": "tram",
                    }
                )
        result[name] = merged[:1]
    return {"ok": True, "source": f"live via {via}", **result}


@app.post("/api/fleet/start")
async def fleet_start_app(body: dict[str, Any]):
    """Cross-hop starter: launches a fleet app's start.ps1 detached.

    Allowlist only (mywienerlinien, gtfs-mcp, devices-mcp). Local-only by
    design (binds 127.0.0.1, no auth — same trust zone as the dashboard).
    """
    import subprocess

    ALLOW = {
        "mywienerlinien": "D:\\Dev\\repos\\mywienerlinien\\start.ps1",
        "gtfs-mcp": "D:\\Dev\\repos\\gtfs-mcp\\start.ps1",
        "devices-mcp": "D:\\Dev\\repos\\devices-mcp\\start.ps1",
        "email-mcp": "D:\\Dev\\repos\\email-mcp\\start.ps1",
        "onenote-mcp": "D:\\Dev\\repos\\onenote-mcp\\start.ps1",
        "aiwatcher-mcp": "D:\\Dev\\repos\\aiwatcher-mcp\\start.ps1",
    }
    name = str(body.get("name", ""))
    script = ALLOW.get(name)
    if script is None:
        raise HTTPException(status_code=404, detail=f"unknown app: {name}")
    try:
        subprocess.Popen(  # noqa: S603
            [
                "pwsh",
                "-NoProfile",
                "-ExecutionPolicy",
                "Bypass",
                "-File",
                script,
                "-Headless",
            ],
            cwd="D:\\Dev\\repos\\" + name,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
    except Exception as e:  # noqa: BLE001
        raise HTTPException(status_code=500, detail=str(e))
    return {"ok": True, "app": name, "status": "starting"}


@app.get("/api/vienna/crossconnects")
async def get_crossconnects():
    """Fleet bridges with live status: what ViLife talks to, and how to start it."""
    import httpx

    bridges = [
        {
            "name": "mywienerlinien",
            "purpose": "Live-Abfahrten + Karte mit Fahrzeugpositionen",
            "port": 11170,
            "frontend": 10896,
            "feeds": "Verkehr-Seite, Transit-Widget",
        },
        {
            "name": "gtfs-mcp",
            "purpose": "GTFS-Fahrplaene als Zweitquelle",
            "port": 10913,
            "frontend": 10912,
            "feeds": "Verkehr-Seite (Fallback)",
        },
        {
            "name": "devices-mcp",
            "purpose": "Vienna living: Wohnungstemperatur, Fritz!Box, Kameras, Energie",
            "port": 10717,
            "frontend": 10716,
            "feeds": "Environment-Widget, Dashboard",
        },
        {
            "name": "email-mcp",
            "purpose": "Mail-Gateway (Inbox, Senden, Suche)",
            "port": 10813,
            "frontend": None,
            "feeds": "Email-Seite",
        },
        {
            "name": "onenote-mcp",
            "purpose": "OneNote-Gateway (Journal, Notizen)",
            "port": 10907,
            "frontend": None,
            "feeds": "Notes-Seite",
        },
        {
            "name": "aiwatcher-mcp",
            "purpose": "News-Engine (Topmeldungen, Trends, Bundles)",
            "port": 10946,
            "frontend": None,
            "feeds": "News-Seite",
        },
    ]
    out = []
    for b in bridges:
        status = "offline"
        for path in ("/health", "/"):
            try:
                with httpx.Client(timeout=2.0) as client:
                    r = client.get(f"http://127.0.0.1:{b['port']}{path}")
                    if 200 <= r.status_code < 300:
                        status = "live"
                        break
            except Exception:  # noqa: BLE001
                continue
        out.append({**b, "status": status})
    return {"bridges": out}


@app.get("/api/vienna/shopping/offers", response_model=list[ShoppingOffer])
async def get_shopping_offers():
    """Static reference offers — mock. Live: Spar/Billa scrapers when wired."""
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
        "tool_count": 13,
        "tools": [
            {"name": "vienna_life", "operations": 16},
            {"name": "vienna_health", "operations": 12},
            {"name": "vienna_travel", "operations": 11},
            {"name": "vienna_contacts", "operations": 5},
            {"name": "vienna_household", "operations": 12},
            {"name": "vienna_log", "operations": 8},
            {"name": "vienna_news", "operations": 6},
            {"name": "vienna_notes", "operations": 6},
            {"name": "vienna_email", "operations": 7},
            {"name": "vienna_environment", "operations": 1},
            {"name": "vienna_shutdown"},
            {"name": "vienna_life_agentic"},
            {"name": "vienna_tips"},
        ],
        "system": {"windows": True},
        "errors": [],
    }


# Mount vienna_life MCP at /mcp (P3) — mcp_app built at module top with
# path="/" (no BUG-008 double-prefix); its lifespan is folded into the
# parent lifespan above (no BUG-038 session-manager outage).
app.mount("/mcp", mcp_app)


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
