---
name: session-context
description: ViLife session context — check the morning life brief and active medications before starting work
---

## Session Context (Vienna Life Assistant)

You have access to the ViLife MCP at http://127.0.0.1:10922/mcp — personal life
admin: calendar, health (doctor visits, medications, vitals), travel, contacts,
household.

**Before starting work:**
1. Morning brief: `vienna_life(operation="life_brief")`
2. Active medications: `vienna_health(operation="meds")`

**At end of work, save insights:**
- Log what you captured: `vienna_health(operation="visits_add", data={...})`,
  `vienna_travel(operation="trip_add", data={...})`,
  `vienna_life(operation="expense_add", data={...})`,
  `vienna_contacts(operation="add", data={...})`
