"""Fleet-standard /api/logs routes."""

from __future__ import annotations

from typing import Literal

from fastapi import APIRouter, Query
from fastapi.responses import Response

from vienna_life_assistant.activity_log import (
    clear_logs,
    export_logs,
    log_activity,
    log_stats,
    query_logs,
)

SortOrder = Literal["asc", "desc"]

router = APIRouter(prefix="/api/logs", tags=["logs"])


@router.get("")
async def logs_query(
    limit: int = Query(50, ge=1, le=500),
    offset: int = Query(0, ge=0),
    level: str | None = None,
    kind: str | None = None,
    search: str | None = None,
    sort: SortOrder = "desc",
    after_id: str | None = None,
):
    return query_logs(
        limit=limit,
        offset=offset,
        level=level,
        kind=kind,
        search=search,
        sort=sort,
        after_id=after_id,
    )


@router.get("/stats")
async def logs_stats():
    return log_stats()


@router.get("/export")
async def logs_export(
    format: str = Query("json", pattern="^(json|csv)$"),
    level: str | None = None,
    kind: str | None = None,
    search: str | None = None,
    sort: SortOrder = "desc",
):
    body, media_type, filename = export_logs(
        format=format,
        level=level,
        kind=kind,
        search=search,
        sort=sort,
    )
    return Response(
        content=body,
        media_type=media_type,
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )


@router.delete("")
async def logs_clear():
    clear_logs()
    log_activity("system", "Log buffer cleared", level="INFO")
    return {"ok": True, "message": "Log buffer cleared"}
