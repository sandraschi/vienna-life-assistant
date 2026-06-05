# Vienna Life Assistant (ViLife)

Human carrier MCP for Sandra's Vienna life admin — calendar, todos, expenses, shopping, morning brief.

## Tools

- `vienna_life(operation=...)` — portmanteau: `calendar_today`, `todo_list`, `expense_summary`, `shopping_list`, `life_brief`, `fleet_overview`, `health`, `help`
- `vienna_life_agentic(goal)` — multi-step life plan via MCP sampling (SEP-1577)
- `vienna_tips(category)` — Vienna culture tips (coffee, music, museum)

## Prompts

- `life_brief_request` — morning brief template
- `vienna_day_plan` — plan a Vienna day

## Vienna skill pack (skill://…/SKILL.md)

| Skill | Topic |
|-------|--------|
| `vienna-life` | This file — overview |
| `vienna-alsergrund` | 9th district anchors |
| `vienna-transit` | U4, trams, gtfs-mcp |
| `vienna-kaffeehaus` | Coffee culture |
| `vienna-kultur` | Museums & concerts |
| `vienna-shopping` | Spar/Billa |

## Resources

- `resource://vienna-life/capabilities`
- `resource://vienna-life/quickstart`

## Fleet

- HTTP MCP: `http://127.0.0.1:10922/mcp`
- `fleet_call(server="vienna-life", tool="vienna_life", arguments={"operation": "life_brief"})`
