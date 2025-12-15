"""
Advanced Memory Service for Vienna Life Assistant

Handles interactions with the Advanced Memory knowledge base system.
This integrates with the MCP Advanced Memory server for note management.
"""

import logging
from typing import List, Dict, Any, Optional
from services.mcp_clients import mcp_clients

logger = logging.getLogger(__name__)

class AdvancedMemoryService:
    """
    Service for interacting with the Advanced Memory knowledge base.
    Provides methods for searching, creating, and managing notes.
    """

    def __init__(self):
        self.logger = logging.getLogger(__name__)

    async def search_notes(self, query: str, **kwargs) -> List[Dict[str, Any]]:
        """
        Search the knowledge base for relevant notes.

        Args:
            query: Search query
            **kwargs: Additional search parameters

        Returns:
            List of matching notes
        """
        try:
            if not mcp_clients.advanced_memory:
                self.logger.warning("Advanced Memory MCP client not available")
                return []

            result = await mcp_clients.advanced_memory.call_tool(
                tool_name="search_knowledge",
                query=query,
                **kwargs
            )

            if result.get("success"):
                return result.get("results", [])
            else:
                self.logger.error(f"Advanced Memory search failed: {result.get('error')}")
                return []

        except Exception as e:
            self.logger.error(f"Advanced Memory search error: {e}")
            return []

    async def create_note(self, title: str, content: str, **kwargs) -> bool:
        """
        Create a new note in the knowledge base.

        Args:
            title: Note title
            content: Note content
            **kwargs: Additional metadata (tags, folder, etc.)

        Returns:
            bool: True if note created successfully
        """
        try:
            if not mcp_clients.advanced_memory:
                self.logger.warning("Advanced Memory MCP client not available")
                return False

            result = await mcp_clients.advanced_memory.call_tool(
                tool_name="create_note",
                title=title,
                content=content,
                **kwargs
            )

            return result.get("success", False)

        except Exception as e:
            self.logger.error(f"Advanced Memory note creation error: {e}")
            return False

    async def get_recent_notes(self, limit: int = 10) -> List[Dict[str, Any]]:
        """
        Get recently updated notes from the knowledge base.

        Args:
            limit: Maximum number of notes to return

        Returns:
            List of recent notes
        """
        try:
            if not mcp_clients.advanced_memory:
                self.logger.warning("Advanced Memory MCP client not available")
                return []

            result = await mcp_clients.advanced_memory.call_tool(
                tool_name="recent_notes",
                limit=limit
            )

            if result.get("success"):
                return result.get("notes", [])
            else:
                self.logger.error(f"Advanced Memory recent notes failed: {result.get('error')}")
                return []

        except Exception as e:
            self.logger.error(f"Advanced Memory recent notes error: {e}")
            return []

# Global instance
advanced_memory = AdvancedMemoryService()
