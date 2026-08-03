"""MCP tool tests — portmanteau ops against the isolated DB.

The vienna_* tools are plain async functions (no Context required for the
read/write ops), so they are exercised directly.
"""

from __future__ import annotations

import asyncio


def run(coro):
    return asyncio.get_event_loop().run_until_complete(coro)


def test_all_portmanteaus_registered():
    from vienna_life_assistant.vienna_life_mcp import mcp

    names = {t.name for t in run(mcp.list_tools())}
    for expected in (
        "vienna_life",
        "vienna_health",
        "vienna_travel",
        "vienna_contacts",
        "vienna_household",
        "vienna_tips",
    ):
        assert expected in names, f"missing {expected}"


def test_vienna_life_health_op():
    from vienna_life_assistant.vienna_life_mcp import vienna_life

    res = run(vienna_life(operation="health"))
    assert res["success"] is True


def test_vienna_life_calendar_today():
    from vienna_life_assistant.vienna_life_mcp import vienna_life

    res = run(vienna_life(operation="calendar_today"))
    assert res["success"] is True
    assert isinstance(res["events"], list)


def test_vienna_life_event_add_and_delete():
    from vienna_life_assistant.vienna_life_mcp import vienna_life

    res = run(
        vienna_life(
            operation="event_add",
            date_str="2026-12-24",
            title="Christmas market",
            data={"time": "17:00", "category": "social"},
        )
    )
    assert res["success"] is True
    eid = res["event"]["id"]

    res = run(vienna_life(operation="event_delete", row_id=eid))
    assert res["success"] is True


def test_vienna_life_todo_add_toggle_delete():
    from vienna_life_assistant.vienna_life_mcp import vienna_life

    res = run(vienna_life(operation="todo_add", title="Test task"))
    tid = res["todo"]["id"]

    res = run(vienna_life(operation="todo_toggle", row_id=tid))
    assert res["todo"]["status"] == "done"

    res = run(vienna_life(operation="todo_delete", row_id=tid))
    assert res["success"] is True


def test_vienna_health_meds_and_add():
    from vienna_life_assistant.vienna_life_mcp import vienna_health

    res = run(vienna_health(operation="meds"))
    assert res["success"] is True
    assert res["items"] and all(m["active"] for m in res["items"])

    res = run(
        vienna_health(
            operation="visits_add",
            data={
                "date": "2026-09-01",
                "doctor": "Dr. Test",
                "specialty": "HNO",
                "reason": "Tinnitus",
            },
        )
    )
    assert res["success"] is True
    assert res["item"]["doctor"] == "Dr. Test"


def test_vienna_travel_trips_and_packing_toggle():
    from vienna_life_assistant.vienna_life_mcp import vienna_travel

    res = run(vienna_travel(operation="trips"))
    assert res["success"] is True
    assert res["items"]

    res = run(vienna_travel(operation="packing"))
    assert res["success"] is True
    item = next((i for i in res["items"] if not i["done"]), None)
    if item:
        res = run(vienna_travel(operation="packing_toggle", row_id=item["id"]))
        assert res["item"]["done"] is True


def test_vienna_contacts_birthdays():
    from vienna_life_assistant.vienna_life_mcp import vienna_contacts

    res = run(vienna_contacts(operation="birthdays"))
    assert res["success"] is True
    assert isinstance(res["items"], list)


def test_vienna_household_subscriptions_and_pet():
    from vienna_life_assistant.vienna_life_mcp import vienna_household

    res = run(vienna_household(operation="subscriptions"))
    assert res["success"] is True
    assert res["monthly_total_eur"] > 0

    res = run(vienna_household(operation="pet"))
    assert res["success"] is True

    res = run(
        vienna_household(
            operation="pet_add",
            data={"event_type": "walk", "date": "2026-08-05", "notes": "Morning round"},
        )
    )
    assert res["success"] is True


def test_unknown_operation_returns_error():
    from vienna_life_assistant.vienna_life_mcp import vienna_life

    res = run(vienna_life(operation="nonsense"))  # type: ignore[arg-type]
    assert res["success"] is False
    assert "error" in res
