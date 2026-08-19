"""PyInstaller entry point — dual transport for ViLife.

Detects MCP_PORT (or PORT) env var and starts uvicorn in HTTP mode.
When MCP_PORT is not set, runs the FastMCP server in stdio mode.
"""

import asyncio
import os
import sys

import uvicorn

# Source lives in web_sota/ — add to path
_here = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(_here, "web_sota"))

from vienna_life_assistant.server import app  # noqa: E402

port = os.environ.get("MCP_PORT") or os.environ.get("PORT")
if port:
    host = os.environ.get("MCP_HOST", "127.0.0.1")
    uvicorn.run(app, host=host, port=int(port), log_level="info")
else:
    from vienna_life_assistant.vienna_life_mcp import mcp

    asyncio.run(mcp.run_stdio_async(show_banner=False))
