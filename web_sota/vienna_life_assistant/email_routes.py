"""Email bridge — ViLife talks to email-mcp (:10813) as the mail gateway.

Credentials, IMAP/SMTP/Graph setup, and the Microsoft Graph token all live in
email-mcp (its web API uses HTTP Basic auth). ViLife proxies read/write calls;
when email-mcp is down or unauthenticated, responses carry
{"ok": False, "error": ...} so the UI can show a friendly state.
"""

from __future__ import annotations

import logging
import os
from typing import Any

import httpx
from fastapi import APIRouter, Query

logger = logging.getLogger("vienna-life-assistant.email")

EMAIL_MCP_URL = os.environ.get("EMAIL_MCP_URL", "http://127.0.0.1:10813")
EMAIL_MCP_USER = os.environ.get("EMAIL_MCP_USER", "sandra")
EMAIL_MCP_PASSWORD = os.environ.get("EMAIL_MCP_PASSWORD", "vienna2026")
_TIMEOUT = float(os.environ.get("EMAIL_MCP_TIMEOUT", "10"))

router = APIRouter(prefix="/api/email", tags=["email"])


def _em(
    url: str,
    params: dict[str, Any] | None = None,
    json_body: dict[str, Any] | None = None,
    method: str = "GET",
) -> dict[str, Any]:
    """Call email-mcp with Basic auth; structured error when unreachable."""
    try:
        resp = httpx.request(
            method,
            f"{EMAIL_MCP_URL}{url}",
            params=params,
            json=json_body,
            auth=(EMAIL_MCP_USER, EMAIL_MCP_PASSWORD),
            timeout=_TIMEOUT,
        )
        if resp.status_code == 401:
            return {
                "ok": False,
                "error": "email-mcp auth rejected — check EMAIL_MCP_USER/PASSWORD",
            }
        resp.raise_for_status()
        return {"ok": True, **resp.json()}
    except httpx.HTTPStatusError as e:
        logger.warning("email-mcp %s failed: HTTP %s", url, e.response.status_code)
        return {"ok": False, "error": f"email-mcp HTTP {e.response.status_code}"}
    except Exception as e:  # noqa: BLE001 — bridge must never 500
        logger.warning("email-mcp %s failed: %s", url, e)
        return {"ok": False, "error": f"email-mcp unreachable: {e}"}


@router.get("/status")
async def email_status() -> dict[str, Any]:
    """Reachability + service state for the Email UI banner."""
    payload = _em("/api/status")
    if not payload.get("ok"):
        return {"ok": True, "reachable": False, "error": payload.get("error")}
    return {"ok": True, "reachable": True, "payload": payload}


@router.get("/stats")
async def email_stats() -> dict[str, Any]:
    return _em("/api/stats")


@router.get("/inbox")
async def email_inbox(
    limit: int = Query(20, ge=1, le=50),
    unread_only: bool = False,
    folder: str = "INBOX",
    service: str = "default",
) -> dict[str, Any]:
    return _em(
        "/api/inbox",
        {
            "limit": limit,
            "unread_only": unread_only,
            "folder": folder,
            "service": service,
        },
    )


@router.get("/message/{message_id}")
async def email_message(message_id: str) -> dict[str, Any]:
    return _em(f"/api/inbox/{message_id}")


@router.post("/message/{message_id}/mark-read")
async def email_mark_read(message_id: str) -> dict[str, Any]:
    return _em(f"/api/inbox/{message_id}/mark-read", json_body={}, method="POST")


@router.post("/message/{message_id}/unread")
async def email_mark_unread(message_id: str) -> dict[str, Any]:
    return _em(f"/api/inbox/{message_id}/unread", json_body={}, method="POST")


@router.get("/search")
async def email_search(q: str = Query(..., min_length=2)) -> dict[str, Any]:
    return _em("/api/search", {"q": q})


@router.post("/send")
async def email_send(body: dict[str, Any]) -> dict[str, Any]:
    """Send an email via email-mcp. Body: {to, subject, body, cc?, service?}."""
    if not body.get("to") or not body.get("subject") or not body.get("body"):
        return {"ok": False, "error": "to, subject, and body are required"}
    return _em("/api/send", json_body=body, method="POST")
