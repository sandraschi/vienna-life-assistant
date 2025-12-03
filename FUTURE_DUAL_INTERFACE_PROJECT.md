# Future Project: Dual Interface MCP Servers

**Target Date**: January 2025  
**Scope**: Add HTTP interface to all stdio-only MCP servers  
**Goal**: Support both stdio (local) and HTTP (remote) transports

## Rationale

Vienna Life Assistant currently uses **stdio transport** to connect to MCP servers. This works great for local integration, but has limitations:

- Can't access MCP servers on remote machines (Goliath)
- Can't easily test with curl/Postman
- Docker containers can't easily spawn host processes
- No cross-platform support (Windows → Linux)

**Solution**: Make all MCP servers **dual interface** - support BOTH stdio AND HTTP.

## MCP Servers to Update

All servers in `D:\Dev\repos\`:

### High Priority (Used by Vienna Life Assistant)
- [ ] `plex-mcp` - 50k+ media items
- [ ] `calibre-mcp` - 15k ebooks
- [ ] `immich-mcp` - Photo management
- [ ] `tapo-camera-mcp` - Home cameras
- [ ] `local-llm-mcp` - Ollama integration

### Medium Priority
- [ ] `docker-mcp` - Docker control
- [ ] `vbox-mcp` - VirtualBox control
- [ ] `virtualization-mcp` - VM management
- [ ] `reaper-mcp` - DAW automation
- [ ] `obs-mcp` - OBS streaming

### Low Priority (Can wait)
- [ ] `notepadpp-mcp`
- [ ] `gimp-mcp`
- [ ] `blender-mcp`
- [ ] `unity3d-mcp`
- [ ] All other MCP servers...

## Implementation Template

### Standard Dual Interface Pattern

```python
"""
Dual Interface MCP Server
Supports both stdio and HTTP transports
"""
from fastmcp import FastMCP
from fastapi import FastAPI, HTTPException
import uvicorn
import sys
from typing import Optional

# Create MCP server
mcp = FastMCP("my-server", version="1.0.0")

# Define tools as normal
@mcp.tool()
def example_tool(param: str) -> dict:
    """Example tool that works in both modes"""
    return {"result": f"Processed: {param}"}

# Create FastAPI app for HTTP mode
app = FastAPI(
    title="My MCP Server (HTTP)",
    version="1.0.0",
    description="Dual interface MCP server"
)

# HTTP endpoints
@app.get("/health")
async def health():
    """Health check endpoint"""
    return {"status": "healthy", "mode": "http"}

@app.post("/mcp/v1/tools/list")
async def list_tools():
    """List available MCP tools"""
    tools = []
    for tool_name, tool_func in mcp._tools.items():
        tools.append({
            "name": tool_name,
            "description": tool_func.__doc__ or "",
            "inputSchema": getattr(tool_func, "input_schema", {})
        })
    return {"tools": tools}

@app.post("/mcp/v1/tools/call")
async def call_tool(request: dict):
    """Call an MCP tool"""
    tool_name = request.get("tool")
    params = request.get("params", {})
    
    if tool_name not in mcp._tools:
        raise HTTPException(404, f"Tool {tool_name} not found")
    
    try:
        result = await mcp._tools[tool_name](**params)
        return {"success": True, "result": result}
    except Exception as e:
        return {"success": False, "error": str(e)}

# Main entry point
if __name__ == "__main__":
    if "--http" in sys.argv:
        # HTTP mode
        port = int(sys.argv[sys.argv.index("--http") + 1]) if len(sys.argv) > sys.argv.index("--http") + 1 else 3000
        print(f"🌐 Starting in HTTP mode on port {port}...")
        uvicorn.run(app, host="0.0.0.0", port=port)
    else:
        # Stdio mode (default)
        print("📡 Starting in stdio mode...")
        mcp.run(transport="stdio")
```

### Usage Examples

```bash
# Stdio mode (for MCP clients like Vienna Life Assistant)
python server.py

# HTTP mode (for remote access, testing)
python server.py --http 3055

# Custom port
python server.py --http 8080
```

### Configuration

```bash
# .env
SERVER_MODE=stdio  # or "http"
HTTP_PORT=3055
```

## Testing Strategy

### Stdio Testing
```bash
# Test with FastMCP client
python -c "
from fastmcp import Client
from fastmcp.client.transports import StdioTransport

transport = StdioTransport(command='python', args=['server.py'])
client = Client(transport)

async def test():
    async with client:
        tools = await client.list_tools()
        print(tools)
"
```

### HTTP Testing
```bash
# Test with curl
python server.py --http 3055

# In another terminal
curl http://localhost:3055/health
curl -X POST http://localhost:3055/mcp/v1/tools/list
curl -X POST http://localhost:3055/mcp/v1/tools/call \
  -H "Content-Type: application/json" \
  -d '{"tool": "example_tool", "params": {"param": "test"}}'
```

## Documentation Updates

For each server, update:

1. **README.md** - Add dual interface documentation
2. **ARCHITECTURE.md** - Explain transport modes
3. **.env.example** - Add HTTP configuration options
4. **docker-compose.yml** - Add HTTP service configuration

### README.md Addition

```markdown
## Transport Modes

This server supports two transport modes:

### Stdio Mode (Default)
For local MCP clients (Claude Desktop, Vienna Life Assistant):
```bash
python server.py
```

### HTTP Mode
For remote access and testing:
```bash
python server.py --http 3055
```

Access via:
- Health: `GET http://localhost:3055/health`
- List tools: `POST http://localhost:3055/mcp/v1/tools/list`
- Call tool: `POST http://localhost:3055/mcp/v1/tools/call`
```

## Vienna Life Assistant Updates

Once servers have HTTP support, update Vienna Life Assistant:

```python
# backend/services/mcp_clients.py
class MCPClientBase:
    def __init__(
        self, 
        server_path: str, 
        server_name: str,
        http_url: Optional[str] = None
    ):
        self.server_path = server_path
        self.server_name = server_name
        self.http_url = http_url
        self.use_http = bool(http_url and os.getenv("MCP_PREFER_HTTP"))
    
    async def connect(self):
        if self.use_http:
            return await self._connect_http()
        else:
            return await self._connect_stdio()
    
    async def _connect_http(self):
        """Connect via HTTP transport"""
        self._http_client = httpx.AsyncClient()
        # Test connection
        response = await self._http_client.get(f"{self.http_url}/health")
        return response.status_code == 200
    
    async def _connect_stdio(self):
        """Connect via stdio transport (existing implementation)"""
        # ... existing stdio code ...
```

**Configuration**:
```bash
# Stdio mode (current)
PLEX_MCP_PATH=D:/Dev/repos/plex-mcp/src/plex_mcp/server.py

# HTTP mode (future)
PLEX_MCP_URL=http://goliath:3055
MCP_PREFER_HTTP=true
```

## Benefits

### For Development
- ✅ **Easy testing** - Use curl/Postman to test tools
- ✅ **Debugging** - HTTP logs easier to read
- ✅ **Language agnostic** - Any language can call HTTP APIs

### For Deployment
- ✅ **Remote access** - Access MCP servers on Goliath from anywhere
- ✅ **Docker friendly** - HTTP works better in containers
- ✅ **Scalability** - Can put load balancer in front
- ✅ **Monitoring** - Standard HTTP monitoring tools work

### For Vienna Life Assistant
- ✅ **Flexibility** - Switch between local and remote modes
- ✅ **Docker support** - HTTP transport works from containers
- ✅ **Testing** - Easy to test without spawning processes
- ✅ **Remote servers** - Can access Goliath servers properly

## Implementation Timeline

### Phase 1: Template & Standards (Week 1)
- Create dual interface template
- Add to mcp-central-docs
- Update MCP standards documentation

### Phase 2: High Priority Servers (Week 2-3)
- plex-mcp
- calibre-mcp
- immich-mcp
- tapo-camera-mcp
- local-llm-mcp

### Phase 3: Medium Priority Servers (Week 4-5)
- docker-mcp
- vbox-mcp
- virtualization-mcp
- reaper-mcp
- obs-mcp

### Phase 4: Vienna Life Assistant Integration (Week 6)
- Update mcp_clients.py with HTTP support
- Add configuration options
- Test both transports
- Update documentation

## Standards Compliance

Following MCP Central Docs standards:

- ✅ FastMCP 2.13+
- ✅ Portmanteau pattern for tools
- ✅ Proper error handling (no uncaught exceptions)
- ✅ Windows/PowerShell compliant
- ✅ Documentation complete
- ✅ Both transport methods supported

## Success Criteria

For each MCP server:

- [ ] Stdio mode works (existing functionality preserved)
- [ ] HTTP mode works (new functionality)
- [ ] Health endpoint responds
- [ ] Tools can be listed via HTTP
- [ ] Tools can be called via HTTP
- [ ] Documentation updated
- [ ] Tests pass for both modes
- [ ] Vienna Life Assistant can use it

---

**Project Lead**: Sandra  
**Target**: January 2025  
**Priority**: Medium (Vienna Life Assistant works with stdio for now)  
**Benefit**: Enables remote MCP access and better Docker integration

