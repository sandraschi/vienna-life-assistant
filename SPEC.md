# Fleet Control Tower - SPEC

**Status:** Phase 1+2 **implemented** (2026-08-19): `/api/control-tower`,
`/api/services`, `/api/goliath` on backend 10922 + Control Tower, Services and
Goliath pages on webapp 10988. Phases 3-6 remain spec.
**Date:** 2026-08-19
**Home:** vienna-life-assistant (VLA) backend 10922 / webapp 10988
**Trajectory:** "Sandra the dev life assistant" - this is the **dev-life tab**
of the VLA flag bridge (see `mcp-central-docs/operations/planning/META_DASHBOARD.md`).
**Migratable:** aggregation logic lives in a standalone module so it can move to
`meta_mcp` later without a rewrite.

---

## 1. Goal

A single VLA page that answers, in one screen, the daily dev standup question:

> What is running, what is my agent doing, what is scheduled, what did it
> produce, and what did people say on Discord / email?

Today this is spread across several webapps: `vienna-life-assistant` `/fleet`
(services), `aiwatcher-mcp` (digests/reports), `fleet-agent-mcp` (Fritz:
agents/tasks/logs), `observability-mcp` (health/alerts) - and there is **no
view of crons, Windows services, HTTPS-exposed MCP servers, speech/wake-word
state, Discord or email activity, or the host machine anywhere**.

The Control Tower merges them into one dark-theme dashboard - **Services,
Agents & Tasks, Scheduled Jobs, HTTPS MCP, Speech-MCP, Goliath PC, Reports,
Discord, Email** - plus a unified **activity timeline**, and adds two dedicated
pages:

- **`/services`** - the full Windows services view, distinguishing **naked
  `sc` services** from **NSSM-managed services** (the fleet's canonical
  `FleetStartMode.ps1` classification).
- **`/goliath`** - a live PC overview: CPU, GPU (RTX 4090) and RAM stats with
  a verdict ("is it choking? underutilized? what is it doing right now?").

## 2. Verified data sources

All endpoints verified to exist in the fleet today (2026-08-19). Every source
is probed with a short timeout and **fail-soft** - a dead source renders a gray
"offline" chip, never blocks the page, never fakes data.

| Source | Endpoint | Port | Provides |
|--------|----------|------|----------|
| **Services** | VLA `GET /api/fleet/overview?probe=1` (reads `fleet-registry.json` + `webapp-registry.json`, async health probes) | 10922 | fleet of services: id, category, frontend/backend ports, health dot |
| **Windows services (sc + NSSM)** | local `Get-CimInstance Win32_Service` (Name, State, StartMode, ProcessId, PathName) | local | every Windows service; **NSSM = PathName matches `nssm`** (fleet-canonical pattern in `FleetStartMode.ps1`), naked = everything else. Runs the fleet's services incl. NSSM-managed backends |
| **HTTPS MCP servers** | `tailscale serve status` + `tailscale status` on goliath; JSON-RPC `initialize` probe over `https://goliath.tailfab45.ts.net/{mount}/mcp` | 443 | which services are public/HTTPS-exposed, and of those which are functional MCP endpoints (respond to `initialize`) vs webapp-only mounts |
| **Agent (Fritz)** | `fleet-agent-mcp` `GET /api/status`, `GET /api/v1/diagnostics`, `GET /api/logs` | fleet-agent | agent health, identity, tool count, recent logs |
| **Tasks / CI / PRs** | `gitops` MCP `fleet_ops` (ci_pulse, port_audit, full_suite) + `gh` API | (gitops) | CI run status, open PRs/issues per repo, port audit |
| **Scheduled jobs** | NEW `mcp-central-docs/operations/scheduled-tasks.json` registry + best-effort `schtasks /query` + NSSM `sc query` probe | - | cron/NSSM jobs: id, schedule, owner, enabled, last run |
| **Reports / outputs** | Intel Reports Hub `GET /` index (fleet-intel-reports) | 11027 | published digest/report HTML (AIWatcher + Fritz), newest first |
| **Discord activity** | `discord-mcp` `GET /api/logs`, `GET /api/v1/stats/analytics`, `GET /api/health` | 10756 | recent server activity log, per-server/analytics stats |
| **Email activity** | `email-mcp` `GET /api/logs`, `GET /api/status`, `GET /api/v1/health` | 10813 | recent send/receive activity, account/status |
| **Speech-MCP functional** | `speech-mcp` `GET /api/v1/health` | 10909 | **is it alive AND is the wake-word listener running** (`wake_word_active`), active_timers, provider presence, FunASR sidecar reachable |
| **Goliath PC overview** | local `psutil` (CPU/RAM/load/processes) + `nvidia-smi --query-gpu=utilization.gpu,memory.used,memory.total,temperature.gpu,power.draw --query-compute-apps` | local | CPU util (per-core + load), RAM used/total + pressure, GPU util/VRAM/temp/power, top processes + GPU compute apps, verdict (choking / underutilized / idle) |

Known scheduled jobs to seed the registry (Phase 2, from the fleet today):
`aiwatcher` morning digest (`install_morning_task.ps1`), gitops `fleet_morning_digest`
breakfast run, Intel Reports Hub generation. NSSM-managed fleet services are
enumerated from `sc query` and marked `type: nssm`.

## 3. Architecture

```
VLA webapp (10988)  ControlTower.tsx  (/control-tower)
        |
        |  GET /api/control-tower
        v
VLA backend (10922)  control_tower.py  (STANDALONE - no VLA app imports)
        |  async fan-out, 1.5s timeout per source, fail-soft, 30s cache
        |
        +-- fleet-registry.json + webapp-registry.json (+ /api/health probes)
        +-- Win32_Service            (naked sc + NSSM classification, local)
        +-- tailscale serve status   (HTTPS funnel mounts) + JSON-RPC probe
        +-- psutil + nvidia-smi      (Goliath CPU/RAM/GPU, local)
        +-- speech-mcp /api/v1/health (wake-word functional check)
        +-- fleet-agent-mcp REST      (status/diagnostics/logs)
        +-- gitops / gh               (CI runs, PRs, issues)
        +-- scheduled-tasks.json      (+ schtasks / sc query probes)
        +-- Intel Reports Hub :11027  (report index)
        +-- discord-mcp REST          (activity log + analytics)
        +-- email-mcp REST            (activity log + status)
```

**Why VLA now:** VLA already owns the meta layer (`/api/fleet/overview`,
Fleet.tsx) and is the designated "flag bridge" per META_DASHBOARD.md. The
Control Tower extends that page set. **Why migratable:** `control_tower.py` is
a pure function of (registries, endpoints) with no VLA app state - porting to
`meta_mcp` later = copy file + mount one route.

**Caching:** the aggregate is cached server-side for 30s. Probes never hammer
sources on page refresh.

## 4. Data contract (`GET /api/control-tower`)

```json
{
  "generated_at": "2026-08-19T08:00:00+02:00",
  "cached_for": 30,
  "sections": {
    "services": { "total": 42, "online": 38, "offline": 4, "items": [
      {"id": "plex-mcp", "category": "Media", "frontend_port": 10714,
       "backend_port": 10715, "health": "online", "url": "http://127.0.0.1:10714"} ]},
    "agents": { "fritz": {"status": "online", "tools": 38, "uptime_s": 12345,
       "recent_logs": ["..."] }, "source_ok": true },
    "tasks": { "ci_runs": [...], "open_prs": 3, "open_issues": 12,
       "port_audit": {...} },
    "crons": { "items": [ {"id": "aiwatcher-morning", "schedule": "daily 07:00",
       "owner": "aiwatcher-mcp", "type": "scheduled-task", "enabled": true,
       "last_run": "2026-08-19T07:00:05+02:00"} ], "probe": "ok|partial" },
    "reports": { "items": [ {"title": "...", "date": "...", "url": "...",
       "source": "aiwatcher|fritz"} ] },
    "discord": { "items": [ {"ts": "...", "server": "...", "channel": "...",
       "kind": "message|event", "summary": "..."} ], "source_ok": true },
    "email": { "items": [ {"ts": "...", "account": "...", "kind": "sent|received",
       "subject": "...", "from": "..."} ], "source_ok": true },
    "windows_services": { "items": [ {"name": "...", "state": "Running|Stopped",
       "start_mode": "Auto|Manual|Disabled", "pid": 1234, "nssm": true,
       "path_name": "...nssm.exe...", "app_name": "..."} ], "nssm_count": 0,
       "naked_count": 0, "running_count": 0, "source_ok": true },
    "https_mcp": { "items": [ {"mount": "/intel/", "host": "https://goliath.tailfab45.ts.net",
       "kind": "webapp|mcp", "auth": "none|basic", "status": "online|offline",
       "mcp_functional": true} ], "source_ok": true },
    "speech": { "status": "healthy|offline", "wake_word_active": true,
       "active_timers": 0, "mcp_server": "online", "provider_ok": {...},
       "sidecar_ok": true, "source_ok": true },
    "goliath": { "cpu": {"util": 23.5, "load_1m": 8, "cores": 12, "threads": 24},
       "ram": {"used_gb": 32.1, "total_gb": 64.0, "pressure_pct": 50.2},
       "gpu": {"name": "RTX 4090", "util_pct": 12, "vram_used_gb": 8.2,
         "vram_total_gb": 24.0, "temp_c": 58, "power_w": 120},
       "verdict": "underutilized", "top_processes": [...],
       "gpu_apps": [ {"pid": 1234, "name": "python", "vram_gb": 6.1} ],
       "source_ok": true }
  },
  "source_health": {
    "fleet-registry": "ok", "fleet-agent": "ok", "github": "ok",
    "scheduled-tasks": "ok", "intel-hub": "ok", "discord": "offline",
    "email": "ok"
  }
}
```

Every section carries `source_ok` so the UI can show a gray/red chip per
section instead of failing the page. Every item carries its source - the
Control Tower aggregates, it never re-interprets.

## 5. UI design

### 5.1 Control Tower (`/control-tower`)

- Route `/control-tower`, sidebar item "Control Tower" (icon: `Radar` or `Gauge`).
- **Header:** generated_at, overall source-health row (green/amber/red dots per
  section), 30s auto-refresh toggle.
- **Section cards** (each a component with loading / empty / error states):
  1. **Services** - compact summary of the fleet grid (reuses Fleet.tsx visual
     language) with a link to the full **Services page** (`/services`).
  2. **Agents & Tasks** - Fritz status card (status, tools, uptime, recent log
     tail) + GitHub activity (CI runs, open PRs/issues, port audit).
  3. **Scheduled jobs** - cron/NSSM table with next/last run and an
     enabled/disabled toggle intent (read-only in v1).
  4. **HTTPS MCP** - which public Tailscale-funnel mounts are up and which are
     functional MCP endpoints (green = `initialize` answered).
  5. **Speech-MCP** - a functional card: alive dot + **wake-word listener
     active** toggle-state + active timers; red when wake listener is down.
  6. **Goliath PC** - live mini panel: CPU/RAM/GPU bars + verdict chip
     (choking / busy / underutilized / idle), link to the full **Goliath page**
     (`/goliath`).
  7. **Reports** - newest published digests/reports from the Intel Hub, open in
     new tab.
  8. **Discord** - recent activity feed (server/channel/summary), last 24h.
  9. **Email** - recent sent/received feed with subject/from, last 24h.
- **Activity timeline** at the bottom: merged, time-sorted stream of the most
  recent events across all sections (a "today at a glance" view).

### 5.2 Services page (`/services`) - naked `sc` + NSSM

- Route `/services`, own page. **The full Windows services view.**
- Table of every service: Name, State (Running/Stopped with color dot),
  StartMode (Auto/Manual/Disabled), PID, and a **NSSM badge** when
  `PathName` matches `nssm` (fleet-canonical classification). Naked = no badge.
- Filters: all / running / stopped, and **NSSM vs naked** toggle.
- Group header: `nssm_count`, `naked_count`, `running_count`.
- NSSM rows link to the managed app (best-effort: app name derived from the
  `nssm.exe` args / service name); restart/start/stop are **read-only in v1**
  (the fleet rule is NSSM services are managed via `sc.exe stop/start`, never
  by killing children - the page surfaces the `sc` command, it does not run it).

### 5.3 Goliath PC page (`/goliath`) - is it choking?

- Route `/goliath`, own page. One screen: **CPU, GPU, RAM, and what is running
  right now.**
- **CPU panel**: total util + per-core bars, load average, CPU-bound top
  processes (name, pid, cpu%).
- **RAM panel**: used/total GB, pressure %; flag when >85% (pressure) or
  when pagefile is being hit.
- **GPU panel** (RTX 4090 via `nvidia-smi`): util %, VRAM used/total, temp,
  power draw, and the **GPU compute-app list** (`query-compute-apps`): which
  process owns the GPU and how much VRAM.
- **Verdict chip**, computed from live thresholds:
  - `choking` - util sustained high (>85% CPU or GPU) AND temp > 85C or RAM
    > 90% - "Goliath is maxed out".
  - `busy` - util 50-85% or GPU compute apps present.
  - `underutilized` - util < 15% with GPU idle and RAM headroom - "the 4090 is
    bored".
  - `idle` - all quiet, nothing in top processes.
  - Verdict text is one honest sentence built from the numbers; the raw numbers
    are always shown next to it.
- **"What does it do right now?"** panel: top CPU + GPU processes with a one-line
  note (e.g. "python 22% - likely an MCP inference job; nvidia-smi shows
  `python (pid 4421)` on the 4090").

Data-testid: `control-tower`, `ct-services`, `ct-agents`, `ct-crons`,
`ct-https-mcp`, `ct-speech`, `ct-goliath`, `ct-reports`, `ct-discord`,
`ct-email`, `ct-timeline`, `services-page`, `services-nssm-badge`,
`goliath-page`, `goliath-cpu`, `goliath-ram`, `goliath-gpu`, `goliath-verdict`.

## 6. Registry addition (crons)

New `mcp-central-docs/operations/scheduled-tasks.json`:

```json
{
  "version": 1,
  "items": [
    {"id": "aiwatcher-morning", "name": "AIWatcher morning digest",
     "owner_repo": "aiwatcher-mcp", "schedule": "daily 07:00 Europe/Vienna",
     "type": "scheduled-task", "installer": "scripts/install_morning_task.ps1",
     "enabled": true, "last_run": null, "notes": ""}
  ]
}
```

Seeded in Phase 2 with the known jobs; NSSM services discovered at probe time
(`sc query state= all`) are surfaced read-only. A `scripts/sync-scheduled-tasks.ps1`
keeps `last_run`/`enabled` fresh.

## 7. Phases

| Phase | Scope | Verify |
|-------|-------|--------|
| **1 - Core page + services** | `control_tower.py` shell + `/api/control-tower` returning services (reuse `build_fleet_overview`) + ControlTower.tsx with Services section + source-health header. | `just ci` green; page renders with a live fleet |
| **2 - Windows services + Goliath PC** | `Win32_Service` enumeration (NSSM classification) + `psutil`/`nvidia-smi` fan-out; **Services page** (`/services`) + **Goliath page** (`/goliath`) with verdict. | pages render real service list + live CPU/GPU/RAM; NSSM badge correct |
| **3 - Agents, tasks, crons** | fleet-agent + gitops/gh fan-out; `scheduled-tasks.json` registry + probe; Agents & Tasks + Scheduled Jobs sections. | sections render; offline sources show gray chips |
| **4 - HTTPS MCP + speech** | `tailscale serve status` + JSON-RPC `initialize` probe; speech-mcp health fan-out; HTTPS-MCP + Speech-MCP cards. | public mounts enumerated; wake-word state truthful |
| **5 - Reports + Discord + email** | Intel Hub index, discord-mcp, email-mcp fan-out; Reports/Discord/Email sections + merged timeline. | feeds show real recent activity |
| **6 - Migration kit** | `control_tower.py` audit for zero VLA imports; porting doc; mount in meta_mcp behind a flag (dual-run, then cut over). | meta_mcp serves same payload |

Each phase ships independently and is `just ci`-green before the next.

## 8. Honesty & anti-fabrication rules

1. **Fail-soft, never fake.** A dead source renders a gray chip with the error
   text - no placeholder rows, no invented digests.
2. **Aggregate, don't re-interpret.** Each item keeps its source + raw summary;
   the tower never rewrites a Discord message or an email subject into a claim
   the source did not make.
3. **Staleness is visible.** Every section shows `source_ok` + last-updated;
   cached data is labeled with its generation time.
4. **No telemetry out.** All probes are localhost-to-localhost; nothing leaves
   the machine.
5. **Credentials never transit the tower.** Discord/email secrets stay in their
   own servers; VLA only reads their REST activity endpoints.
6. **The Goliath verdict is derived, not dressed up.** `choking`/`busy`/
   `underutilized`/`idle` come from explicit thresholds over the raw numbers
   that are always displayed alongside the verdict; the "what is it doing"
   note names real processes from psutil/nvidia-smi.
7. **NSSM is classified, not guessed.** A service is NSSM only when its
   `Win32_Service.PathName` matches `nssm` (the fleet-canonical rule). The
   Services page is **read-only in v1** - it surfaces the correct `sc.exe
   stop/start` command for NSSM services (never kill-by-PID), and does not
   execute service changes.
8. **HTTPS-MCP is verified, not assumed.** A funnel mount is only marked
   "functional MCP" after a real JSON-RPC `initialize` handshake over HTTPS;
   a mount that serves a webapp (not `/mcp`) is labeled `webapp`.

## 9. Migration to meta_mcp (later)

`meta_mcp` is the fleet-ops server (probes, diagnostics, lifecycle). When it
matures its own webapp, the Control Tower moves there: copy `control_tower.py`
(no VLA imports by construction), mount `GET /api/control-tower`, point the
VLA page at the new URL behind an env flag, then cut over. The registries and
payload contract are unchanged - that is the migration contract.
