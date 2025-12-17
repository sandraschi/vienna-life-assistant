"""
Media & Home Integration API Routes
Plex, Calibre, Immich, Tapo integrations via MCP clients
"""
from fastapi import APIRouter, HTTPException
from services.mcp_clients import mcp_clients
from services.plex_service import plex_service
from services.calibre_service import calibre_service
import logging

logger = logging.getLogger(__name__)

router = APIRouter()


@router.get("/status")
async def get_media_status():
    """Get status of all media services (direct + MCP)"""
    # Check direct services (fallback)
    plex_connected = await plex_service.check_connection()
    calibre_connected = await calibre_service.check_connection()
    
    # Check MCP services
    mcp_health = await mcp_clients.check_health()

    return {
        "plex": {
            "connected": plex_connected or mcp_health.get("plex", False),
            "url": plex_service.base_url,
            "configured": bool(plex_service.token),
            "mcp_available": mcp_health.get("plex", False)
        },
        "calibre": {
            "connected": calibre_connected or mcp_health.get("calibre", False),
            "url": calibre_service.base_url,
            "mcp_available": mcp_health.get("calibre", False)
        },
        "immich": {
            "connected": mcp_health.get("immich", False),
            "mcp_available": mcp_health.get("immich", False),
            "message": "Via MCP client"
        },
        "tapo": {
            "connected": mcp_health.get("tapo", False),
            "mcp_available": mcp_health.get("tapo", False),
            "message": "Via MCP client (tapo-camera-mcp)"
        },
        "ollama": {
            "connected": mcp_health.get("ollama", False),
            "mcp_available": False,  # Direct HTTP connection, not MCP
            "message": "Local AI via HTTP API (not MCP)"
        }
    }


# Plex endpoints (MCP + fallback)
@router.get("/plex/continue-watching")
async def get_plex_continue_watching(limit: int = 10):
    """Get Plex continue watching queue (via MCP or direct)"""
    try:
        # Try MCP client first
        result = await mcp_clients.plex.get_continue_watching()
        if result.get("success"):
            return {"items": result.get("items", []), "count": len(result.get("items", [])), "source": "mcp"}
    except Exception as e:
        logger.warning(f"MCP Plex failed, falling back to direct: {e}")
    
    # Fallback to direct service
    items = await plex_service.get_continue_watching(limit)
    return {"items": items, "count": len(items), "source": "direct"}


@router.get("/plex/recently-added")
async def get_plex_recently_added(limit: int = 10):
    """Get recently added media (via MCP or direct)"""
    try:
        # Try MCP client first
        result = await mcp_clients.plex.get_recently_added(limit)
        if result.get("success"):
            return {"items": result.get("items", []), "count": len(result.get("items", [])), "source": "mcp"}
    except Exception as e:
        logger.warning(f"MCP Plex failed, falling back to direct: {e}")
    
    # Fallback to direct service
    items = await plex_service.get_recently_added(limit)
    return {"items": items, "count": len(items), "source": "direct"}


@router.get("/plex/stats")
async def get_plex_stats():
    """Get Plex library statistics (via MCP or direct)"""
    try:
        # Try MCP client first
        result = await mcp_clients.plex.get_stats()
        if result.get("success"):
            return {**result, "source": "mcp"}
    except Exception as e:
        logger.warning(f"MCP Plex failed, falling back to direct: {e}")
    
    # Fallback to direct service
    stats = await plex_service.get_library_stats()
    return {**stats, "source": "direct"}


# Calibre endpoints (MCP + fallback)
@router.get("/calibre/currently-reading")
async def get_calibre_currently_reading():
    """Get currently reading books (via MCP or direct)"""
    try:
        # Try MCP client first
        result = await mcp_clients.calibre.get_currently_reading()
        if result.get("success"):
            return {"books": result.get("books", []), "count": len(result.get("books", [])), "source": "mcp"}
    except Exception as e:
        logger.warning(f"MCP Calibre failed, falling back to direct: {e}")
    
    # Fallback to direct service
    books = await calibre_service.get_currently_reading()
    return {"books": books, "count": len(books), "source": "direct"}


@router.get("/calibre/recent")
async def get_calibre_recent(limit: int = 10):
    """Get recently added books (via MCP or direct)"""
    try:
        # Try MCP client first
        result = await mcp_clients.calibre.get_recent_books(limit)
        if result.get("success"):
            return {"books": result.get("books", []), "count": len(result.get("books", [])), "source": "mcp"}
    except Exception as e:
        logger.warning(f"MCP Calibre failed, falling back to direct: {e}")
    
    # Fallback to direct service
    books = await calibre_service.get_recent_books(limit)
    return {"books": books, "count": len(books), "source": "direct"}


@router.get("/calibre/stats")
async def get_calibre_stats():
    """Get Calibre library statistics (via MCP or direct)"""
    try:
        # Try MCP client first
        result = await mcp_clients.calibre.get_stats()
        if result.get("success"):
            return {**result, "source": "mcp"}
    except Exception as e:
        logger.warning(f"MCP Calibre failed, falling back to direct: {e}")
    
    # Fallback to direct service
    stats = await calibre_service.get_library_stats()
    return {**stats, "source": "direct"}


@router.get("/calibre/search")
async def search_calibre_books(q: str, limit: int = 20):
    """Search Calibre library (via MCP or direct)"""
    try:
        # Try MCP client first
        result = await mcp_clients.calibre.search_books(q)
        if result.get("success"):
            return {"results": result.get("results", []), "count": len(result.get("results", [])), "source": "mcp"}
    except Exception as e:
        logger.warning(f"MCP Calibre failed, falling back to direct: {e}")
    
    # Fallback to direct service
    results = await calibre_service.search_books(q, limit)
    return {"results": results, "count": len(results), "source": "direct"}


# Immich endpoints (via MCP)
@router.get("/immich/recent-photos")
async def get_immich_recent_photos(limit: int = 20):
    """Get recent photos from Immich (via MCP)"""
    try:
        result = await mcp_clients.immich.get_recent_photos(limit)
        if result.get("success"):
            return {"photos": result.get("photos", []), "count": len(result.get("photos", [])), "source": "mcp"}
        return {"photos": [], "error": result.get("error", "Unknown error"), "source": "mcp"}
    except Exception as e:
        logger.error(f"Immich MCP error: {e}")
        return {"photos": [], "error": str(e), "source": "mcp"}


@router.get("/immich/today-in-history")
async def get_immich_today_in_history():
    """Get photos from this day in past years (via MCP)"""
    try:
        result = await mcp_clients.immich.get_today_in_history()
        if result.get("success"):
            return {"photos": result.get("photos", []), "years": result.get("years", []), "source": "mcp"}
        return {"photos": [], "error": result.get("error", "Unknown error"), "source": "mcp"}
    except Exception as e:
        logger.error(f"Immich MCP error: {e}")
        return {"photos": [], "error": str(e), "source": "mcp"}


@router.get("/immich/stats")
async def get_immich_stats():
    """Get Immich storage statistics (via MCP)"""
    try:
        result = await mcp_clients.immich.get_stats()
        if result.get("success"):
            return {**result, "source": "mcp"}
        return {"error": result.get("error", "Unknown error"), "source": "mcp"}
    except Exception as e:
        logger.error(f"Immich MCP error: {e}")
        return {"error": str(e), "source": "mcp"}


# Tapo endpoints (via MCP)
@router.get("/tapo/cameras")
async def get_tapo_cameras():
    """Get Tapo camera status (via MCP - tapo-camera-mcp)"""
    try:
        result = await mcp_clients.tapo.get_camera_status()
        if result.get("success"):
            return {"cameras": result.get("cameras", []), "count": len(result.get("cameras", [])), "source": "mcp"}
        return {"cameras": [], "error": result.get("error", "Unknown error"), "source": "mcp"}
    except Exception as e:
        logger.error(f"Tapo MCP error: {e}")
        return {"cameras": [], "error": str(e), "source": "mcp"}


@router.get("/tapo/motion-events")
async def get_tapo_motion_events(limit: int = 10):
    """Get recent motion detection events (via MCP)"""
    try:
        result = await mcp_clients.tapo.get_recent_motion(limit)
        if result.get("success"):
            return {"events": result.get("events", []), "count": len(result.get("events", [])), "source": "mcp"}
        return {"events": [], "error": result.get("error", "Unknown error"), "source": "mcp"}
    except Exception as e:
        logger.error(f"Tapo MCP error: {e}")
        return {"events": [], "error": str(e), "source": "mcp"}


# Ollama AI endpoints (via MCP)
@router.post("/ai/recommend")
async def get_ai_recommendations(history: list[str]):
    """Get AI recommendations based on watch/read history (via Ollama MCP)"""
    try:
        result = await mcp_clients.ollama.recommend_media(history)
        if result.get("success"):
            return {"recommendations": result.get("text", ""), "source": "mcp-ollama"}
        return {"recommendations": "", "error": result.get("error", "Unknown error"), "source": "mcp-ollama"}
    except Exception as e:
        logger.error(f"Ollama MCP error: {e}")
        return {"recommendations": "", "error": str(e), "source": "mcp-ollama"}

