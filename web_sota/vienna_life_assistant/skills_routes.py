"""REST mirror of MCP skills + prompts for the webapp."""

from __future__ import annotations

from typing import Any

from fastapi import APIRouter, HTTPException

router = APIRouter(tags=["skills"])


@router.get("/api/skills")
async def list_skills() -> dict[str, Any]:
    from vienna_life_assistant.vienna_life_mcp import mcp

    skills: list[dict[str, str]] = []
    try:
        resources = await mcp.list_resources()
        for resource in resources:
            raw = getattr(resource, "uri", None) or getattr(resource, "name", "")
            uri = str(raw) if raw else ""
            if uri.startswith("skill://") and uri.endswith("/SKILL.md"):
                name = uri.replace("skill://", "").split("/")[0]
                skills.append({"name": name, "uri": uri})
    except Exception as exc:
        return {"skills": [], "error": str(exc)}
    return {"skills": sorted(skills, key=lambda s: s["name"])}


@router.get("/api/skills/{name}")
async def get_skill(name: str) -> dict[str, Any]:
    from vienna_life_assistant.vienna_life_mcp import mcp

    uri = f"skill://{name}/SKILL.md"
    try:
        parts = await mcp.read_resource(uri)
        text = ""
        for part in parts:
            if hasattr(part, "text"):
                text += getattr(part, "text", "") or ""
            elif isinstance(part, dict) and "text" in part:
                text += str(part["text"])
        if not text:
            raise HTTPException(status_code=404, detail=f"Skill not found: {name}")
        return {"name": name, "uri": uri, "content": text}
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=404, detail=f"Skill not found: {name}") from exc


@router.get("/api/prompts")
async def list_prompts() -> dict[str, Any]:
    from vienna_life_assistant.vienna_life_mcp import mcp

    prompts: list[dict[str, str]] = []
    try:
        items = await mcp.list_prompts()
        for item in items:
            prompts.append({"name": item.name, "description": getattr(item, "description", "") or ""})
    except Exception as exc:
        return {"prompts": [], "error": str(exc)}
    return {"prompts": prompts}
