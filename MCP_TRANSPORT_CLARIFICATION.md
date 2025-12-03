# MCP Transport Methods - Clarification

**Date**: 2025-12-03  
**Context**: Vienna Life Assistant MCP integration

## MCP Transport Standards

The Anthropic MCP protocol supports **multiple transport methods**:

### 1. ✅ Stdio Transport (What We're Using)
```python
transport = StdioTransport(
    command="python",
    args=["server.py"]
)
```

**Use Cases**:
- Local process spawning
- Claude Desktop integration
- MCP Studio pattern
- Single-machine setups

**Pros**: Direct, no network overhead, automatic process management  
**Cons**: Local only, can't cross machine boundaries

### 2. ✅ HTTP/HTTPS Transport (Also Valid!)
```python
async with httpx.AsyncClient() as client:
    response = await client.post(
        "https://goliath:3055/mcp/v1/call",
        json={"tool": "tool_name", "params": {...}}
    )
```

**Use Cases**:
- **Remote connections** - Access MCP servers on other machines
- **Easy testing** - Use curl/Postman to test tools
- **Non-MCP clients** - Apps that can't spawn processes
- **Kubernetes/cloud** - Containerized services
- **Cross-platform** - Windows app → Linux server

**Pros**: Network-accessible, language-agnostic, testable  
**Cons**: Network overhead, need to manage server lifecycle

### 3. ✅ SSE Transport (Server-Sent Events)
For streaming responses and long-running operations.

## Current Vienna Life Assistant Setup

**We're using stdio** because existing MCP servers in `D:\Dev\repos` are **stdio-only**:
- `plex-mcp` - stdio only
- `calibre-mcp` - stdio only
- `immich-mcp` - stdio only
- `tapo-camera-mcp` - stdio only

**This is fine for now!** It works perfectly for local integration.

## Future Enhancement: Dual Interface MCP Servers

**Project**: Make all MCP servers in dev repos support BOTH stdio AND HTTP/HTTPS

### Benefits of Dual Interface

1. **Local Use** - Stdio for Vienna Life Assistant, Claude Desktop
2. **Remote Use** - HTTPS for accessing from other machines
3. **Testing** - HTTP endpoints for curl/Postman testing
4. **Flexibility** - Apps can choose transport method

### Implementation Pattern

```python
from fastmcp import FastMCP

mcp = FastMCP("my-server")

# ... define tools ...

if __name__ == "__main__":
    import sys
    
    # Check how server was invoked
    if "--http" in sys.argv:
        # Run as HTTP server
        import uvicorn
        uvicorn.run(mcp.get_app(), host="0.0.0.0", port=3055)
    else:
        # Run as stdio server (default)
        mcp.run(transport="stdio")
```

**Usage**:
```bash
# Stdio mode (for MCP clients)
python server.py

# HTTP mode (for remote/testing)
python server.py --http
```

### Dual Interface Example

```python
# server.py
from fastmcp import FastMCP
from fastapi import FastAPI
import uvicorn

mcp = FastMCP("dual-interface-server")

@mcp.tool()
def example_tool(param: str) -> dict:
    """Example tool"""
    return {"result": f"Processed: {param}"}

# Create FastAPI app for HTTP mode
app = FastAPI()

@app.post("/mcp/v1/tools/list")
async def list_tools():
    """HTTP endpoint to list tools"""
    tools = mcp.list_tools()
    return {"tools": tools}

@app.post("/mcp/v1/tools/call")
async def call_tool(request: dict):
    """HTTP endpoint to call tools"""
    tool_name = request["tool"]
    params = request.get("params", {})
    result = await mcp.call_tool(tool_name, **params)
    return {"result": result}

if __name__ == "__main__":
    import sys
    
    if "--http" in sys.argv:
        print("Starting in HTTP mode on port 3055...")
        uvicorn.run(app, host="0.0.0.0", port=3055)
    else:
        print("Starting in stdio mode...")
        mcp.run(transport="stdio")
```

## Vienna Life Assistant Transport Strategy

### Current Implementation (Correct!)

**Using stdio** because it's what the servers support:

```python
# backend/services/mcp_clients.py
transport = StdioTransport(
    command="python",
    args=["D:/Dev/repos/plex-mcp/src/plex_mcp/server.py"]
)
client = Client(transport)
```

### Future Enhancement (When Servers Get HTTP Support)

**Add HTTP fallback option**:

```python
class MCPClientBase:
    def __init__(self, server_path: str, http_url: Optional[str] = None):
        self.server_path = server_path
        self.http_url = http_url
        self.prefer_http = bool(http_url and os.getenv("MCP_PREFER_HTTP"))
    
    async def connect(self):
        if self.prefer_http and self.http_url:
            # Use HTTP transport (for remote servers)
            return await self._connect_http()
        else:
            # Use stdio transport (for local servers)
            return await self._connect_stdio()
```

**Configuration**:
```bash
# Stdio mode (current)
PLEX_MCP_PATH=D:/Dev/repos/plex-mcp/src/plex_mcp/server.py

# HTTP mode (future)
PLEX_MCP_URL=http://goliath:3055
MCP_PREFER_HTTP=true
```

## Project Plan: Dual Interface MCP Servers

**Target**: January 2025  
**Scope**: Update all MCP servers in `D:\Dev\repos`

### Servers to Update

1. ✅ `plex-mcp` - Add HTTP interface
2. ✅ `calibre-mcp` - Add HTTP interface
3. ✅ `immich-mcp` - Add HTTP interface
4. ✅ `tapo-camera-mcp` - Add HTTP interface
5. ✅ `local-llm-mcp` - Add HTTP interface
6. ✅ All other MCP servers...

### Implementation Checklist

- [ ] Create dual interface template in `mcp-central-docs`
- [ ] Add HTTP transport pattern to MCP standards
- [ ] Update each MCP server with dual interface
- [ ] Add `--http` flag to all servers
- [ ] Document HTTP API endpoints
- [ ] Add HTTP tests
- [ ] Update Vienna Life Assistant to support both transports

### Benefits for Vienna Life Assistant

Once dual interface is implemented:

1. **Local testing** - Use HTTP mode for quick testing
2. **Remote access** - Access MCP servers from other machines
3. **Flexibility** - Switch between stdio and HTTP as needed
4. **Docker friendly** - HTTP works better in containerized environments

## Conclusion

**Current Status**: Using stdio (correct for current servers)  
**Future Enhancement**: Dual interface (stdio + HTTP) for all MCP servers  
**Timeline**: January 2025 project  

Both transports are valid per Anthropic standards - we're using the one that matches the current server implementations.

---

**References**:
- [MCP Specification](https://spec.modelcontextprotocol.io/) - Supports multiple transports
- [FastMCP Docs](https://github.com/jlowin/fastmcp) - Stdio and HTTP examples
- MCP Central Docs - Standards for both transport methods

