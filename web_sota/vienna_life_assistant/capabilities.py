"""Build /api/capabilities from the mounted FastMCP instance."""

from __future__ import annotations

import logging
from datetime import datetime, timezone
from typing import Any

logger = logging.getLogger("vienna-life-assistant.capabilities")


async def build_capabilities(mcp: Any, *, version: str = "0.2.0") -> dict[str, Any]:
    tool_names: list[str] = []
    try:
        tools = await mcp.list_tools(run_middleware=False)
        tool_names = sorted({t.name for t in tools})
    except Exception:
        logger.exception("Failed to list MCP tools")
        tool_names = ["vienna_life"]

    portmanteau_tools = [n for n in tool_names if n == "vienna_life"]
    atomic_tools = [n for n in tool_names if n != "vienna_life"]

    prompt_names: list[str] = []
    try:
        prompts = await mcp.list_prompts()
        prompt_names = sorted({p.name for p in prompts})
    except Exception:
        logger.exception("Failed to list MCP prompts")

    resource_uris: list[str] = []
    skill_uris: list[str] = []
    try:
        resources = await mcp.list_resources()
        for resource in resources:
            raw = getattr(resource, "uri", None) or getattr(resource, "name", "")
            uri = str(raw) if raw else ""
            if not uri:
                continue
            resource_uris.append(uri)
            if uri.startswith("skill://"):
                skill_uris.append(uri)
    except Exception:
        logger.exception("Failed to list MCP resources")

    has_agentic = "vienna_life_agentic" in tool_names

    local_llm = False
    try:
        from vienna_life_assistant.llm_routes import _detect_ollama, _detect_lmstudio

        ollama_ok, _ = _detect_ollama()
        lm_ok, _ = _detect_lmstudio()
        local_llm = ollama_ok or lm_ok
    except Exception:
        logger.exception("Failed to detect local LLM providers")

    return {
        "status": "ok",
        "server": {
            "name": "vienna-life-assistant",
            "version": version,
            "fastmcp": "3.2+",
        },
        "tool_surface": {
            "total": len(tool_names),
            "portmanteau_count": len(portmanteau_tools),
            "atomic_count": len(atomic_tools),
            "portmanteau_tools": portmanteau_tools,
            "atomic_tools": atomic_tools,
        },
        "features": {
            "sampling": has_agentic,
            "agentic_workflows": has_agentic,
            "prompts": len(prompt_names) > 0,
            "resources": len(resource_uris) > 0,
            "skills": len(skill_uris) > 0,
            "local_llm": local_llm,
            "local_llm_autodiscovery": True,
        },
        "inventory": {
            "workflow_tools": ["vienna_life_agentic"] if has_agentic else [],
            "prompt_names": prompt_names,
            "resource_uris": sorted(resource_uris),
            "skill_uris": sorted(skill_uris),
        },
        "runtime": {
            "transport": "http",
            "surface_mode": "portmanteau",
        },
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
