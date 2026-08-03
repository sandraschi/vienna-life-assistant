"""Environment monitoring — ViLife talks to devices-mcp (:10717, nssm task).

devices-mcp is the fleet's environment hub (cameras, energy, weather/netatmo,
sensors, lighting, Fritz!Box). Its MCP surface is not HTTP-exposed, so ViLife
bridges its REST endpoints directly. Every source degrades gracefully.

Also hosts the transit bridge: mywienerlinien REST (real Wiener Linien
departures, line-based) with the static reference as fallback.
"""

from __future__ import annotations

import logging
import os
from typing import Any

import httpx
from fastapi import APIRouter

logger = logging.getLogger("vienna-life-assistant.environment")

DEVICES_MCP_URL = os.environ.get("DEVICES_MCP_URL", "http://127.0.0.1:10717")
MYWIENERLINIEN_URL = os.environ.get("MYWIENERLINIEN_URL", "http://127.0.0.1:3079")
_TIMEOUT = float(os.environ.get("DEVICES_MCP_TIMEOUT", "6"))

router = APIRouter(prefix="/api/environment", tags=["environment"])


def _get(base: str, path: str, timeout: float = _TIMEOUT) -> dict[str, Any] | None:
    try:
        with httpx.Client(follow_redirects=True, timeout=timeout) as client:
            resp = client.get(f"{base}{path}")
            resp.raise_for_status()
            return resp.json()
    except Exception as e:  # noqa: BLE001 — bridges never hard-fail
        logger.warning("env %s%s failed: %s", base, path, e)
        return None


def environment_overview() -> dict[str, Any]:
    """Aggregate devices-mcp environment state, source by source."""
    energy = _get(DEVICES_MCP_URL, "/api/energy/status")
    sensors = _get(DEVICES_MCP_URL, "/api/sensors/overview")
    fritz = _get(DEVICES_MCP_URL, "/api/fleet/priority")
    weather = _get(DEVICES_MCP_URL, "/api/weather/current")
    connectivity = _get(DEVICES_MCP_URL, "/api/system/connection-health")
    alerts = _get(DEVICES_MCP_URL, "/alerts/summary")

    energy_on = 0
    energy_total = 0
    if energy and energy.get("devices"):
        devices = energy["devices"]
        energy_total = len(devices)
        energy_on = sum(1 for d in devices if d.get("is_on"))

    sensor_sources = (sensors or {}).get("sources", [])

    fritz_payload = (fritz or {}).get("payload") or fritz or {}
    incidents = fritz_payload.get("incident_count", 0)
    critical = fritz_payload.get("critical_count", 0)
    highest = fritz_payload.get("highest_urgency", 0)

    weather_temp = None
    if weather and weather.get("success"):
        data = weather.get("data") or weather
        weather_temp = data.get("temperature") or data.get("indoor_temperature")

    offline_devices = []
    if connectivity and connectivity.get("success"):
        offline_devices = (connectivity.get("offline_devices") or [])[:5]

    return {
        "ok": True,
        "devices_mcp_online": energy is not None
        or sensors is not None
        or fritz is not None,
        "energy": {"on": energy_on, "total": energy_total} if energy_total else None,
        "sensors": [
            {"id": s.get("id"), "name": s.get("name"), "connected": s.get("connected")}
            for s in sensor_sources
        ],
        "fritz": {
            "incidents": incidents,
            "critical": critical,
            "highest_urgency": highest,
            "ok": bool(critical == 0 and incidents == 0),
        }
        if fritz
        else None,
        "weather": {"temperature_c": weather_temp}
        if weather_temp is not None
        else None,
        "offline_devices": offline_devices,
        "alerts": (alerts or {}).get("summary") if alerts else None,
    }


def live_departures(
    lines: list[str] | None = None, rbl: str | None = None
) -> dict[str, Any] | None:
    """Real Wiener Linien departures via mywienerlinien REST (line- or stop-based)."""
    params: dict[str, str] = {}
    if rbl:
        params["rbl"] = rbl
    elif lines:
        params["lines"] = ",".join(lines)
    else:
        params["lines"] = "U4,5,12,D"
    try:
        with httpx.Client(follow_redirects=True, timeout=_TIMEOUT) as client:
            resp = client.get(f"{MYWIENERLINIEN_URL}/api/arrivals", params=params)
            resp.raise_for_status()
            return resp.json()
    except Exception as e:  # noqa: BLE001
        logger.warning("mywienerlinien arrivals failed: %s", e)
        return None


@router.get("/overview")
async def env_overview() -> dict[str, Any]:
    return environment_overview()
