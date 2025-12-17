"""
Calibre Service
Integration with Calibre ebook library (15k ebooks)
"""
import httpx
from typing import List, Dict, Any
import logging
import os

logger = logging.getLogger(__name__)


class CalibreService:
    """Service for Calibre library integration"""

    def __init__(self):
        tailscale_hostname = os.getenv("TAILSCALE_HOSTNAME", "goliath")
        self.base_url = os.getenv("CALIBRE_URL", f"http://{tailscale_hostname}:8083")
        self.timeout = 10.0

    async def check_connection(self) -> bool:
        """Check if Calibre server is accessible"""
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.get(f"{self.base_url}/ajax/library-info")
                return response.status_code == 200
        except Exception as e:
            logger.warning(f"Calibre not accessible: {e}")
            return False

    async def get_currently_reading(self) -> List[Dict[str, Any]]:
        """Get currently reading books"""
        # Mock data for now
        return [
            {
                "title": "Project Hail Mary",
                "author": "Andy Weir",
                "progress": 67,
                "pages_read": 335,
                "total_pages": 500,
                "cover": None,
                "last_read": "2025-12-02"
            },
            {
                "title": "三体 (The Three-Body Problem)",
                "author": "Liu Cixin",
                "progress": 34,
                "pages_read": 136,
                "total_pages": 400,
                "cover": None,
                "last_read": "2025-12-01"
            },
        ]

    async def get_recent_books(self, limit: int = 10) -> List[Dict[str, Any]]:
        """Get recently added books"""
        return [
            {
                "title": "Foundation",
                "author": "Isaac Asimov",
                "added_at": "2025-12-01",
                "series": "Foundation Series",
                "rating": 4.5
            },
            {
                "title": "雪国 (Snow Country)",
                "author": "Kawabata Yasunari",
                "added_at": "2025-11-30",
                "series": None,
                "rating": 4.0
            },
        ]

    async def get_library_stats(self) -> Dict[str, Any]:
        """Get library statistics"""
        return {
            "total_books": 15000,
            "currently_reading": 2,
            "books_read_this_year": 45,
            "favorite_genres": ["Science Fiction", "Fantasy", "Japanese Literature"]
        }

    async def search_books(self, query: str, limit: int = 20) -> List[Dict[str, Any]]:
        """Search Calibre library"""
        # Placeholder for search
        return []


# Global instance
calibre_service = CalibreService()

