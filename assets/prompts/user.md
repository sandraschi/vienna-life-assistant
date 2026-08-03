# Vienna Life Assistant — User Guide

This guide walks through the daily workflows ViLife supports. Everything you log
is stored locally in `web_sota/data/vilife.db` and is available to every agent
that connects to the MCP server on port 10922.

## 1. The morning brief

Ask any agent: "What does my day look like?" — it will call
`vienna_life(operation="life_brief")` and return:
- today's calendar events
- open todos
- month-to-date expenses
- active medications
- next doctor visit with follow-up date
- next trip with countdown
- birthdays in the next 14 days
- subscriptions renewing in the next 14 days

## 2. Calendar

- See today: `vienna_life(operation="calendar_today")`
- Add an event: `vienna_life(operation="event_add", date_str="2026-08-10", title="Zahnarzt", data={"time": "14:00", "location": "Alsergrund", "category": "health"})`
- Edit: pass the event id from the list plus the fields to change.
- Delete: `vienna_life(operation="event_delete", row_id=7)`

## 3. Health

**Doctor visits** — keep a log of every visit, diagnosis, and follow-up:
`vienna_health(operation="visits_add", data={"date": "2026-08-10", "doctor": "Dr. Musterhauser", "specialty": "Allgemeinmedizin", "reason": "Annual check-up", "follow_up_date": "2026-10-10"})`

**Medications** — track dose, schedule, and refill dates:
`vienna_health(operation="meds_add", data={"name": "Vitamin D3", "dose": "2000", "unit": "IE", "frequency": "1x daily", "times": "08:00", "with_food": true, "refill_date": "2026-09-20"})`

**Vitals** — record morning blood pressure/weight:
`vienna_health(operation="vitals_add", data={"systolic": 118, "diastolic": 76, "pulse": 64, "weight_kg": 63.5})`

## 4. Travel

**Trips** with countdown: `vienna_travel(operation="trips")`

**Plan one**: `vienna_travel(operation="trip_add", data={"title": "Salzburg weekend", "start_date": "2026-08-15", "end_date": "2026-08-17", "destination": "Salzburg", "mode": "train", "carrier": "ÖBB", "status": "planned"})`

**Packing**: list per trip, toggle items, add items:
`vienna_travel(operation="packing", trip_id=1)` → `vienna_travel(operation="packing_toggle", row_id=3)`

**Documents**: passport/insurance expiry — `vienna_travel(operation="expiring")`
warns you 120 days before anything lapses.

## 5. Contacts and birthdays

`vienna_contacts(operation="list")` — everyone you care about.
`vienna_contacts(operation="birthdays")` — who turns what age within 30 days.
`vienna_contacts(operation="add", data={"name": "Stefan", "phone": "+43 650 000000", "birthday": "1990-03-21", "relationship": "friend"})`

## 6. Household

**Subscriptions** — everything with a monthly cost and renewal date:
`vienna_household(operation="subscriptions")` returns the monthly total too.

**Home tasks** — smoke detector tests, filter changes, with recurring intervals:
`vienna_household(operation="task_add", data={"name": "Water filter change", "category": "Kitchen", "due_date": "2026-08-20", "frequency_days": 90})`

**Pet care** — vet visits, vaccinations, grooming with next-due dates:
`vienna_household(operation="pet_add", data={"event_type": "grooming", "next_due": "2026-08-15", "notes": "Fur trim"})`

## 7. Troubleshooting

- **Server not running**: `cd web_sota; .\start.ps1` (backend 10922, frontend 10988)
- **Empty data**: the first run seeds realistic demo content; afterwards it is
  all yours.
- **Agent says data missing**: confirm the MCP server is registered in the IDE
  pointing at `http://127.0.0.1:10922/mcp`.
- **DB reset**: stop the server, delete `web_sota/data/vilife.db`, restart —
  a fresh seed will be created.
