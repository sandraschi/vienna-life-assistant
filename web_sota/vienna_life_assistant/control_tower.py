"""Fleet Control Tower - standalone aggregation layer.

Implements Phase 1+2 of `SPEC.md`: one payload for the Control Tower,
Services and Goliath pages.

- services: fleet registry (reused from `fleet_overview`) with a fast
  concurrent health probe.
- windows_services: every Windows service via Win32_Service; NSSM is
  classified when `PathName` matches `nssm` (fleet-canonical rule), naked =
  everything else. Read-only - the page surfaces `sc.exe stop/start`, never
  executes service changes.
- goliath: psutil CPU/RAM + nvidia-smi GPU with a derived verdict
  (choking / busy / underutilized / idle) over the shown numbers.

Kept free of VLA life-domain imports so the whole module can move to
meta_mcp later (copy file + mount a route). Fail-soft: a dead source returns
source_ok=False with an error string, never raises.
"""

from __future__ import annotations

import concurrent.futures
import http.client
import json
import logging
import re
import subprocess
import time
from datetime import datetime
from typing import Any, Callable
from urllib.error import URLError
from urllib.request import Request, urlopen

logger = logging.getLogger("vienna-life-assistant.control_tower")

try:  # pragma: no cover - exercised once psutil is installed
    import psutil  # type: ignore
except ImportError:  # pragma: no cover
    psutil = None  # type: ignore

CACHE_TTL = 30
_CACHE: dict[str, tuple[float, Any]] = {}


def _cached_call(
    key: str, fn: Callable[[], Any], ttl: float = CACHE_TTL, fresh: bool = False
) -> Any:
    now = time.time()
    entry = _CACHE.get(key)
    if not fresh and entry and now - entry[0] < ttl:
        return entry[1]
    data = fn()
    _CACHE[key] = (now, data)
    return data


# ------------------------------------------------------------------ services


def _probe_many(ports: list[int], timeout: float = 1.0) -> dict[int, str]:
    """Concurrent /health probe over the fleet's backend/frontend ports."""

    def probe(port: int) -> tuple[int, str]:
        try:
            req = Request(f"http://127.0.0.1:{port}/health", method="GET")
            with urlopen(req, timeout=timeout) as resp:
                return port, ("online" if 200 <= resp.status < 300 else "degraded")
        except (URLError, OSError, TimeoutError, http.client.HTTPException):
            # HTTPException covers BadStatusLine: a registry port that is not
            # HTTP at all (e.g. an SSH service) must probe as offline, never
            # bubble up and 500 the whole control tower.
            return port, "offline"

    result: dict[int, str] = {}
    with concurrent.futures.ThreadPoolExecutor(max_workers=16) as ex:
        for port, status in ex.map(probe, ports):
            result[port] = status
    return result


def build_fleet_section(*, probe: bool = True) -> dict[str, Any]:
    """Fleet registry ships + (optional) concurrent health, not the slow
    sequential probe used by the standalone /api/fleet/overview."""

    def _build() -> dict[str, Any]:
        from .fleet_overview import build_fleet_overview

        overview = build_fleet_overview(probe=False)
        ships = overview.get("ships") or []
        ports = sorted(
            {
                s["backend_port"] or s["frontend_port"]
                for s in ships
                if (s["backend_port"] or s["frontend_port"]) > 0
            }
        )
        health = _probe_many(ports, timeout=1.0) if probe else {}
        online = 0
        for s in ships:
            port = s["backend_port"] or s["frontend_port"]
            h = health.get(port, "unknown")
            s["health"] = h
            if h == "online":
                online += 1
        overview["summary"]["online"] = online if probe else None
        overview["summary"]["probed"] = probe
        return overview

    return _cached_call("fleet_section", _build, fresh=False)


# ------------------------------------------------------------- windows services


_PS_SERVICES = (
    "Get-CimInstance Win32_Service | "
    "Select-Object Name,DisplayName,State,StartMode,ProcessId,PathName | "
    "ConvertTo-Json -Compress -Depth 3"
)


def _nssm_app(path_name: str) -> str | None:
    """Best-effort app name from an NSSM ImagePath (quoted arg after nssm.exe)."""
    idx = path_name.lower().find("nssm.exe")
    if idx < 0:
        return None
    rest = path_name[idx + len("nssm.exe") :].lstrip('" ')
    quoted = re.search(r'"([^"]+)"', rest)
    if quoted:
        return quoted.group(1)
    token = re.search(r"(\S+\.\S+)", rest)
    return token.group(1).strip('"') if token else None


def windows_services(*, fresh: bool = False) -> dict[str, Any]:
    """Every Windows service with NSSM classification (PathName contains nssm)."""

    def _fetch() -> dict[str, Any]:
        items: list[dict[str, Any]] = []
        nssm_count = naked_count = running_count = 0
        try:
            proc = subprocess.run(
                [
                    "powershell.exe",
                    "-NoProfile",
                    "-NonInteractive",
                    "-ExecutionPolicy",
                    "Bypass",
                    "-Command",
                    _PS_SERVICES,
                ],
                capture_output=True,
                text=True,
                timeout=20,
                encoding="utf-8",
                errors="replace",
            )
            if proc.returncode != 0:
                return {
                    "items": [],
                    "nssm_count": 0,
                    "naked_count": 0,
                    "running_count": 0,
                    "source_ok": False,
                    "error": (proc.stderr or "powershell failed").strip()[:300],
                }
            raw = proc.stdout.strip()
            if not raw:
                return {
                    "items": [],
                    "nssm_count": 0,
                    "naked_count": 0,
                    "running_count": 0,
                    "source_ok": False,
                    "error": "empty Win32_Service output",
                }
            data = json.loads(raw)
            rows = data if isinstance(data, list) else [data]
        except (json.JSONDecodeError, subprocess.SubprocessError, OSError) as exc:
            return {
                "items": [],
                "nssm_count": 0,
                "naked_count": 0,
                "running_count": 0,
                "source_ok": False,
                "error": str(exc)[:300],
            }

        for row in rows:
            name = row.get("Name")
            if not name:
                continue
            path = row.get("PathName") or ""
            is_nssm = "nssm" in path.lower()
            if is_nssm:
                nssm_count += 1
            else:
                naked_count += 1
            state = row.get("State") or "Unknown"
            if str(state).lower() == "running":
                running_count += 1
            items.append(
                {
                    "name": name,
                    "display_name": row.get("DisplayName") or name,
                    "state": state,
                    "start_mode": row.get("StartMode") or "Unknown",
                    "pid": int(row.get("ProcessId") or 0),
                    "nssm": is_nssm,
                    "path_name": path[:240],
                    "app_name": _nssm_app(path) or (name if is_nssm else None),
                }
            )
        items.sort(key=lambda x: (x["nssm"], x["name"].lower()))
        return {
            "items": items,
            "nssm_count": nssm_count,
            "naked_count": naked_count,
            "running_count": running_count,
            "source_ok": True,
        }

    return _cached_call("windows_services", _fetch, fresh=fresh)


# ------------------------------------------------------------------ goliath


def _cpu_ram() -> dict[str, Any]:
    if psutil is None:
        return {
            "source_ok": False,
            "error": "psutil not installed",
            "cores": 0,
            "threads": 0,
            "util": 0.0,
            "per_core": [],
            "load_1m": None,
            "ram": {"used_gb": 0.0, "total_gb": 0.0, "pressure_pct": 0.0},
            "top_processes": [],
        }
    try:
        proc_list = list(psutil.process_iter(["pid", "name"]))
        # Two-pass CPU sampling: prime deltas, sleep, then read real values.
        for p in proc_list:
            try:
                p.cpu_percent(None)
            except (psutil.NoSuchProcess, psutil.AccessDenied):
                continue
        time.sleep(0.3)
        _ = psutil.cpu_percent(interval=None, percpu=True)
        time.sleep(0.3)
        util = psutil.cpu_percent(interval=None)
        per_core = psutil.cpu_percent(interval=None, percpu=True)
        vm = psutil.virtual_memory()
        load_1m = None
        try:
            load_1m = psutil.getloadavg()[0]
        except (AttributeError, OSError):
            load_1m = None
        procs: list[dict[str, Any]] = []
        for p in proc_list:
            try:
                info = p.as_dict(attrs=["pid", "name", "cpu_percent", "memory_percent"])
                if info.get("cpu_percent") is None:
                    continue
                name = str(info.get("name") or "?")
                # System Idle Process is the inverted idle counter, not a real app.
                if (
                    name in {"System Idle Process", "Idle"}
                    or int(info["pid"] or 0) <= 0
                ):
                    continue
                procs.append(
                    {
                        "pid": int(info["pid"]),
                        "name": name,
                        "cpu_percent": round(float(info.get("cpu_percent") or 0.0), 1),
                        "memory_percent": round(
                            float(info.get("memory_percent") or 0.0), 1
                        ),
                    }
                )
            except (psutil.NoSuchProcess, psutil.AccessDenied, KeyError, TypeError):
                continue
        procs.sort(key=lambda x: x["cpu_percent"], reverse=True)
        return {
            "source_ok": True,
            "cores": psutil.cpu_count(logical=False) or 0,
            "threads": psutil.cpu_count(logical=True) or 0,
            "util": round(util, 1),
            "per_core": [round(c, 1) for c in per_core],
            "load_1m": round(load_1m, 2) if load_1m is not None else None,
            "ram": {
                "used_gb": round(vm.used / 1e9, 1),
                "total_gb": round(vm.total / 1e9, 1),
                "pressure_pct": round(vm.percent, 1),
            },
            "top_processes": procs[:8],
        }
    except Exception as exc:  # pragma: no cover - defensive
        logger.warning("goliath cpu/ram probe failed: %s", exc)
        return {
            "source_ok": False,
            "error": str(exc)[:300],
            "cores": 0,
            "threads": 0,
            "util": 0.0,
            "per_core": [],
            "load_1m": None,
            "ram": {"used_gb": 0.0, "total_gb": 0.0, "pressure_pct": 0.0},
            "top_processes": [],
        }


def _gpu_stats() -> dict[str, Any] | None:
    def run(args: list[str]) -> str | None:
        try:
            proc = subprocess.run(
                ["nvidia-smi", *args],
                capture_output=True,
                text=True,
                timeout=10,
                encoding="utf-8",
                errors="replace",
            )
            return proc.stdout if proc.returncode == 0 else None
        except (subprocess.SubprocessError, OSError):
            return None

    out = run(
        [
            "--query-gpu=utilization.gpu,memory.used,memory.total,temperature.gpu,power.draw",
            "--format=csv,noheader,nounits",
        ]
    )
    if not out or not out.strip():
        return None
    parts = [p.strip() for p in out.strip().splitlines()[0].split(",")]
    if len(parts) < 5:
        return None
    try:
        gpu: dict[str, Any] = {
            "name": "NVIDIA (nvidia-smi)",
            "util_pct": round(float(parts[0]), 1),
            "vram_used_gb": round(float(parts[1]) / 1024.0, 1),
            "vram_total_gb": round(float(parts[2]) / 1024.0, 1),
            "temp_c": round(float(parts[3]), 1),
            "power_w": round(float(parts[4]), 1),
        }
    except ValueError:
        gpu = {
            "name": "NVIDIA",
            "util_pct": 0.0,
            "vram_used_gb": 0.0,
            "vram_total_gb": 0.0,
            "temp_c": 0.0,
            "power_w": 0.0,
        }
    apps_out = run(
        [
            "--query-compute-apps=pid,process_name,used_memory",
            "--format=csv,noheader,nounits",
        ]
    )
    apps: list[dict[str, Any]] = []
    if apps_out:
        for line in apps_out.strip().splitlines():
            p = [x.strip() for x in line.split(",")]
            if len(p) >= 3:
                try:
                    apps.append(
                        {
                            "pid": int(p[0]),
                            "name": p[1],
                            "vram_gb": round(float(p[2]) / 1024.0, 1),
                        }
                    )
                except ValueError:
                    continue
    gpu["apps"] = apps
    return gpu


def _verdict(cpu: dict[str, Any], gpu: dict[str, Any] | None) -> dict[str, Any]:
    util = float(cpu.get("util") or 0.0)
    ram_pct = float((cpu.get("ram") or {}).get("pressure_pct") or 0.0)
    gpu_util = float(gpu.get("util_pct") or 0.0) if gpu else 0.0
    temp = float(gpu.get("temp_c") or 0.0) if gpu else 0.0
    high = util >= 85 or gpu_util >= 85
    if high and (temp >= 85 or ram_pct >= 90):
        label = "choking"
    elif util >= 50 or gpu_util >= 50:
        label = "busy"
    elif util <= 5 and gpu_util <= 2 and ram_pct < 50:
        label = "idle"
    elif util <= 15 and gpu_util <= 5:
        label = "underutilized"
    else:
        label = "busy"
    reason = f"CPU {util:.0f}% / RAM {ram_pct:.0f}% / GPU {gpu_util:.0f}%" + (
        f" / {temp:.0f}C" if gpu else " / no GPU"
    )
    return {"label": label, "reason": reason}


def goliath_stats(*, fresh: bool = False) -> dict[str, Any]:
    """Goliath host: CPU/RAM (psutil) + GPU (nvidia-smi) + verdict."""

    def _fetch() -> dict[str, Any]:
        cpu = _cpu_ram()
        gpu = _gpu_stats()
        return {
            "cpu": {
                k: cpu.get(k)
                for k in (
                    "cores",
                    "threads",
                    "util",
                    "per_core",
                    "load_1m",
                    "source_ok",
                    "error",
                )
            },
            "ram": cpu.get("ram"),
            "gpu": gpu,
            "verdict": _verdict(cpu, gpu),
            "top_processes": cpu.get("top_processes", []),
            "gpu_apps": (gpu or {}).get("apps", []),
            "source_ok": bool(cpu.get("source_ok") or gpu),
        }

    return _cached_call("goliath", _fetch, fresh=fresh)


# -------------------------------------------------------------- orphaned servers

# Same detection logic as the fleet reaper (mcp-central-docs/scripts/fleet-watchdog.ps1
# -Reap): stdio MCP/agent spawn signatures, parent PID dead, excluding
# fleet-managed daemons that legitimately outlive their short-lived spawner.
_PS_ORPHANS = (
    "$OutputEncoding = [Console]::OutputEncoding = [System.Text.Encoding]::UTF8\n"
    "$pattern = '(?i)(\\.main|__main__|mcp --transport|advanced-memory.* mcp)'\n"
    "$managed = @('robofang.main','meta_mcp.main','fleet_agent','aiwatcher_mcp','devices_mcp','advanced_memory','advanced-memory')\n"
    "$est = @{}\n"
    "foreach ($line in (netstat -ano | Select-String 'ESTABLISHED')) {\n"
    "  $parts = $line.Line -split '\\s+'\n"
    "  if ($parts.Count -ge 5) {\n"
    "    $procId = $parts[$parts.Count - 1]\n"
    "    if ($procId -match '^\\d+$') {\n"
    "      if ($est.ContainsKey($procId)) { $est[$procId] = $est[$procId] + 1 } else { $est[$procId] = 1 }\n"
    "    }\n"
    "  }\n"
    "}\n"
    "$procs = @()\n"
    "foreach ($w in (Get-CimInstance Win32_Process -Filter \"Name='python.exe' OR Name='uv.exe'\" -ErrorAction SilentlyContinue)) {\n"
    "  $cmd = $w.CommandLine\n"
    "  if (-not $cmd -or ($cmd -notmatch $pattern)) { continue }\n"
    "  $isManaged = $false\n"
    "  foreach ($m in $managed) { if ($cmd.Contains($m)) { $isManaged = $true; break } }\n"
    '  $parentAlive = [bool](Get-CimInstance Win32_Process -Filter "ProcessId=$($w.ParentProcessId)" -ErrorAction SilentlyContinue)\n'
    "  $proc = Get-Process -Id $w.ProcessId -ErrorAction SilentlyContinue\n"
    "  $started = $null\n"
    "  if ($proc) { $started = $proc.StartTime.ToString('o') }\n"
    "  $estCount = 0\n"
    "  $key = [string]$w.ProcessId\n"
    "  if ($est.ContainsKey($key)) { $estCount = $est[$key] }\n"
    "  $procs += [PSCustomObject]@{ pid = $w.ProcessId; ppid = $w.ParentProcessId; parent_alive = $parentAlive; name = $w.Name; managed = $isManaged; cmdline = $cmd; started = $started; established = $estCount }\n"
    "}\n"
    "$total = 0\n"
    "foreach ($v in $est.Values) { $total = $total + $v }\n"
    "[PSCustomObject]@{ total_established = $total; processes = @($procs) } | ConvertTo-Json -Depth 4 -Compress"
)


def _run_powershell(script: str, timeout: float = 30.0) -> tuple[bool, str]:
    try:
        proc = subprocess.run(
            [
                "powershell.exe",
                "-NoProfile",
                "-NonInteractive",
                "-ExecutionPolicy",
                "Bypass",
                "-Command",
                script,
            ],
            capture_output=True,
            text=True,
            timeout=timeout,
            encoding="utf-8",
            errors="replace",
        )
    except (subprocess.SubprocessError, OSError) as exc:
        return False, str(exc)
    if proc.returncode != 0:
        return False, (proc.stderr or f"exit {proc.returncode}").strip()[:300]
    return True, (proc.stdout or "").strip()


def _age_seconds(started_iso: str | None) -> float | None:
    if not started_iso:
        return None
    try:
        dt = datetime.fromisoformat(started_iso.replace("Z", "+00:00"))
        return max(0.0, time.time() - dt.timestamp())
    except ValueError:
        return None


def scan_orphans(*, fresh: bool = False) -> dict[str, Any]:
    """Orphaned MCP/agent servers on Goliath + socket pressure (fail-soft)."""

    def _fetch() -> dict[str, Any]:
        ok, out = _run_powershell(_PS_ORPHANS)
        if not ok:
            logger.warning("orphan scan failed: %s", out)
            return {
                "source_ok": False,
                "error": out,
                "total_orphans": None,
                "total_established": None,
                "orphans": [],
                "checked_at": datetime.now().astimezone().isoformat(timespec="seconds"),
            }
        try:
            data = json.loads(out)
        except json.JSONDecodeError:
            return {
                "source_ok": False,
                "error": "invalid orphan scan output",
                "total_orphans": None,
                "total_established": None,
                "orphans": [],
                "checked_at": datetime.now().astimezone().isoformat(timespec="seconds"),
            }
        orphans: list[dict[str, Any]] = []
        for p in data.get("processes") or []:
            if p.get("managed") or p.get("parent_alive"):
                continue
            started = p.get("started")
            orphans.append(
                {
                    "pid": int(p.get("pid") or 0),
                    "ppid": int(p.get("ppid") or 0),
                    "parent_alive": False,
                    "name": p.get("name") or "python.exe",
                    "cmdline": p.get("cmdline") or "",
                    "started": started,
                    "age_seconds": _age_seconds(started),
                    "established": int(p.get("established") or 0),
                }
            )
        orphans.sort(key=lambda o: o.get("established", 0), reverse=True)
        return {
            "source_ok": True,
            "total_orphans": len(orphans),
            "total_established": int(data.get("total_established") or 0),
            "orphans": orphans,
            "checked_at": datetime.now().astimezone().isoformat(timespec="seconds"),
        }

    return _cached_call("orphans", _fetch, ttl=10, fresh=fresh)


def kill_orphan(pid: int) -> dict[str, Any]:
    """Kill one orphaned server, refusing if it is no longer flagged as orphan."""
    state = scan_orphans(fresh=True)
    if not state.get("source_ok"):
        return state
    if not any(int(o["pid"]) == int(pid) for o in state["orphans"]):
        return {
            "source_ok": True,
            "success": False,
            "error": f"PID {pid} is not an orphaned MCP server (nothing killed)",
            **{k: v for k, v in state.items() if k != "source_ok"},
        }
    ok, err = _run_powershell(f"Stop-Process -Id {int(pid)} -Force", timeout=15.0)
    if not ok:
        return {
            "source_ok": True,
            "success": False,
            "error": f"Kill failed: {err}",
            **{k: v for k, v in state.items() if k != "source_ok"},
        }
    logger.info("killed orphan PID %s", pid)
    refreshed = scan_orphans(fresh=True)
    refreshed["killed"] = [int(pid)]
    return refreshed


def reap_all() -> dict[str, Any]:
    """Kill every currently orphaned MCP server."""
    state = scan_orphans(fresh=True)
    if not state.get("source_ok"):
        return state
    killed: list[int] = []
    for o in list(state["orphans"]):
        res = kill_orphan(int(o["pid"]))
        if res.get("success") is not False:
            killed.append(int(o["pid"]))
    final = scan_orphans(fresh=True)
    final["killed"] = killed
    return final


# ------------------------------------------------------------------- aggregate


def build_control_tower(*, probe: bool = True, fresh: bool = False) -> dict[str, Any]:
    """Merged payload for the Control Tower page (SPEC section 4 contract)."""

    def _build() -> dict[str, Any]:
        services = build_fleet_section(probe=probe)
        win_services = windows_services(fresh=fresh)
        goliath = goliath_stats(fresh=fresh)
        return {
            "generated_at": datetime.now().astimezone().isoformat(timespec="seconds"),
            "cached_for": int(CACHE_TTL),
            "services": services,
            "windows_services": win_services,
            "goliath": goliath,
            "source_health": {
                "fleet-registry": "ok",
                "windows-services": "ok"
                if win_services.get("source_ok")
                else "offline",
                "goliath": "ok" if goliath.get("source_ok") else "offline",
            },
        }

    return _cached_call("control_tower", _build, fresh=fresh)
