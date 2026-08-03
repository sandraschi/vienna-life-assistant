"""Fleet MCP orchestration — call any fleet MCP server over HTTP, ednaficator-style.

The agent loop gets two extra tools: fleet_tools(server) to discover a remote
server's tool surface, and fleet_call(server, tool, arguments) to invoke it.
Servers are addressable via the fleet port registry; an allowlist (FLEET_MCP_ALLOWLIST,
mirroring ednaficator's EDNA_MCP_ALLOWLIST) keeps the surface safe. Every failure
is graceful — an offline server returns an error string the LLM can act on.
"""

from __future__ import annotations

import json
import logging
import os
import time
from typing import Any

import httpx

logger = logging.getLogger("vienna-life-assistant.fleet")

# name -> (host, mcp path) — ports from mcp-central-docs/operations/WEBAPP_PORTS.md
FLEET_SERVERS: dict[str, dict[str, Any]] = {
    "plex-mcp": {
        "port": 10740,
        "path": "/mcp",
        "purpose": "Plex media library: search movies/shows, playback, libraries",
    },
    "calibre-mcp": {
        "port": 10720,
        "path": "/mcp",
        "purpose": "Calibre ebook library: search books, metadata, reading progress",
    },
    "gtfs-mcp": {
        "port": 10913,
        "path": "/mcp",
        "purpose": "Wiener Linien public transit: live departures, stops, routes",
    },
    "aiwatcher-mcp": {
        "port": 10946,
        "path": "/mcp",
        "purpose": "Fleet news engine: top stories, search items, tag trends, bundles, feeds",
    },
    "benny-the-dog-mcp": {
        "port": 11142,
        "path": "/mcp",
        "purpose": "Benny the dog care plane: water/bark/movement/sausage/movie/wake events, care log",
    },
    "devices-mcp": {
        "port": 10717,
        "path": "/mcp",
        "purpose": "USB cameras + Fritz!Box home network probe (internet status, WAN health)",
    },
}

DEFAULT_ALLOWLIST = ",".join(FLEET_SERVERS)


def allowed_servers() -> dict[str, dict[str, Any]]:
    raw = os.environ.get("FLEET_MCP_ALLOWLIST", DEFAULT_ALLOWLIST)
    names = {n.strip() for n in raw.split(",") if n.strip()}
    return {n: cfg for n, cfg in FLEET_SERVERS.items() if n in names}


# --- MCP streamable HTTP transport --------------------------------------------

_SESSIONS: dict[str, str] = {}  # server -> mcp-session-id
_TOOL_CACHE: dict[str, tuple[float, list[dict[str, Any]]]] = {}


def _base(server: str) -> str | None:
    cfg = FLEET_SERVERS.get(server)
    return f"http://127.0.0.1:{cfg['port']}{cfg['path']}" if cfg else None


def _rpc(
    server: str, payload: dict[str, Any], timeout: float = 15.0
) -> dict[str, Any] | None:
    """POST a JSON-RPC request to a fleet server, handling SSE + sessions."""
    url = _base(server)
    if url is None:
        return None
    headers = {
        "Content-Type": "application/json",
        "Accept": "application/json, text/event-stream",
    }
    if sid := _SESSIONS.get(server):
        headers["mcp-session-id"] = sid

    try:
        with httpx.Client(follow_redirects=True, timeout=timeout) as client:
            resp = client.post(url, headers=headers, json=payload)
            if resp.status_code >= 400:
                logger.warning(
                    "fleet %s %s failed: HTTP %s",
                    server,
                    payload.get("method"),
                    resp.status_code,
                )
                return None
            if sid := resp.headers.get("mcp-session-id"):
                _SESSIONS[server] = sid
            body = resp.text
    except Exception as e:  # noqa: BLE001 — offline servers must not crash the agent
        logger.warning("fleet %s unreachable: %s", server, e)
        return None

    return _parse_sse(body)


def _parse_sse(body: str) -> dict[str, Any] | None:
    """Extract the last data: JSON line from an SSE stream (or plain JSON)."""
    text = body.strip()
    if not text.startswith("event") and not text.startswith("data"):
        try:
            return json.loads(text)
        except json.JSONDecodeError:
            return None
    result = None
    for line in text.splitlines():
        line = line.strip()
        if line.startswith("data:"):
            data = line[5:].strip()
            if data:
                try:
                    result = json.loads(data)
                except json.JSONDecodeError:
                    continue
    return result


def _init(server: str) -> bool:
    result = _rpc(
        server,
        {
            "jsonrpc": "2.0",
            "id": 1,
            "method": "initialize",
            "params": {
                "protocolVersion": "2025-11-25",
                "capabilities": {},
                "clientInfo": {"name": "vilife-fleet", "version": "0.2.0"},
            },
        },
    )
    if result is None:
        return False
    _rpc(
        server, {"jsonrpc": "2.0", "method": "notifications/initialized", "params": {}}
    )
    return True


# --- Public surface -----------------------------------------------------------


def list_tools(server: str, force: bool = False) -> list[dict[str, Any]]:
    """Remote tools/list with a short cache. Empty when the server is offline."""
    if server not in allowed_servers():
        return []
    cached = _TOOL_CACHE.get(server)
    if cached and not force and time.time() - cached[0] < 300:
        return cached[1]
    if not _init(server):
        return []
    result = _rpc(
        server, {"jsonrpc": "2.0", "id": 2, "method": "tools/list", "params": {}}
    )
    tools = []
    if result and "result" in result:
        tools = result["result"].get("tools", [])
    _TOOL_CACHE[server] = (time.time(), tools)
    return tools


def call_tool(
    server: str, tool: str, arguments: dict[str, Any] | None = None
) -> dict[str, Any]:
    """Invoke a remote tool; structured result so the LLM can reason."""
    if server not in allowed_servers():
        return {
            "success": False,
            "error": f"server '{server}' not in FLEET_MCP_ALLOWLIST",
        }
    if not _init(server):
        return {
            "success": False,
            "error": f"server '{server}' unreachable on {_base(server)}",
        }
    result = _rpc(
        server,
        {
            "jsonrpc": "2.0",
            "id": 3,
            "method": "tools/call",
            "params": {"name": tool, "arguments": arguments or {}},
        },
    )
    if result is None:
        return {"success": False, "error": f"no response from '{server}'"}
    if "error" in result:
        return {"success": False, "error": str(result["error"])}
    content = result.get("result", {}).get("content", [])
    texts = [
        c.get("text", "")
        for c in content
        if isinstance(c, dict) and c.get("type") == "text"
    ]
    return {
        "success": True,
        "server": server,
        "tool": tool,
        "text": "\n".join(texts)[:6000],
    }


def available() -> list[dict[str, Any]]:
    """Allowlisted servers with live tool counts (for the agent's registry)."""
    out = []
    for name, cfg in allowed_servers().items():
        tools = list_tools(name)
        out.append(
            {
                "server": name,
                "tools": len(tools),
                "purpose": cfg["purpose"],
                "online": bool(tools),
            }
        )
    return out


# --- Fritz!Box home network (REST-only: devices-mcp) --------------------------


def fritz_status() -> dict[str, Any]:
    """Fritz!Box probe via devices-mcp REST: internet/WAN health + cameras."""
    base = os.environ.get("DEVICES_MCP_URL", "http://127.0.0.1:10717")
    try:
        with httpx.Client(follow_redirects=True, timeout=8) as client:
            resp = client.get(f"{base}/api/fleet/priority")
            resp.raise_for_status()
            return {
                "success": True,
                "source": "devices-mcp Fritz probe",
                "payload": resp.json(),
            }
    except Exception as e:  # noqa: BLE001
        logger.warning("fritz probe failed: %s", e)
        return {"success": False, "error": f"Fritz probe unreachable on {base}: {e}"}
