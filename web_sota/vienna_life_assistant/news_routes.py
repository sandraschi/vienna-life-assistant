"""Personal news site — feeds from aiwatcher-mcp (fleet news engine, :10946).

Server-to-server proxy: ViLife never exposes aiwatcher directly; the frontend
and MCP tools both call these endpoints. When aiwatcher is down, responses
carry {"ok": False, "error": ...} so the UI can show a friendly offline state.
"""

from __future__ import annotations

import logging
import os
from typing import Any

import httpx
from fastapi import APIRouter, Query

logger = logging.getLogger("vienna-life-assistant.news")

AIWATCHER_URL = os.environ.get("AIWATCHER_URL", "http://127.0.0.1:10946")
_TIMEOUT = float(os.environ.get("AIWATCHER_TIMEOUT", "8"))

router = APIRouter(prefix="/api/news", tags=["news"])


def _aw(path: str, params: dict[str, Any] | None = None) -> dict[str, Any]:
    """GET an aiwatcher endpoint; structured error when unreachable."""
    try:
        resp = httpx.get(
            f"{AIWATCHER_URL}{path}",
            params=params,
            timeout=_TIMEOUT,
        )
        resp.raise_for_status()
        return {"ok": True, **resp.json()}
    except Exception as e:  # noqa: BLE001 — bridge must never 500
        logger.warning("aiwatcher %s failed: %s", path, e)
        return {"ok": False, "error": f"aiwatcher unreachable: {e}"}


@router.get("/overview")
async def news_overview(
    hours: int = Query(24, ge=1, le=168),
    limit: int = Query(12, ge=1, le=50),
) -> dict[str, Any]:
    """Dashboard bundle: stats + top stories + trends + morning news."""
    stats = _aw("/api/stats")
    top = _aw("/api/items", {"limit": limit, "hours": hours})
    trends = _aw("/api/trends", {"days": 7, "limit": 15})
    morning = _aw("/api/morning-news")
    return {
        "ok": True,
        "stats": stats.get("items_last_24h") if stats.get("ok") else None,
        "stats_payload": stats,
        "top": top.get("items", []) if top.get("ok") else [],
        "trends": trends.get("trends", []) if trends.get("ok") else [],
        "morning": morning.get("items", []) if morning.get("ok") else [],
        "upstream_ok": stats.get("ok", False),
    }


@router.get("/top")
async def news_top(
    hours: int = Query(24, ge=1, le=168),
    limit: int = Query(15, ge=1, le=50),
) -> dict[str, Any]:
    return _aw("/api/items", {"limit": limit, "hours": hours})


@router.get("/trends")
async def news_trends(
    days: int = Query(7, ge=1, le=30),
    limit: int = Query(15, ge=1, le=30),
) -> dict[str, Any]:
    return _aw("/api/trends", {"days": days, "limit": limit})


@router.get("/search")
async def news_search(
    q: str = Query(..., min_length=2),
    limit: int = Query(15, ge=1, le=50),
) -> dict[str, Any]:
    return _aw("/api/search", {"q": q, "limit": limit})


@router.get("/morning")
async def news_morning() -> dict[str, Any]:
    return _aw("/api/morning-news")
