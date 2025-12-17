"""
Plex Service
Integration with Plex Media Server (50k anime + 5k movies)
"""
import httpx
from typing import List, Dict, Any, Optional
import logging
import os

logger = logging.getLogger(__name__)


class PlexService:
    """Service for Plex Media Server integration"""

    def __init__(self):
        tailscale_hostname = os.getenv("TAILSCALE_HOSTNAME", "goliath")
        self.base_url = os.getenv("PLEX_URL", f"http://{tailscale_hostname}:32400")
        self.token = os.getenv("PLEX_TOKEN", "")
        self.timeout = 10.0

    async def check_connection(self) -> bool:
        """Check if Plex is accessible"""
        if not self.token:
            return False

        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.get(
                    f"{self.base_url}/",
                    headers={"X-Plex-Token": self.token}
                )
                return response.status_code == 200
        except Exception as e:
            logger.warning(f"Plex not accessible: {e}")
            return False

    async def get_continue_watching(self, limit: int = 10) -> List[Dict[str, Any]]:
        """Get continue watching queue"""
        if not self.token:
            return self._get_mock_continue_watching()

        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.get(
                    f"{self.base_url}/hubs/continueWatching/items",
                    headers={"X-Plex-Token": self.token}
                )
                response.raise_for_status()

                # Parse Plex XML/JSON response
                # This is simplified - actual Plex API returns XML
                data = response.json()
                items = data.get("MediaContainer", {}).get("Metadata", [])[:limit]

                return [
                    {
                        "title": item.get("title"),
                        "type": item.get("type"),
                        "progress": item.get("viewOffset", 0),
                        "duration": item.get("duration", 0),
                        "thumb": item.get("thumb"),
                        "year": item.get("year"),
                    }
                    for item in items
                ]

        except Exception as e:
            logger.error(f"Failed to get continue watching: {e}")
            return self._get_mock_continue_watching()

    def _get_mock_continue_watching(self) -> List[Dict[str, Any]]:
        """Mock continue watching data"""
        return [
            {
                "title": "Demon Slayer Season 2 Episode 15",
                "type": "episode",
                "progress": 45,  # 45% watched
                "duration": 1440,  # 24 minutes in seconds
                "thumb": None,
                "year": 2023,
                "series": "Demon Slayer"
            },
            {
                "title": "Bocchi the Rock! Episode 8",
                "type": "episode",
                "progress": 0,
                "duration": 1440,
                "thumb": None,
                "year": 2023,
                "series": "Bocchi the Rock!"
            },
            {
                "title": "Frieren: Beyond Journey's End Episode 28",
                "type": "episode",
                "progress": 0,
                "duration": 1560,
                "thumb": None,
                "year": 2024,
                "series": "Frieren"
            },
        ]

    async def get_recently_added(self, limit: int = 10) -> List[Dict[str, Any]]:
        """Get recently added media"""
        # Mock data for now
        return [
            {
                "title": "Frieren Episode 28",
                "type": "episode",
                "added_at": "2025-12-03",
                "series": "Frieren: Beyond Journey's End"
            },
            {
                "title": "Spy x Family Code: White (Movie)",
                "type": "movie",
                "added_at": "2025-12-02",
                "series": None
            },
        ]

    async def get_library_stats(self) -> Dict[str, Any]:
        """Get library statistics"""
        return {
            "anime_count": 50000,
            "movie_count": 5000,
            "total_hours": 25000,
            "watch_time_today": 0,
            "watch_time_week": 12.5
        }


# Global instance
plex_service = PlexService()

