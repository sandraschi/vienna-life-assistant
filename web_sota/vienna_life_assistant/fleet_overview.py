"""
Fleet meta-dashboard data layer.
Reads mcp-central-docs registries and optionally probes /health on local ports.
"""

from __future__ import annotations

import json
import os
from pathlib import Path
from typing import Any
from urllib.error import URLError
from urllib.request import Request, urlopen

DEFAULT_OPS_ROOT = Path(r"D:\Dev\repos\mcp-central-docs\operations")

CARRIER_IDS = frozenset(
    {
        "vienna-life-assistant",
        "robofang",
        "meta_mcp",
        "advanced-memory-mcp",
        "fleet-agent-mcp",
    }
)

FRIGATE_IDS = frozenset(
    {
        "dj-media-hub",
        "ai-producer-hub",
        "mcp-federation-hub",
        "universal-actuator-mcp",
    }
)

MINESWEEPER_IDS = frozenset(
    {"mcp-test-suite", "observability-mcp", "monitoring-mcp", "deepfang"}
)


def _ops_root() -> Path:
    raw = os.environ.get("FLEET_OPS_ROOT", "")
    if raw:
        return Path(raw)
    return DEFAULT_OPS_ROOT


def _load_json(path: Path) -> Any:
    if not path.is_file():
        return None
    with path.open(encoding="utf-8") as fh:
        return json.load(fh)


def _ship_class(entry_id: str, category: str) -> str:
    if entry_id in CARRIER_IDS:
        return "carrier"
    if entry_id in FRIGATE_IDS:
        return "frigate"
    if entry_id in MINESWEEPER_IDS:
        return "minesweeper"
    if category in {"Infra", "Command"}:
        return "tender"
    if category in {"AI", "Knowledge"} and "memory" in entry_id:
        return "submarine"
    return "destroyer"


def _probe_health(port: int, timeout: float = 2.0) -> str:
    if port <= 0:
        return "unknown"
    url = f"http://127.0.0.1:{port}/health"
    try:
        req = Request(url, method="GET")
        with urlopen(req, timeout=timeout) as resp:
            if 200 <= resp.status < 300:
                return "online"
            return "degraded"
    except (URLError, OSError, TimeoutError):
        return "offline"


def _webapp_ports(webapps: list[dict[str, Any]], entry_id: str) -> tuple[int, int]:
    frontend = 0
    backend = 0
    for w in webapps:
        wid = w.get("id", "")
        tags = w.get("tags") or []
        port = int(w.get("port") or 0)
        if not wid.startswith(entry_id):
            continue
        if "frontend" in tags:
            frontend = port
        if "backend" in tags:
            backend = port
    if frontend == 0 and backend == 0:
        for w in webapps:
            if w.get("id") == entry_id:
                return int(w.get("port") or 0), 0
    return frontend, backend


def build_fleet_overview(*, probe: bool = False) -> dict[str, Any]:
    ops = _ops_root()
    fleet_data = _load_json(ops / "fleet-registry.json")
    webapp_data = _load_json(ops / "webapp-registry.json")

    if not fleet_data or "fleet" not in fleet_data:
        return {
            "summary": {
                "total": 0,
                "error": f"fleet-registry.json not found under {ops}",
            },
            "ships": [],
            "ops_root": str(ops),
        }

    webapps = (webapp_data or {}).get("webapps") or []
    ships: list[dict[str, Any]] = []
    categories: dict[str, int] = {}
    quarantined = 0
    online = 0

    for entry in fleet_data["fleet"]:
        entry_id = entry.get("id", "")
        category = entry.get("category", "Dev")
        status = entry.get("status", "active")
        port = int(entry.get("port") or 0)
        fe_port, be_port = _webapp_ports(webapps, entry_id)
        display_port = fe_port or port

        categories[category] = categories.get(category, 0) + 1
        if status in {"quarantined", "archived"}:
            quarantined += 1

        health = "unknown"
        if probe and status not in {"quarantined", "archived"}:
            health = _probe_health(be_port or display_port)

        if health == "online":
            online += 1

        ships.append(
            {
                "id": entry_id,
                "name": entry.get("name", entry_id),
                "description": (entry.get("description") or "")[:160],
                "ship_class": _ship_class(entry_id, category),
                "category": category,
                "status": status,
                "frontend_port": fe_port,
                "backend_port": be_port or port,
                "health": health,
                "url": f"http://localhost:{display_port}" if display_port > 0 else None,
                "repo_path": entry.get("repo_path"),
            }
        )

    def _sort_key(s: dict[str, Any]) -> tuple[int, str]:
        order = {
            "carrier": 0,
            "frigate": 1,
            "destroyer": 2,
            "submarine": 3,
            "minesweeper": 4,
            "tender": 5,
        }
        return order.get(s["ship_class"], 9), s["name"].lower()

    ships.sort(key=_sort_key)

    return {
        "ops_root": str(ops),
        "summary": {
            "total": len(ships),
            "online": online if probe else None,
            "quarantined": quarantined,
            "categories": categories,
            "probed": probe,
        },
        "ships": ships,
    }
