"""OneNote bridge — ViLife talks to onenote-mcp (:10907) as the Graph gateway.

The Microsoft Graph token stays inside onenote-mcp (device-code flow, its own
refresh). ViLife only proxies read/write calls. When onenote-mcp is down or
unauthenticated, responses carry {"ok": False, "error": ...} so the UI can
show a friendly state.
"""

from __future__ import annotations

import logging
import os
from typing import Any

import httpx
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from vienna_life_assistant import life_db
from vienna_life_assistant.db import get_db
from vienna_life_assistant.models import JournalEntry

logger = logging.getLogger("vienna-life-assistant.notes")

ONENOTE_MCP_URL = os.environ.get("ONENOTE_MCP_URL", "http://127.0.0.1:10907")
_TIMEOUT = float(os.environ.get("ONENOTE_MCP_TIMEOUT", "8"))

router = APIRouter(prefix="/api/notes", tags=["notes"])


def _on(
    url: str,
    params: dict[str, Any] | None = None,
    json_body: dict[str, Any] | None = None,
    method: str = "GET",
) -> dict[str, Any]:
    """Call onenote-mcp; structured error when unreachable/failed."""
    try:
        resp = httpx.request(
            method,
            f"{ONENOTE_MCP_URL}{url}",
            params=params,
            json=json_body,
            timeout=_TIMEOUT,
        )
        resp.raise_for_status()
        body = resp.json()
        if isinstance(body, dict) and body.get("success") is False:
            return {
                "ok": False,
                "error": body.get("error", "onenote-mcp returned failure"),
            }
        return {"ok": True, **body}
    except httpx.HTTPStatusError as e:
        logger.warning("onenote-mcp %s failed: HTTP %s", url, e.response.status_code)
        return {
            "ok": False,
            "error": f"onenote-mcp HTTP {e.response.status_code}: {e.response.text[:200]}",
        }
    except Exception as e:  # noqa: BLE001 — bridge must never 500
        logger.warning("onenote-mcp %s failed: %s", url, e)
        return {"ok": False, "error": f"onenote-mcp unreachable: {e}"}


@router.get("/status")
async def notes_status() -> dict[str, Any]:
    """Auth + reachability state for the Notes UI banner."""
    payload = _on("/api/auth/status")
    if not payload.get("ok"):
        return {
            "ok": True,
            "reachable": False,
            "authenticated": False,
            "error": payload.get("error"),
        }
    return {
        "ok": True,
        "reachable": True,
        "authenticated": bool(payload.get("authenticated")),
    }


@router.get("/notebooks")
async def notes_notebooks() -> dict[str, Any]:
    return _on("/api/notebooks")


@router.get("/search")
async def notes_search(q: str = Query(..., min_length=2)) -> dict[str, Any]:
    return _on("/api/search", {"q": q})


@router.get("/page/{page_id}")
async def notes_page(page_id: str) -> dict[str, Any]:
    return _on(f"/api/pages/{page_id}")


@router.post("/pages")
async def notes_create_page(body: dict[str, Any]) -> dict[str, Any]:
    if not body.get("notebook_id") or not body.get("title"):
        return {"ok": False, "error": "notebook_id and title are required"}
    return _on("/api/pages", json_body=body, method="POST")


@router.post("/export-journal")
async def notes_export_journal(
    body: dict[str, Any], db: Session = Depends(get_db)
) -> dict[str, Any]:
    """Push a ViLife journal entry to OneNote as a page."""
    entry_id = body.get("entry_id")
    if not entry_id:
        return {"ok": False, "error": "entry_id required"}
    entry = life_db.get_row(db, JournalEntry, int(entry_id))
    if entry is None:
        return {"ok": False, "error": f"Journal entry {entry_id} not found"}

    notebooks = _on("/api/notebooks")
    if not notebooks.get("ok") or not notebooks.get("notebooks"):
        return {
            "ok": False,
            "error": "onenote-mcp unreachable or no notebooks — open onenote-mcp and authenticate first",
        }
    notebook = notebooks["notebooks"][0]
    notebook_id = notebook.get("id") or notebook.get("notebook_id")

    tags = entry.tags.strip() or "untagged"
    title = f"Journal {entry.date}: {entry.title or 'Untitled'}"
    content = (
        f"{entry.date} {entry.time} · Mood {entry.mood}/10 · Tags: {tags}\n\n"
        f"{entry.body}"
    )
    result = _on(
        "/api/pages",
        json_body={"notebook_id": notebook_id, "title": title, "content": content},
        method="POST",
    )
    if not result.get("ok"):
        return {
            "ok": False,
            "error": result.get("error", "onenote-mcp failed to create page"),
        }
    return {
        "ok": True,
        "message": f"Journal entry {entry.id} exported to notebook '{notebook.get('display_name') or notebook_id}'",
        "page": result.get("page"),
    }
