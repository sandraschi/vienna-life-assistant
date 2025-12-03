"""
Media & Home Integration API Routes
Plex, Calibre, Immich, Tapo integrations
"""
from fastapi import APIRouter
from services.plex_service import plex_service
from services.calibre_service import calibre_service
import logging

logger = logging.getLogger(__name__)

router = APIRouter()


@router.get("/status")
async def get_media_status():
    """Get status of all media services"""
    plex_connected = await plex_service.check_connection()
    calibre_connected = await calibre_service.check_connection()

    return {
        "plex": {
            "connected": plex_connected,
            "url": plex_service.base_url,
            "configured": bool(plex_service.token)
        },
        "calibre": {
            "connected": calibre_connected,
            "url": calibre_service.base_url
        },
        "immich": {
            "connected": False,
            "message": "Not yet implemented"
        },
        "tapo": {
            "connected": False,
            "message": "Not yet implemented"
        }
    }


# Plex endpoints
@router.get("/plex/continue-watching")
async def get_plex_continue_watching(limit: int = 10):
    """Get Plex continue watching queue"""
    items = await plex_service.get_continue_watching(limit)
    return {"items": items, "count": len(items)}


@router.get("/plex/recently-added")
async def get_plex_recently_added(limit: int = 10):
    """Get recently added media"""
    items = await plex_service.get_recently_added(limit)
    return {"items": items, "count": len(items)}


@router.get("/plex/stats")
async def get_plex_stats():
    """Get Plex library statistics"""
    stats = await plex_service.get_library_stats()
    return stats


# Calibre endpoints
@router.get("/calibre/currently-reading")
async def get_calibre_currently_reading():
    """Get currently reading books"""
    books = await calibre_service.get_currently_reading()
    return {"books": books, "count": len(books)}


@router.get("/calibre/recent")
async def get_calibre_recent(limit: int = 10):
    """Get recently added books"""
    books = await calibre_service.get_recent_books(limit)
    return {"books": books, "count": len(books)}


@router.get("/calibre/stats")
async def get_calibre_stats():
    """Get Calibre library statistics"""
    stats = await calibre_service.get_library_stats()
    return stats


@router.get("/calibre/search")
async def search_calibre_books(q: str, limit: int = 20):
    """Search Calibre library"""
    results = await calibre_service.search_books(q, limit)
    return {"results": results, "count": len(results)}


# Immich endpoints (placeholder)
@router.get("/immich/recent-photos")
async def get_immich_recent_photos():
    """Get recent photos from Immich"""
    return {
        "photos": [],
        "message": "Immich integration coming soon"
    }


# Tapo endpoints (placeholder)
@router.get("/tapo/cameras")
async def get_tapo_cameras():
    """Get Tapo camera status"""
    return {
        "cameras": [],
        "message": "Tapo integration coming soon - use existing tapo-camera-mcp"
    }

