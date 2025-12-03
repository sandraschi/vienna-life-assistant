# ✅ STDIO Transport Fix Complete!

**Date**: 2025-12-03  
**Issue Reported**: MCP servers use stdio, not standalone HTTP  
**Status**: FIXED! Implemented proper stdio transport pattern

## Summary

Originally implemented HTTP-based MCP client (wrong). Now fixed to use **stdio transport** - the correct MCP protocol standard used by Claude Desktop, MCP Studio, and all official examples.

## What Changed

### Before (Wrong)
```python
# ❌ INCORRECT - HTTP-based approach
base_url = "http://goliath:3055"
response = await httpx.post(f"{base_url}/mcp/call", json={...})
```

### After (Correct)
```python
# ✅ CORRECT - Stdio transport approach
from fastmcp import Client
from fastmcp.client.transports import StdioTransport

transport = StdioTransport(
    command="python",
    args=["D:/Dev/repos/plex-mcp/src/plex_mcp/server.py"],
    env=os.environ.copy()
)

client = Client(transport)
async with client:
    await client.initialize()
    result = await client.call_tool("tool_name", **params)
```

## Files Updated

1. **`backend/services/mcp_clients.py`** - Complete rewrite using stdio
2. **`docker-compose.yml`** - Changed URLs to paths, mounted repos volume
3. **`backend/env.example.fixed`** - Updated configuration examples
4. **`MCP_STDIO_FIX.md`** - Detailed explanation of the fix
5. **`STDIO_TRANSPORT_COMPLETE.md`** - This summary

## Configuration Required

Update `backend/.env`:

```bash
# Replace old URL-based config:
# PLEX_MCP_URL=http://goliath:3055  ❌

# With path-based config:
PLEX_MCP_PATH=D:/Dev/repos/plex-mcp/src/plex_mcp/server.py  ✅
CALIBRE_MCP_PATH=D:/Dev/repos/calibre-mcp/src/calibre_mcp/server.py
IMMICH_MCP_PATH=D:/Dev/repos/immich-mcp/src/immich_mcp/server.py
TAPO_MCP_PATH=D:/Dev/repos/tapo-camera-mcp/src/tapo_camera_mcp/server.py
OLLAMA_MCP_PATH=D:/Dev/repos/local-llm-mcp/src/local_llm_mcp/server.py
```

## How It Works

```
Vienna Life Assistant
      │
      ├─ MCPClientBase
      │    ├─ Creates StdioTransport(command="python", args=[server_path])
      │    ├─ StdioTransport spawns: python server.py
      │    └─ Connects via stdin/stdout (JSON-RPC)
      │
      ├─ PlexMCPClient
      │    └─ Spawns D:/Dev/repos/plex-mcp/src/plex_mcp/server.py
      │
      ├─ CalibreMCPClient
      │    └─ Spawns D:/Dev/repos/calibre-mcp/src/calibre_mcp/server.py
      │
      └─ ... (Immich, Tapo, Ollama)
```

## Docker Configuration

```yaml
# docker-compose.yml
services:
  backend:
    volumes:
      - ./backend:/app
      - D:/Dev/repos:/repos:ro  # ← Mount repos for MCP server access
    environment:
      PLEX_MCP_PATH: /repos/plex-mcp/src/plex_mcp/server.py
      CALIBRE_MCP_PATH: /repos/calibre-mcp/src/calibre_mcp/server.py
      # ...
```

Container can now spawn MCP server processes from mounted repos!

## Testing

### 1. Check MCP Server Paths

```powershell
# Verify MCP servers exist
ls D:\Dev\repos\plex-mcp\src\plex_mcp\server.py
ls D:\Dev\repos\calibre-mcp\src\calibre_mcp\server.py
```

### 2. Test Stdio Connection

```python
from services.mcp_clients import mcp_clients

# This will:
# 1. Spawn plex-mcp via stdio
# 2. Initialize connection
# 3. Call tool
result = await mcp_clients.plex.get_continue_watching()
```

### 3. Check Backend Logs

```powershell
docker compose logs backend
# Should see: "Plex MCP: Connected via stdio (X tools available)"
```

## Reference Implementation

Pattern copied from **MCP Studio** (`mcp-studio/src/mcp_studio/app/core/stdio.py`):

```python
# Gold standard stdio transport pattern
self.transport = StdioTransport(
    command="python",
    args=[str(server_path)],
    env=env,
    cwd=str(server_path.parent)
)

self.client = Client(self.transport)

async with self.client:
    await self.client.initialize()
    tools = await self.client.list_tools()
    result = await self.client.call_tool(tool_name, **parameters)
```

## Benefits

✅ **MCP Standard** - Matches Claude Desktop, MCP Studio  
✅ **No HTTP** - Proper stdio/JSON-RPC communication  
✅ **Process Management** - FastMCP handles spawning/cleanup  
✅ **Automatic Initialization** - Connection setup built-in  
✅ **Error Handling** - Timeout, reconnection logic included  

## Next Steps

1. Create `backend/.env` from `env.example.fixed`
2. Configure MCP server paths (must point to actual files!)
3. Ensure MCP servers are FastMCP 2.13+ compatible
4. Rebuild Docker containers: `docker compose build`
5. Test: Go to Media & Home tab

## Acknowledgment

**Thanks for catching this!** The original HTTP approach was fundamentally wrong. Now properly implemented using stdio transport per MCP protocol standards.

---

**STATUS**: ✅ STDIO Transport Implemented Correctly  
**REFERENCE**: MCP Studio pattern  
**COMPLIANCE**: FastMCP 2.13+, MCP Protocol Standard

