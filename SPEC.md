# Fleet Control Tower - SPEC

**Status:** Spec - not implemented
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
view of crons or Discord/email activity anywhere**.

The Control Tower merges them into one dark-theme dashboard: **Services,
Agents & Tasks, Scheduled Jobs, Reports, Discord, Email**, plus a unified
**activity timeline**.

## 2. Verified data sources

All endpoints verified to exist in the fleet today (2026-08-19). Every source
is probed with a short timeout and **fail-soft** - a dead source renders a gray
"offline" chip, never blocks the page, never fakes data.

| Source | Endpoint | Port | Provides |
|--------|----------|------|----------|
| **Services** | VLA `GET /api/fleet/overview?probe=1` (reads `fleet-registry.json` + `webapp-registry.json`, async health probes) | 10922 | fleet of services: id, category, frontend/backend ports, health dot |
| **Agent (Fritz)** | `fleet-agent-mcp` `GET /api/status`, `GET /api/v1/diagnostics`, `GET /api/logs` | fleet-agent | agent health, identity, tool count, recent logs |
| **Tasks / CI / PRs** | `gitops` MCP `fleet_ops` (ci_pulse, port_audit, full_suite) + `gh` API | (gitops) | CI run status, open PRs/issues per repo, port audit |
| **Scheduled jobs** | NEW `mcp-central-docs/operations/scheduled-tasks.json` registry + best-effort `schtasks /query` + NSSM `sc query` probe | - | cron/NSSM jobs: id, schedule, owner, enabled, last run |
| **Reports / outputs** | Intel Reports Hub `GET /` index (fleet-intel-reports) | 11027 | published digest/report HTML (AIWatcher + Fritz), newest first |
| **Discord activity** | `discord-mcp` `GET /api/logs`, `GET /api/v1/stats/analytics`, `GET /api/health` | 10756 | recent server activity log, per-server/analytics stats |
| **Email activity** | `email-mcp` `GET /api/logs`, `GET /api/status`, `GET /api/v1/health` | 10813 | recent send/receive activity, account/status |

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
       "subject": "...", "from": "..."} ], "source_ok": true }
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

## 5. UI design (ControlTower.tsx)

- Route `/control-tower`, sidebar item "Control Tower" (icon: `Radar` or `Gauge`).
- **Header:** generated_at, overall source-health row (green/amber/red dots per
  section), 30s auto-refresh toggle.
- **Section cards** (each a component with loading / empty / error states):
  1. **Services** - grid of the fleet with health dots + category filter +
     one-click open (reuses Fleet.tsx visual language).
  2. **Agents & Tasks** - Fritz status card (status, tools, uptime, recent log
     tail) + GitHub activity (CI runs, open PRs/issues, port audit).
  3. **Scheduled jobs** - cron/NSSM table with next/last run and an
     enabled/disabled toggle intent (read-only in v1).
  4. **Reports** - newest published digests/reports from the Intel Hub, open in
     new tab.
  5. **Discord** - recent activity feed (server/channel/summary), filtered to
     the last 24h.
  6. **Email** - recent sent/received feed with subject/from, last 24h.
- **Activity timeline** at the bottom: merged, time-sorted stream of the most
  recent events across all sections (a "today at a glance" view).

Data-testid: `control-tower`, `ct-services`, `ct-agents`, `ct-crons`,
`ct-reports`, `ct-discord`, `ct-email`, `ct-timeline`, per-item `ct-*`.

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
| **2 - Agents, tasks, crons** | fleet-agent + gitops/gh fan-out; `scheduled-tasks.json` registry + probe; Agents & Tasks + Scheduled Jobs sections. | sections render; offline sources show gray chips |
| **3 - Reports + Discord + email** | Intel Hub index, discord-mcp, email-mcp fan-out; Reports/Discord/Email sections + merged timeline. | feeds show real recent activity |
| **4 - Migration kit** | `control_tower.py` audit for zero VLA imports; porting doc; mount in meta_mcp behind a flag (dual-run, then cut over). | meta_mcp serves same payload |

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

## 9. Migration to meta_mcp (later)

`meta_mcp` is the fleet-ops server (probes, diagnostics, lifecycle). When it
matures its own webapp, the Control Tower moves there: copy `control_tower.py`
(no VLA imports by construction), mount `GET /api/control-tower`, point the
VLA page at the new URL behind an env flag, then cut over. The registries and
payload contract are unchanged - that is the migration contract.
