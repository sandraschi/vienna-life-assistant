"""
MCP Integration API Routes

API endpoints for integrating with the vienna-live-mcp server.
These endpoints allow the web app to leverage MCP tools for enhanced functionality.
"""

import logging
from typing import Dict, Any, List
from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel, Field

from services.vienna_live_mcp_client import get_mcp_client, ViennaLiveMCPClient

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/mcp", tags=["mcp-integration"])

# =============================================================================
# REQUEST/RESPONSE MODELS
# =============================================================================

class MCPToolCallRequest(BaseModel):
    """Request model for MCP tool calls."""
    tool_name: str = Field(..., description="Name of the MCP tool to call")
    parameters: Dict[str, Any] = Field(default_factory=dict, description="Tool parameters")

class MCPToolCallResponse(BaseModel):
    """Response model for MCP tool calls."""
    success: bool
    result: Any = None
    error: str = None
    execution_time: float = None

class ServerStatusResponse(BaseModel):
    """Response model for server status."""
    server: Dict[str, Any]
    database: Dict[str, Any]
    services: Dict[str, Any]
    portmanteaus: List[str]
    tools_count: int
    last_updated: str

# =============================================================================
# MCP INTEGRATION ENDPOINTS
# =============================================================================

@router.get("/status", response_model=ServerStatusResponse)
async def get_mcp_server_status():
    """
    Get comprehensive status from the vienna-live-mcp server.

    Returns server health, database status, available portmanteaus, and tool counts.
    """
    try:
        async with await get_mcp_client() as client:
            status = await client.get_server_status()

            if "error" in status:
                raise HTTPException(status_code=503, detail=f"MCP server error: {status['error']}")

            return ServerStatusResponse(**status)

    except Exception as e:
        logger.error(f"Failed to get MCP server status: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to connect to MCP server: {str(e)}")

@router.post("/tools/call", response_model=MCPToolCallResponse)
async def call_mcp_tool(request: MCPToolCallRequest):
    """
    Call an MCP tool with the provided parameters.

    This endpoint allows the web app to execute any tool from the vienna-live-mcp server.
    """
    try:
        async with await get_mcp_client() as client:
            response = await client.call_tool(request.tool_name, request.parameters)

            return MCPToolCallResponse(
                success=response.success,
                result=response.result,
                error=response.error,
                execution_time=response.execution_time
            )

    except Exception as e:
        logger.error(f"Failed to call MCP tool {request.tool_name}: {e}")
        raise HTTPException(status_code=500, detail=f"MCP tool call failed: {str(e)}")

# =============================================================================
# CONVENIENCE ENDPOINTS FOR COMMON OPERATIONS
# =============================================================================

@router.get("/shopping/recommendations")
async def get_shopping_recommendations(based_on: str = "recent_purchases", limit: int = 5):
    """Get AI-powered shopping recommendations."""
    try:
        async with await get_mcp_client() as client:
            recommendations = await client.get_shopping_recommendations(based_on, limit)
            return {"recommendations": recommendations}

    except Exception as e:
        logger.error(f"Failed to get shopping recommendations: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/travel/departures/{station_name}")
async def get_next_departures(station_name: str, line: str = None, direction: str = None, limit: int = 3):
    """Get next tram/bus/metro departures from a station."""
    try:
        async with await get_mcp_client() as client:
            departures = await client.get_next_tram(station_name, line, direction, limit)
            return {"departures": departures}

    except Exception as e:
        logger.error(f"Failed to get departures for {station_name}: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/travel/trip-plan")
async def plan_day_trip(
    destination: str,
    departure_time: str = None,
    return_time: str = None,
    budget: float = None
):
    """Plan a complete day trip itinerary."""
    try:
        async with await get_mcp_client() as client:
            trip_plan = await client.plan_day_trip(destination, departure_time, return_time, budget)
            return trip_plan

    except Exception as e:
        logger.error(f"Failed to plan trip to {destination}: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/expenses/analysis")
async def analyze_expenses(period: str = "month", focus: str = "trends"):
    """Get AI-powered expense analysis."""
    try:
        async with await get_mcp_client() as client:
            analysis = await client.analyze_spending_patterns(period, focus)
            return analysis

    except Exception as e:
        logger.error(f"Failed to analyze expenses: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/media/currently-watching")
async def get_currently_watching(user_id: str = None, limit: int = 5):
    """Get currently watching/reading items across all media services."""
    try:
        async with await get_mcp_client() as client:
            items = await client.get_currently_watching(user_id, limit)
            return {"currently_watching": items}

    except Exception as e:
        logger.error(f"Failed to get currently watching items: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/productivity/stats")
async def get_productivity_stats(period: str = "week", include_goals: bool = True):
    """Get comprehensive productivity statistics."""
    try:
        async with await get_mcp_client() as client:
            stats = await client.get_productivity_stats(period, include_goals)
            return stats

    except Exception as e:
        logger.error(f"Failed to get productivity stats: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/motivation/quote")
async def get_motivational_quote(category: str = "productivity", language: str = "en"):
    """Get a motivational quote."""
    try:
        async with await get_mcp_client() as client:
            quote = await client.get_motivational_quote(category, language)
            return quote

    except Exception as e:
        logger.error(f"Failed to get motivational quote: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# =============================================================================
# BATCH OPERATIONS
# =============================================================================

@router.post("/batch/tools")
async def call_multiple_tools(requests: List[MCPToolCallRequest], background_tasks: BackgroundTasks):
    """
    Execute multiple MCP tool calls in batch.

    Useful for complex operations that require multiple tool calls.
    Results are returned as they complete.
    """
    try:
        async def execute_batch():
            results = []
            async with await get_mcp_client() as client:
                for req in requests:
                    try:
                        response = await client.call_tool(req.tool_name, req.parameters)
                        results.append({
                            "tool_name": req.tool_name,
                            "success": response.success,
                            "result": response.result,
                            "error": response.error,
                            "execution_time": response.execution_time
                        })
                    except Exception as e:
                        results.append({
                            "tool_name": req.tool_name,
                            "success": False,
                            "error": str(e),
                            "execution_time": None
                        })

            # TODO: Store batch results in database for retrieval
            logger.info(f"Completed batch execution of {len(requests)} MCP tools")

        # Execute in background for large batches
        if len(requests) > 5:
            background_tasks.add_task(execute_batch)
            return {"status": "accepted", "message": f"Batch execution of {len(requests)} tools started in background"}
        else:
            # Execute synchronously for small batches
            await execute_batch()
            return {"status": "completed", "message": f"Batch execution of {len(requests)} tools completed"}

    except Exception as e:
        logger.error(f"Failed to execute batch tools: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# =============================================================================
# HEALTH CHECK ENDPOINT
# =============================================================================

@router.get("/health")
async def mcp_integration_health():
    """
    Health check for MCP integration.

    Verifies connectivity to vienna-live-mcp server and basic functionality.
    """
    try:
        async with await get_mcp_client() as client:
            # Quick health check by getting server status
            status = await client.get_server_status()

            if "error" in status:
                return {
                    "status": "unhealthy",
                    "mcp_server": "disconnected",
                    "error": status["error"]
                }

            return {
                "status": "healthy",
                "mcp_server": "connected",
                "tools_available": status.get("tools_count", 0),
                "portmanteaus": len(status.get("portmanteaus", []))
            }

    except Exception as e:
        logger.error(f"MCP integration health check failed: {e}")
        return {
            "status": "unhealthy",
            "mcp_server": "error",
            "error": str(e)
        }
