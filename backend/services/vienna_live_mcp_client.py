"""
Vienna Live MCP Client

Client for connecting to the vienna-live-mcp server from the Vienna Life Assistant web app.
This enables programmatic access to MCP tools through HTTP transport.

This client demonstrates how the web app can leverage the comprehensive toolset
provided by the vienna-live-mcp server for enhanced functionality.
"""

import httpx
import logging
from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field

logger = logging.getLogger(__name__)

class MCPToolCall(BaseModel):
    """Model for MCP tool calls."""
    tool_name: str
    parameters: Dict[str, Any] = Field(default_factory=dict)

class MCPResponse(BaseModel):
    """Model for MCP responses."""
    success: bool
    result: Any = None
    error: Optional[str] = None
    execution_time: Optional[float] = None

class ViennaLiveMCPClient:
    """
    HTTP client for the vienna-live-mcp server.

    This client enables the Vienna Life Assistant web app to leverage
    the comprehensive toolset provided by the MCP server.
    """

    def __init__(self, base_url: str = "http://localhost:8000"):
        """
        Initialize the MCP client.

        Args:
            base_url: Base URL of the vienna-live-mcp server
        """
        self.base_url = base_url.rstrip("/")
        self.client = httpx.AsyncClient(
            timeout=httpx.Timeout(30.0, connect=10.0)
        )
        logger.info(f"Initialized Vienna Live MCP client with base URL: {base_url}")

    async def __aenter__(self):
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        await self.client.aclose()

    async def call_tool(self, tool_name: str, parameters: Dict[str, Any] = None) -> MCPResponse:
        """
        Call an MCP tool via HTTP transport.

        Args:
            tool_name: Name of the tool to call
            parameters: Tool parameters

        Returns:
            MCPResponse with tool execution result
        """
        try:
            import time
            start_time = time.time()

            payload = {
                "tool_name": tool_name,
                "parameters": parameters or {}
            }

            response = await self.client.post(
                f"{self.base_url}/tools/call",
                json=payload,
                headers={"Content-Type": "application/json"}
            )

            execution_time = time.time() - start_time

            if response.status_code == 200:
                result = response.json()
                logger.info(f"Successfully called tool '{tool_name}' in {execution_time:.2f}s")
                return MCPResponse(
                    success=True,
                    result=result,
                    execution_time=execution_time
                )
            else:
                error_msg = f"HTTP {response.status_code}: {response.text}"
                logger.error(f"Failed to call tool '{tool_name}': {error_msg}")
                return MCPResponse(
                    success=False,
                    error=error_msg,
                    execution_time=execution_time
                )

        except Exception as e:
            logger.error(f"Exception calling tool '{tool_name}': {e}")
            return MCPResponse(success=False, error=str(e))

    async def get_server_status(self) -> Dict[str, Any]:
        """
        Get comprehensive server status from the MCP server.

        Returns:
            Server status information
        """
        try:
            response = await self.call_tool("get_server_status")
            if response.success:
                return response.result
            else:
                logger.warning(f"Failed to get server status: {response.error}")
                return {"error": response.error}

        except Exception as e:
            logger.error(f"Exception getting server status: {e}")
            return {"error": str(e)}

    async def get_portmanteau_info(self, portmanteau: str) -> Dict[str, Any]:
        """
        Get detailed information about a portmanteau.

        Args:
            portmanteau: Name of the portmanteau

        Returns:
            Portmanteau information
        """
        try:
            response = await self.call_tool("get_portmanteau_info", {"portmanteau": portmanteau})
            if response.success:
                return response.result
            else:
                logger.warning(f"Failed to get portmanteau info for {portmanteau}: {response.error}")
                return {"error": response.error}

        except Exception as e:
            logger.error(f"Exception getting portmanteau info: {e}")
            return {"error": str(e)}

    # =========================================================================
    # SHOPPING MANAGER TOOLS
    # =========================================================================

    async def get_store_offers(self, store_name: Optional[str] = None, category: Optional[str] = None, limit: int = 10) -> List[Dict[str, Any]]:
        """Get current store offers."""
        response = await self.call_tool("get_store_offers", {
            "store_name": store_name,
            "category": category,
            "limit": limit
        })
        return response.result if response.success else []

    async def get_shopping_recommendations(self, based_on: str = "recent_purchases", limit: int = 5) -> List[Dict[str, Any]]:
        """Get AI-powered shopping recommendations."""
        response = await self.call_tool("get_shopping_recommendations", {
            "based_on": based_on,
            "limit": limit
        })
        return response.result if response.success else []

    async def create_shopping_list(self, name: str, description: Optional[str] = None, store_preference: Optional[str] = None) -> Dict[str, Any]:
        """Create a new shopping list."""
        response = await self.call_tool("shopping_list_create", {
            "name": name,
            "description": description,
            "store_preference": store_preference
        })
        return response.result if response.success else {"error": response.error}

    # =========================================================================
    # TRAVEL MANAGER TOOLS
    # =========================================================================

    async def get_next_tram(self, station_name: str, line: Optional[str] = None, direction: Optional[str] = None, limit: int = 3) -> List[Dict[str, Any]]:
        """Get next tram/bus/metro departures."""
        response = await self.call_tool("get_next_tram", {
            "station_name": station_name,
            "line": line,
            "direction": direction,
            "limit": limit
        })
        return response.result if response.success else []

    async def plan_day_trip(self, destination: str, departure_time: Optional[str] = None, return_time: Optional[str] = None, budget: Optional[float] = None) -> Dict[str, Any]:
        """Plan a complete day trip itinerary."""
        response = await self.call_tool("plan_day_trip", {
            "destination": destination,
            "departure_time": departure_time,
            "return_time": return_time,
            "budget": budget
        })
        return response.result if response.success else {"error": response.error}

    async def get_travel_info(self, city_name: str, info_type: str = "transport") -> Dict[str, Any]:
        """Get comprehensive travel information for a city."""
        response = await self.call_tool("get_travel_info", {
            "city_name": city_name,
            "info_type": info_type
        })
        return response.result if response.success else {"error": response.error}

    # =========================================================================
    # EXPENSES MANAGER TOOLS
    # =========================================================================

    async def add_expense(self, amount: float, description: str, category: str, date: Optional[str] = None, store: Optional[str] = None, payment_method: Optional[str] = None) -> Dict[str, Any]:
        """Add a new expense entry."""
        response = await self.call_tool("add_expense", {
            "amount": amount,
            "description": description,
            "category": category,
            "date": date,
            "store": store,
            "payment_method": payment_method
        })
        return response.result if response.success else {"error": response.error}

    async def get_expenses_by_category(self, category: Optional[str] = None, date_from: Optional[str] = None, date_to: Optional[str] = None, group_by: str = "month") -> Dict[str, Any]:
        """Get expenses grouped by category."""
        response = await self.call_tool("get_expenses_by_category", {
            "category": category,
            "date_from": date_from,
            "date_to": date_to,
            "group_by": group_by
        })
        return response.result if response.success else {"error": response.error}

    async def analyze_spending_patterns(self, period: str = "month", focus: str = "trends") -> Dict[str, Any]:
        """AI-powered spending pattern analysis."""
        response = await self.call_tool("analyze_spending_patterns", {
            "period": period,
            "focus": focus
        })
        return response.result if response.success else {"error": response.error}

    # =========================================================================
    # MEDIA MANAGER TOOLS
    # =========================================================================

    async def search_plex_library(self, query: str, media_type: str = "all", limit: int = 10) -> List[Dict[str, Any]]:
        """Search Plex media library."""
        response = await self.call_tool("search_plex_library", {
            "query": query,
            "media_type": media_type,
            "limit": limit
        })
        return response.result if response.success else []

    async def get_currently_watching(self, user_id: Optional[str] = None, limit: int = 5) -> List[Dict[str, Any]]:
        """Get currently watching/reading items."""
        response = await self.call_tool("get_currently_watching", {
            "user_id": user_id,
            "limit": limit
        })
        return response.result if response.success else []

    async def get_recently_added(self, media_type: str = "all", days: int = 7, limit: int = 20) -> List[Dict[str, Any]]:
        """Get recently added media items."""
        response = await self.call_tool("get_recently_added", {
            "media_type": media_type,
            "days": days,
            "limit": limit
        })
        return response.result if response.success else []

    # =========================================================================
    # PLANNING MANAGER TOOLS
    # =========================================================================

    async def create_todo(self, title: str, description: Optional[str] = None, category: str = "General", priority: str = "medium", due_date: Optional[str] = None, estimated_time: Optional[str] = None) -> Dict[str, Any]:
        """Create a new todo item."""
        response = await self.call_tool("create_todo", {
            "title": title,
            "description": description,
            "category": category,
            "priority": priority,
            "due_date": due_date,
            "estimated_time": estimated_time
        })
        return response.result if response.success else {"error": response.error}

    async def get_todos_by_category(self, category: Optional[str] = None, status: str = "all", priority: Optional[str] = None, limit: int = 20) -> List[Dict[str, Any]]:
        """Get todos filtered by category and criteria."""
        response = await self.call_tool("get_todos_by_category", {
            "category": category,
            "status": status,
            "priority": priority,
            "limit": limit
        })
        return response.result if response.success else []

    async def get_productivity_stats(self, period: str = "week", include_goals: bool = True) -> Dict[str, Any]:
        """Get productivity statistics and insights."""
        response = await self.call_tool("get_productivity_stats", {
            "period": period,
            "include_goals": include_goals
        })
        return response.result if response.success else {"error": response.error}

    async def get_motivational_quote(self, category: str = "productivity", language: str = "en") -> Dict[str, Any]:
        """Get a motivational quote."""
        response = await self.call_tool("get_motivational_quote", {
            "category": category,
            "language": language
        })
        return response.result if response.success else {"error": response.error}

# =============================================================================
# CONVENIENCE FUNCTIONS
# =============================================================================

async def get_mcp_client() -> ViennaLiveMCPClient:
    """
    Get a configured MCP client instance.

    This function can be enhanced to read configuration from environment
    variables or app settings.
    """
    # TODO: Read from app configuration
    base_url = "http://localhost:8000"  # Default for development

    return ViennaLiveMCPClient(base_url=base_url)

# =============================================================================
# DEMONSTRATION FUNCTIONS
# =============================================================================

async def demonstrate_mcp_integration():
    """
    Demonstrate MCP integration capabilities.

    This function shows how the web app can leverage MCP tools
    for enhanced functionality.
    """
    async with ViennaLiveMCPClient() as client:
        print("🔍 Demonstrating Vienna Live MCP Integration")
        print("=" * 50)

        # Get server status
        print("\n📊 Server Status:")
        status = await client.get_server_status()
        print(f"  - Tools: {status.get('tools_count', 'N/A')}")
        print(f"  - Portmanteaus: {len(status.get('portmanteaus', []))}")

        # Get portmanteau info
        print("\n🛍️ Shopping Manager Info:")
        shopping_info = await client.get_portmanteau_info("shopping_manager")
        print(f"  - Tools: {shopping_info.get('tools_count', 'N/A')}")
        print(f"  - Categories: {', '.join(shopping_info.get('categories', []))}")

        # Demonstrate tool usage
        print("\n🛒 Shopping Recommendations:")
        recommendations = await client.get_shopping_recommendations()
        for i, rec in enumerate(recommendations[:3], 1):
            print(f"  {i}. {rec.get('item', 'N/A')} - {rec.get('reason', 'N/A')}")

        print("\n🚊 Next Tram Departures:")
        departures = await client.get_next_tram("Stephansplatz")
        for dep in departures[:2]:
            print(f"  Line {dep.get('line', 'N/A')} to {dep.get('direction', 'N/A')}: {dep.get('departure_time', 'N/A')}")

        print("\n✅ MCP Integration Demonstration Complete!")

if __name__ == "__main__":
    # Run demonstration
    import asyncio
    asyncio.run(demonstrate_mcp_integration())
