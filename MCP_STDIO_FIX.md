# MCP STDIO Transport Fix

**Date**: 2025-12-03  
**Issue**: Originally implemented HTTP-based MCP client (incorrect)  
**Fix**: Implemented proper stdio transport (correct!)

## What Changed

### ❌ Wrong Approach (Original)

```python
# INCORRECT - MCP servers don't work this way!
async with httpx.AsyncClient() as client:
    response = await client.post("http://goliath:3055/mcp/call", ...)
```

**Problems**:
- MCP servers use stdio transport, not HTTP
- Can't just make HTTP requests to "ports"
- Requires MCP servers to be running as standalone HTTP services
- Not the MCP protocol standard

### ✅ Correct Approach (Fixed)

```python
# CORRECT - MCP stdio transport pattern (from mcp-studio)
from fastmcp import Client
from fastmcp.client.transports import StdioTransport

# Spawn MCP server process
transport = StdioTransport(
    command="python",
    args=["D:/Dev/repos/plex-mcp/src/plex_mcp/server.py"],
    env=os.environ.copy()
)

# Create client
client = Client(transport)

# Use client
async with client:
    await client.initialize()
    result = await client.call_tool("tool_name", **params)
```

**Benefits**:
- Follows MCP protocol standard
- Spawns MCP server processes automatically
- Proper stdio communication via JSON-RPC
- Same pattern as Claude Desktop, MCP Studio, etc.

## Files Updated

### `backend/services/mcp_clients.py`

**Before**:
- `MCPClientBase` used `httpx.AsyncClient`
- Connected to HTTP URLs like `http://goliath:3055`
- Made POST requests to `/mcp/call`

**After**:
- `MCPClientBase` uses `fastmcp.Client` + `StdioTransport`
- Takes server paths like `D:/Dev/repos/plex-mcp/src/plex_mcp/server.py`
- Spawns processes and communicates via stdio

### Individual Client Classes

**Plex**:
```python
# Before
base_url = os.getenv("PLEX_MCP_URL", "http://goliath:3055")

# After
server_path = os.getenv("PLEX_MCP_PATH", "D:/Dev/repos/plex-mcp/src/plex_mcp/server.py")
```

**Calibre, Immich, Tapo, Ollama** - Same pattern

### Configuration

**Before** (`.env`):
```bash
PLEX_MCP_URL=http://goliath:3055
CALIBRE_MCP_URL=http://goliath:3054
```

**After** (`.env`):
```bash
PLEX_MCP_PATH=D:/Dev/repos/plex-mcp/src/plex_mcp/server.py
CALIBRE_MCP_PATH=D:/Dev/repos/calibre-mcp/src/calibre_mcp/server.py
```

## How Stdio Transport Works

```
┌──────────────────────────────────────────────────────────┐
│  Vienna Life Assistant (MCP Client)                      │
│                                                          │
│  1. Create StdioTransport with server path               │
│  2. StdioTransport spawns: python server.py             │
│  3. Connects to spawned process via stdin/stdout        │
│  4. Sends JSON-RPC messages over stdio                  │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │  FastMCP Client                                 │    │
│  │    │                                           │    │
│  │    ├─ initialize()                             │    │
│  │    ├─ list_tools()                             │    │
│  │    └─ call_tool(name, **params)               │    │
│  └────────────────────────────────────────────────┘    │
│                   │                                      │
│                   │ JSON-RPC via stdio                   │
│                   ▼                                      │
│  ┌────────────────────────────────────────────────┐    │
│  │  Spawned MCP Server Process                    │    │
│  │  (plex-mcp, calibre-mcp, etc.)                │    │
│  │    - Reads from stdin                          │    │
│  │    - Writes to stdout                          │    │
│  │    - Returns tool results                      │    │
│  └────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────┘
```

## Reference: MCP Studio Pattern

From `mcp-studio/src/mcp_studio/app/core/stdio.py`:

```python
# Create STDIO transport
self.transport = StdioTransport(
    command="python",
    args=[str(server_path)],
    env=env,
    cwd=str(server_path.parent)
)

# Create FastMCP client
self.client = Client(self.transport)

# Test connection
async with self.client:
    await self.client.initialize()
    tools = await self.client.list_tools()
```

This is the **gold standard** pattern from MCP Studio.

## Configuration Update Required

Update your `backend/.env`:

```bash
# Replace URLs with PATHS
PLEX_MCP_PATH=D:/Dev/repos/plex-mcp/src/plex_mcp/server.py
CALIBRE_MCP_PATH=D:/Dev/repos/calibre-mcp/src/calibre_mcp/server.py
IMMICH_MCP_PATH=D:/Dev/repos/immich-mcp/src/immich_mcp/server.py
TAPO_MCP_PATH=D:/Dev/repos/tapo-camera-mcp/src/tapo_camera_mcp/server.py
OLLAMA_MCP_PATH=D:/Dev/repos/local-llm-mcp/src/local_llm_mcp/server.py
```

**Important**: Paths must point to the actual MCP server main script!

## Testing

```python
# Test stdio connection
from services.mcp_clients import mcp_clients

# This will:
# 1. Spawn plex-mcp server process
# 2. Connect via stdio
# 3. Initialize connection
# 4. Call tool
result = await mcp_clients.plex.get_continue_watching()
```

## Benefits of Stdio Transport

✅ **Standard MCP Protocol** - Matches Claude Desktop, MCP Studio  
✅ **Automatic Process Management** - FastMCP spawns/manages processes  
✅ **No HTTP Overhead** - Direct stdio communication  
✅ **Proper JSON-RPC** - Standard MCP message format  
✅ **Error Handling** - Built-in timeout, reconnection logic  
✅ **Resource Isolation** - Each MCP server runs in its own process

## Docker Considerations

**Challenge**: Docker containers can't easily spawn processes on host

**Solutions**:

1. **Run MCP servers in separate containers**:
   ```yaml
   services:
     plex-mcp:
       build: ../plex-mcp
       volumes:
         - ./backend:/app
   ```

2. **Mount repos and run on host**:
   ```yaml
   volumes:
     - D:/Dev/repos:/repos:ro
   ```

3. **Use host network mode** (Windows):
   ```yaml
   network_mode: "host"
   ```

## Conclusion

The stdio transport fix aligns Vienna Life Assistant with **proper MCP standards** used by:
- Claude Desktop
- MCP Studio  
- All official Anthropic examples

This is the correct way to consume MCP servers! 🎉

