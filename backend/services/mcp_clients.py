"""
MCP Client Services
Connect to external MCP servers (Plex, Calibre, Ollama, etc.) via STDIO transport

This module provides clients to consume functionality from other MCP servers
using the proper FastMCP stdio transport pattern (not HTTP!).
"""
import asyncio
import os
from pathlib import Path
from typing import Optional, List, Dict, Any
from datetime import datetime
import logging

from fastmcp import Client
from fastmcp.client.transports import StdioTransport

logger = logging.getLogger(__name__)


class MCPClientBase:
    """Base class for MCP clients using STDIO transport"""
    
    def __init__(self, server_path: str, server_name: str, timeout: int = 30):
        """
        Initialize MCP client with stdio transport
        
        Args:
            server_path: Path to the MCP server executable (e.g., "D:/Dev/repos/plex-mcp/src/main.py")
            server_name: Human-readable server name
            timeout: Tool execution timeout in seconds
        """
        self.server_path = server_path
        self.server_name = server_name
        self.timeout = timeout
        self.transport: Optional[StdioTransport] = None
        self.client: Optional[Client] = None
        self._is_connected = False
    
    async def connect(self) -> bool:
        """
        Connect to the MCP server via stdio transport
        
        Returns:
            True if connection successful, False otherwise
        """
        if self._is_connected and self.client:
            return True
        
        try:
            # Check if server path exists
            server_path = Path(self.server_path)
            if not server_path.exists():
                logger.warning(f"{self.server_name}: Server path does not exist: {server_path}")
                return False
            
            # Create stdio transport - spawns the MCP server process
            self.transport = StdioTransport(
                command="python",
                args=[str(server_path)],
                env=os.environ.copy()
            )
            
            # Create FastMCP client
            self.client = Client(self.transport)
            
            # Test connection
            async with self.client:
                await self.client.initialize()
                tools = await self.client.list_tools()
                logger.info(f"{self.server_name}: Connected via stdio ({len(tools)} tools available)")
            
            self._is_connected = True
            return True
            
        except Exception as e:
            logger.error(f"{self.server_name}: Failed to connect via stdio: {e}")
            await self.close()
            return False
    
    async def call_tool(self, tool_name: str, **kwargs) -> Dict[str, Any]:
        """
        Call an MCP tool via stdio transport
        
        Args:
            tool_name: Name of the tool to call
            **kwargs: Tool parameters
        
        Returns:
            Tool result as dictionary
        """
        if not self._is_connected or not self.client:
            # Try to connect
            if not await self.connect():
                return {
                    "success": False,
                    "error": f"{self.server_name} not connected"
                }
        
        try:
            async with self.client:
                result = await asyncio.wait_for(
                    self.client.call_tool(tool_name, **kwargs),
                    timeout=self.timeout
                )
                return {
                    "success": True,
                    "result": result
                }
        except asyncio.TimeoutError:
            return {
                "success": False,
                "error": f"Tool {tool_name} timed out after {self.timeout}s"
            }
        except Exception as e:
            logger.error(f"{self.server_name}: Error calling {tool_name}: {e}")
            return {
                "success": False,
                "error": f"Error calling {tool_name}: {str(e)}"
            }
    
    async def list_tools(self) -> List[Dict[str, Any]]:
        """List available tools from the MCP server"""
        if not self._is_connected or not self.client:
            if not await self.connect():
                return []
        
        try:
            async with self.client:
                tools = await self.client.list_tools()
                return [
                    {
                        "name": tool.name,
                        "description": tool.description,
                        "inputSchema": tool.inputSchema
                    }
                    for tool in tools
                ]
        except Exception as e:
            logger.error(f"{self.server_name}: Error listing tools: {e}")
            return []
    
    async def close(self):
        """Close the MCP client connection"""
        self._is_connected = False
        # FastMCP handles cleanup automatically
        self.client = None
        self.transport = None


# ============================================================================
# PLEX CLIENT
# ============================================================================

class PlexMCPClient(MCPClientBase):
    """
    Client for Plex MCP server via stdio
    
    Access 50,000+ anime/movies from Plex Media Server
    """
    
    def __init__(self):
        # Path to the Plex MCP server script
        server_path = os.getenv(
            "PLEX_MCP_PATH",
            "D:/Dev/repos/plex-mcp/src/plex_mcp/server.py"
        )
        super().__init__(server_path, "Plex MCP")
    
    async def get_continue_watching(self) -> Dict[str, Any]:
        """Get continue watching items"""
        return await self.call_tool("plex_media", operation="continue_watching", limit=10)
    
    async def get_recently_added(self, limit: int = 10) -> Dict[str, Any]:
        """Get recently added media"""
        return await self.call_tool("plex_media", operation="recently_added", limit=limit)
    
    async def get_on_deck(self) -> Dict[str, Any]:
        """Get on deck (next episodes to watch)"""
        return await self.call_tool("plex_media", operation="on_deck", limit=10)
    
    async def search(self, query: str) -> Dict[str, Any]:
        """Search Plex library"""
        return await self.call_tool("plex_search", query=query)
    
    async def get_stats(self) -> Dict[str, Any]:
        """Get Plex library statistics"""
        return await self.call_tool("plex_info", operation="stats")


# ============================================================================
# CALIBRE CLIENT
# ============================================================================

class CalibreMCPClient(MCPClientBase):
    """
    Client for Calibre MCP server via stdio
    
    Access 15,000+ ebooks from Calibre library
    """
    
    def __init__(self):
        # Path to the Calibre MCP server script
        server_path = os.getenv(
            "CALIBRE_MCP_PATH",
            "D:/Dev/repos/calibre-mcp/src/calibre_mcp/server.py"
        )
        super().__init__(server_path, "Calibre MCP")
    
    async def get_currently_reading(self) -> Dict[str, Any]:
        """Get books currently being read"""
        return await self.call_tool("calibre_books", operation="reading_list")
    
    async def get_recent_books(self, limit: int = 10) -> Dict[str, Any]:
        """Get recently added books"""
        return await self.call_tool("calibre_books", operation="recent", limit=limit)
    
    async def search_books(self, query: str) -> Dict[str, Any]:
        """Search Calibre library"""
        return await self.call_tool("calibre_search", query=query)
    
    async def get_stats(self) -> Dict[str, Any]:
        """Get Calibre library statistics"""
        return await self.call_tool("calibre_info", operation="stats")


# ============================================================================
# OLLAMA CLIENT (Local LLM)
# ============================================================================

class OllamaMCPClient(MCPClientBase):
    """
    Client for Ollama MCP server via stdio (if available as MCP)
    
    Note: This assumes you have an MCP server wrapper for Ollama.
    If not available, this will gracefully fail and use direct service.
    """
    
    def __init__(self):
        # Path to Ollama MCP server (if it exists)
        server_path = os.getenv(
            "OLLAMA_MCP_PATH",
            "D:/Dev/repos/local-llm-mcp/src/llm_mcp/main.py"
        )
        super().__init__(server_path, "Ollama MCP")
    
    async def generate(self, model: str, prompt: str) -> Dict[str, Any]:
        """Generate text with Ollama model"""
        return await self.call_tool(
            "ollama_generate",
            model=model,
            prompt=prompt
        )
    
    async def list_models(self) -> Dict[str, Any]:
        """List available Ollama models"""
        return await self.call_tool("ollama_list")
    
    async def recommend_media(self, history: List[str]) -> Dict[str, Any]:
        """Get AI recommendations based on watch/read history"""
        prompt = f"""Based on this viewing/reading history, suggest what to watch or read next:
{chr(10).join(f'- {item}' for item in history)}

Provide 3-5 specific recommendations with brief reasons."""
        
        return await self.generate(
            model=os.getenv("OLLAMA_MODEL", "llama3.2:3b"),
            prompt=prompt
        )


# ============================================================================
# IMMICH CLIENT (Photos)
# ============================================================================

class ImmichMCPClient(MCPClientBase):
    """
    Client for Immich MCP server via stdio
    
    Access photo library and memories
    """
    
    def __init__(self):
        # Path to Immich MCP server script
        server_path = os.getenv(
            "IMMICH_MCP_PATH",
            "D:/Dev/repos/immich-mcp/src/immich_mcp/server.py"
        )
        super().__init__(server_path, "Immich MCP")
    
    async def get_recent_photos(self, limit: int = 20) -> Dict[str, Any]:
        """Get recently added photos"""
        return await self.call_tool("immich_photos", operation="recent", limit=limit)
    
    async def get_today_in_history(self) -> Dict[str, Any]:
        """Get photos from this day in past years"""
        today = datetime.now()
        return await self.call_tool(
            "immich_search",
            operation="on_this_day",
            month=today.month,
            day=today.day
        )
    
    async def get_stats(self) -> Dict[str, Any]:
        """Get Immich storage statistics"""
        return await self.call_tool("immich_info", operation="stats")


# ============================================================================
# TAPO CLIENT (Home Cameras)
# ============================================================================

class TapoMCPClient(MCPClientBase):
    """
    Client for Tapo Camera MCP server via stdio
    
    Access home security cameras
    """
    
    def __init__(self):
        # Path to Tapo MCP server script
        server_path = os.getenv(
            "TAPO_MCP_PATH",
            "D:/Dev/repos/tapo-camera-mcp/src/tapo_camera_mcp/server.py"
        )
        super().__init__(server_path, "Tapo MCP")
    
    async def get_camera_status(self) -> Dict[str, Any]:
        """Get status of all cameras"""
        return await self.call_tool("tapo_cameras", operation="status")
    
    async def get_recent_motion(self, limit: int = 10) -> Dict[str, Any]:
        """Get recent motion detection events"""
        return await self.call_tool("tapo_events", operation="motion", limit=limit)
    
    async def get_snapshot(self, camera_id: str) -> Dict[str, Any]:
        """Get camera snapshot"""
        return await self.call_tool("tapo_snapshot", camera_id=camera_id)


# ============================================================================
# ADVANCED MEMORY CLIENT
# ============================================================================

class GamesMCPClient(MCPClientBase):
    """
    Client for Games MCP server via stdio

    Play correspondence games and get AI analysis
    """

    def __init__(self):
        # Path to Games MCP server script
        server_path = os.getenv(
            "GAMES_MCP_PATH",
            "D:/Dev/repos/games-app/games-mcp/src/games_mcp/mcp_server.py"
        )
        super().__init__(server_path, "Games MCP")

    async def make_chess_move(self, game_id: str, move: str, fen: str = None) -> Dict[str, Any]:
        """Make a chess move in correspondence game"""
        return await self.call_tool(
            "make_move",
            game_id=game_id,
            move=move,
            game_type="chess",
            fen=fen
        )

    async def analyze_position(self, game_type: str, position: str, depth: int = 15) -> Dict[str, Any]:
        """Analyze game position with AI"""
        return await self.call_tool(
            "analyze_position",
            game_type=game_type,
            position=position,
            depth=depth
        )

    async def get_game_state(self, game_id: str) -> Dict[str, Any]:
        """Get current game state"""
        return await self.call_tool(
            "get_game_state",
            game_id=game_id
        )


class AdvancedMemoryMCPClient(MCPClientBase):
    """
    Client for Advanced Memory MCP server via stdio
    
    Access your zettelkasten knowledge base with 18+ powerful tools
    """
    
    def __init__(self):
        # Path to Advanced Memory MCP server script
        server_path = os.getenv(
            "ADVANCED_MEMORY_MCP_PATH",
            "D:/Dev/repos/advanced-memory-mcp/src/advanced_memory/mcp/server.py"
        )
        super().__init__(server_path, "Advanced Memory MCP", timeout=60)  # Longer timeout for search ops
    
    async def search_notes(self, query: str, max_results: int = 5) -> Dict[str, Any]:
        """Search your knowledge base"""
        return await self.call_tool(
            "search_notes",
            query=query,
            results_per_page=max_results
        )
    
    async def read_note(self, identifier: str) -> Dict[str, Any]:
        """Read a specific note"""
        return await self.call_tool("read_note", identifier=identifier)
    
    async def write_note(self, title: str, content: str, folder: str = "ai-chat", tags: str = "ai-generated") -> Dict[str, Any]:
        """Create a new note"""
        return await self.call_tool(
            "write_note",
            title=title,
            content=content,
            folder=folder,
            tags=tags
        )
    
    async def recent_activity(self, timeframe: str = "7d", type_filter: str = "entity") -> Dict[str, Any]:
        """Get recent notes and activity"""
        return await self.call_tool(
            "recent_activity",
            timeframe=timeframe,
            type_filter=type_filter
        )
    
    async def get_status(self) -> Dict[str, Any]:
        """Get knowledge base statistics"""
        return await self.call_tool(
            "mcp_advanced-memory-mcp_adn_navigation",
            operation="status",
            level="basic"
        )


# ============================================================================
# CLIENT MANAGER
# ============================================================================

class MCPClientManager:
    """
    Manage all MCP clients
    
    Provides centralized access to all external MCP servers
    """
    
    def __init__(self):
        self.plex = PlexMCPClient()
        self.calibre = CalibreMCPClient()
        self.ollama = OllamaMCPClient()
        self.immich = ImmichMCPClient()
        self.tapo = TapoMCPClient()
        self.advanced_memory = AdvancedMemoryMCPClient()
        self.games = GamesMCPClient()
    
    async def check_health(self) -> Dict[str, bool]:
        """Check health of all MCP services (via stdio connection test)"""
        import asyncio
        health = {}
        
        # Ollama uses direct HTTP connection, not MCP stdio
        # Check direct connection instead
        try:
            from services.ollama_service import ollama_service
            health["ollama"] = await ollama_service.check_connection()
        except Exception as e:
            logger.error(f"Ollama direct connection check failed: {e}")
            health["ollama"] = False

        for name, client in [
            ("plex", self.plex),
            ("calibre", self.calibre),
            ("immich", self.immich),
            ("tapo", self.tapo),
            ("advanced_memory", self.advanced_memory),
            ("games", self.games)
        ]:
            try:
                # Try to connect via stdio with 2-second timeout per client
                health[name] = await asyncio.wait_for(client.connect(), timeout=2.0)
            except asyncio.TimeoutError:
                logger.warning(f"Health check timeout for {name}")
                health[name] = False
            except Exception as e:
                logger.error(f"Health check failed for {name}: {e}")
                health[name] = False
        
        return health
    
    async def close_all(self):
        """Close all client connections"""
        for client in [self.plex, self.calibre, self.ollama, self.immich, self.tapo, self.advanced_memory, self.games]:
            await client.close()


# Global client manager instance
mcp_clients = MCPClientManager()

