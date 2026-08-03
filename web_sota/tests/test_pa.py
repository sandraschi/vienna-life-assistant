"""PA engine + agent loop tests — LLM calls mocked for determinism."""

from __future__ import annotations

from vienna_life_assistant import life_db, pa_agent
from vienna_life_assistant.models import JournalEntry


def life_db_add(db, i: int, title: str, body: str) -> None:
    life_db.add_row(
        db,
        JournalEntry,
        {"date": f"2026-07-{i + 1:02d}", "title": title, "body": body, "mood": 7},
    )


# --- Alerts + context (deterministic, no LLM) --------------------------------


def test_pa_alerts_include_calendar(db):
    from vienna_life_assistant.pa_routes import pa_alerts

    alerts = pa_alerts(db)
    assert any(a["domain"] == "calendar" for a in alerts)
    for a in alerts:
        assert a["level"] in ("info", "warn")
        assert a["text"]


def test_pa_context_shape(db):
    from vienna_life_assistant.pa_routes import pa_context

    ctx = pa_context(db)
    for key in (
        "date",
        "weekday",
        "calendar_today",
        "todos_open",
        "active_medications",
        "trips",
        "expenses_month_eur",
        "journal_streak",
    ):
        assert key in ctx


def test_context_markdown_has_headings(db):
    from vienna_life_assistant.pa_routes import context_markdown

    md = context_markdown(db)
    assert "Today is" in md
    assert "## Calendar today" in md


# --- Brief state --------------------------------------------------------------


def test_pa_refresh_without_llm_falls_back(client, monkeypatch):
    monkeypatch.setattr(pa_agent, "resolve_llm", lambda: None)
    r = client.post("/api/pa/refresh")
    assert r.status_code == 200
    body = r.json()
    assert body["ok"] is True
    assert body["date"]  # today
    assert body["brief"]  # fallback brief
    assert "(No LLM detected" in body["brief"]
    assert body["llm"] is False


def test_pa_state_endpoint(client):
    r = client.get("/api/pa/state")
    assert r.status_code == 200
    assert "brief" in r.json()


def test_pa_ask_requires_question(client):
    r = client.post("/api/pa/ask", json={})
    assert r.status_code == 200
    assert r.json()["ok"] is False


def test_pa_ask_answers_with_mocked_llm(client, monkeypatch):
    monkeypatch.setattr(
        pa_agent, "answer_question", lambda q, ctx: f"Answer about: {q}"
    )
    r = client.post("/api/pa/ask", json={"question": "next doctor visit?"})
    assert r.status_code == 200
    assert r.json()["answer"] == "Answer about: next doctor visit?"


# --- Agent loop ---------------------------------------------------------------


def test_pa_chat_requires_messages(client):
    r = client.post("/api/pa/chat", json={"messages": []})
    assert r.status_code == 200
    assert r.json()["ok"] is False


def test_run_agent_no_llm_is_graceful(monkeypatch):
    monkeypatch.setattr(pa_agent, "resolve_llm", lambda: None)
    result = pa_agent.run_agent([{"role": "user", "content": "hi"}])
    # run_agent is async — exercise via asyncio in the test
    import asyncio

    result = asyncio.run(result)
    assert result["ok"] is False
    assert "LLM" in result["error"]


def test_run_agent_executes_tool_and_reflects(monkeypatch, db):
    """LLM issues todo_add; the loop must execute it in the real DB."""
    import asyncio

    calls = {"n": 0}

    def fake_resolve():
        return {
            "url_base": "http://mock",
            "model": "m",
            "headers": {},
            "provider": "ollama",
        }

    def fake_chat_message(url_base, payload, headers, timeout=90):
        calls["n"] += 1
        if calls["n"] == 1:
            return {
                "role": "assistant",
                "content": "",
                "tool_calls": [
                    {
                        "id": "call_1",
                        "function": {
                            "name": "vienna_life__todo_add",
                            "arguments": '{"title": "PA test todo"}',
                        },
                    }
                ],
            }
        return {"role": "assistant", "content": "Done — todo added."}

    monkeypatch.setattr(pa_agent, "resolve_llm", fake_resolve)
    monkeypatch.setattr(pa_agent, "_chat_message", fake_chat_message)

    result = asyncio.run(
        pa_agent.run_agent(
            [{"role": "user", "content": "Add a todo"}], max_iterations=3
        )
    )
    assert result["ok"] is True
    assert result["tool_calls"] == 1
    assert result["trace"][0]["tool"] == "vienna_life__todo_add"
    assert result["response"] == "Done — todo added."

    from vienna_life_assistant import life_db
    from vienna_life_assistant.models import Todo

    titles = [t.title for t in life_db.list_rows(db, Todo)]
    assert "PA test todo" in titles


def test_run_agent_tool_error_feeds_back(monkeypatch):
    import asyncio

    calls = {"n": 0}

    def fake_resolve():
        return {
            "url_base": "http://mock",
            "model": "m",
            "headers": {},
            "provider": "ollama",
        }

    def fake_chat_message(url_base, payload, headers, timeout=90):
        calls["n"] += 1
        if calls["n"] == 1:
            return {
                "role": "assistant",
                "content": "",
                "tool_calls": [
                    {
                        "id": "call_1",
                        "function": {
                            "name": "vienna_life__nonsense",
                            "arguments": "{}",
                        },
                    }
                ],
            }
        return {"role": "assistant", "content": "unknown tool"}

    monkeypatch.setattr(pa_agent, "resolve_llm", fake_resolve)
    monkeypatch.setattr(pa_agent, "_chat_message", fake_chat_message)

    result = asyncio.run(
        pa_agent.run_agent([{"role": "user", "content": "x"}], max_iterations=2)
    )
    assert result["ok"] is True
    assert result["trace"][0]["result"]["success"] is False


def test_execute_tool_event_add(monkeypatch, db):
    import asyncio

    result = asyncio.run(
        pa_agent.execute_tool(
            "vienna_life__event_add",
            {"date_str": "2026-12-24", "title": "Christmas market", "time": "17:00"},
        )
    )
    assert result["success"] is True
    assert result["event"]["category"] == "general"


# --- Journal RAG --------------------------------------------------------------


def _fake_embed(text: str) -> list[float]:
    """Deterministic keyword vector for tests."""
    keys = ["coffee", "Sacher", "Benny", "Salzburg"]
    return [1.0 if k.lower() in text.lower() else 0.0 for k in keys] + [0.5]


def test_rag_semantic_search_ranks_by_similarity(db, monkeypatch):
    from vienna_life_assistant import rag

    monkeypatch.setattr(rag, "embed", _fake_embed)
    for i, (title, body) in enumerate(
        [
            ("Coffee day", "Melange at Café Berg with Ingrid"),
            ("Sacher quest", "torte at the hotel"),
            ("Benny walk", "Donaukanal morning walk"),
        ]
    ):
        life_db_add(db, i, title, body)

    hits = rag.semantic_search(db, "coffee with Ingrid", limit=2)
    assert hits and hits[0]["title"] == "Coffee day"
    assert hits[1]["title"] != "Coffee day"
    assert hits[0]["score"] > hits[1]["score"]


def test_rag_reindex_embeds_all(db, monkeypatch):
    from vienna_life_assistant import rag

    monkeypatch.setattr(rag, "embed", _fake_embed)
    n1 = rag.reindex_all(db)
    assert n1 >= 1
    # force re-embed re-embeds everything; the lazy pass finds nothing new
    n2 = rag.ensure_indexed(db)
    assert n2 == 0


def test_rag_api_search_and_reindex(client, monkeypatch):
    from vienna_life_assistant import rag

    monkeypatch.setattr(rag, "embed", _fake_embed)
    r = client.post("/api/pa/rag/reindex")
    assert r.status_code == 200
    assert r.json()["ok"] is True
    r = client.get("/api/pa/rag/search?q=coffee")
    assert r.status_code == 200
    assert "entries" in r.json()


def test_pa_ask_injects_journal_memory(client, monkeypatch):
    from vienna_life_assistant import pa_agent, rag

    seen = {}

    def fake_answer(question, ctx):
        seen["ctx"] = ctx
        return "yes"

    monkeypatch.setattr(
        rag,
        "semantic_search",
        lambda db, q, limit=3: (
            [{"date": "2026-07-01", "title": "Coffee day", "body": "Café Berg"}] * 2
        ),
    )
    monkeypatch.setattr(pa_agent, "answer_question", fake_answer)
    r = client.post("/api/pa/ask", json={"question": "coffee with Ingrid?"})
    assert r.status_code == 200
    assert r.json()["ok"] is True
    assert "Journal memory" in seen["ctx"]
    assert len(r.json()["memory"]) == 2


# --- Proactive brief email ----------------------------------------------------


def test_brief_email_sent_when_enabled(client, monkeypatch):
    from vienna_life_assistant import pa_agent
    from vienna_life_assistant import email_routes

    sent = {}

    def fake_em(url, params=None, json_body=None, method="GET"):
        if url == "/api/send":
            sent.update(json_body or {})
            return {"ok": True, "message": "sent"}
        return {"ok": True}

    monkeypatch.setenv("PA_BRIEF_EMAIL", "1")
    monkeypatch.setenv("PA_BRIEF_RECIPIENT", "sandra@example.at")
    monkeypatch.setattr(
        pa_agent, "generate_brief", lambda ctx: "## Brief\n\nAll good today."
    )
    monkeypatch.setattr(pa_agent, "resolve_llm", lambda: None)
    monkeypatch.setattr(email_routes, "_em", fake_em)

    r = client.post("/api/pa/refresh")
    assert r.status_code == 200
    assert sent.get("to") == "sandra@example.at"
    assert "ViLife brief" in sent.get("subject", "")
    assert "All good today" in sent.get("body", "")


def test_brief_email_skipped_when_disabled(client, monkeypatch):
    from vienna_life_assistant import pa_agent
    from vienna_life_assistant import email_routes

    called = {"n": 0}

    def fake_em(url, params=None, json_body=None, method="GET"):
        called["n"] += 1
        return {"ok": True}

    monkeypatch.setenv("PA_BRIEF_EMAIL", "0")
    monkeypatch.setattr(pa_agent, "generate_brief", lambda ctx: "brief")
    monkeypatch.setattr(pa_agent, "resolve_llm", lambda: None)
    monkeypatch.setattr(email_routes, "_em", fake_em)
    client.post("/api/pa/refresh")
    assert called["n"] == 0


# --- Fleet orchestration (ednaficator-style) ----------------------------------


def test_run_agent_executes_fleet_call(monkeypatch):
    """LLM issues fleet_call -> the loop calls the remote MCP server."""
    import asyncio

    from vienna_life_assistant import fleet_mcp

    calls = {"n": 0}
    captured = {}

    def fake_resolve():
        return {
            "url_base": "http://mock",
            "model": "m",
            "headers": {},
            "provider": "ollama",
        }

    def fake_chat_message(url_base, payload, headers, timeout=90):
        calls["n"] += 1
        if calls["n"] == 1:
            return {
                "role": "assistant",
                "content": "",
                "tool_calls": [
                    {
                        "id": "call_f",
                        "function": {
                            "name": "fleet_call",
                            "arguments": '{"server": "aiwatcher-mcp", "tool": "get_top_items", "arguments": {"limit": 2}}',
                        },
                    }
                ],
            }
        return {"role": "assistant", "content": "Fetched."}

    def fake_call_tool(server, tool, arguments):
        captured.update(server=server, tool=tool, arguments=arguments)
        return {"success": True, "text": "items"}

    monkeypatch.setattr(pa_agent, "resolve_llm", fake_resolve)
    monkeypatch.setattr(pa_agent, "_chat_message", fake_chat_message)
    monkeypatch.setattr(fleet_mcp, "call_tool", fake_call_tool)

    result = asyncio.run(
        pa_agent.run_agent([{"role": "user", "content": "news?"}], max_iterations=2)
    )
    assert result["ok"] is True
    assert captured == {
        "server": "aiwatcher-mcp",
        "tool": "get_top_items",
        "arguments": {"limit": 2},
    }
    assert result["trace"][0]["tool"] == "fleet_call"


def test_fleet_allowlist_enforced():
    import asyncio

    result = asyncio.run(
        pa_agent.execute_tool(
            "fleet_call",
            {"server": "not-a-server", "tool": "x", "arguments": {}},
        )
    )
    assert result["success"] is False
    assert "ALLOWLIST" in result["error"]


def test_fleet_rpc_graceful_offline(monkeypatch):
    from vienna_life_assistant import fleet_mcp

    monkeypatch.setitem(
        fleet_mcp.FLEET_SERVERS, "gtfs-mcp", {"port": 1, "path": "/mcp", "purpose": "x"}
    )
    assert fleet_mcp.list_tools("gtfs-mcp") == []


def test_fleet_tools_offline_error(monkeypatch):
    import asyncio

    from vienna_life_assistant import fleet_mcp

    monkeypatch.setitem(
        fleet_mcp.FLEET_SERVERS, "plex-mcp", {"port": 1, "path": "/mcp", "purpose": "x"}
    )
    result = asyncio.run(pa_agent.execute_tool("fleet_tools", {"server": "plex-mcp"}))
    assert result["success"] is False
    assert "offline" in result["error"]


def test_fritz_status_graceful_offline(monkeypatch):
    from vienna_life_assistant import fleet_mcp

    monkeypatch.setenv("DEVICES_MCP_URL", "http://127.0.0.1:1")
    r = fleet_mcp.fritz_status()
    assert r["success"] is False
    assert "Fritz" in r["error"]


# --- Onboarding ---------------------------------------------------------------


def test_onboarding_not_onboarded_by_default(client):
    r = client.get("/api/onboarding/status")
    assert r.status_code == 200
    body = r.json()
    assert body["ok"] is True
    assert body["onboarded"] is False
    assert "mock_data_note" in body


def test_onboarding_profile_and_complete(client):
    r = client.post(
        "/api/onboarding/profile", json={"first_name": "Sandra", "city": "Wien"}
    )
    assert r.status_code == 200
    assert r.json()["profile"]["first_name"] == "Sandra"
    assert r.json()["profile"]["city"] == "Wien"

    r = client.post("/api/onboarding/complete")
    assert r.status_code == 200
    assert r.json()["profile"]["onboarded"] is True
    assert r.json()["profile"]["onboarded_at"]

    r = client.get("/api/onboarding/status")
    assert r.json()["onboarded"] is True


def test_onboarding_pet_creates_care_event(client):
    r = client.post(
        "/api/onboarding/pet",
        json={
            "pet_name": "Benny",
            "event_type": "grooming",
            "next_due": "2026-08-20",
            "notes": "fur trim",
        },
    )
    assert r.status_code == 200
    assert r.json()["pet_name"] == "Benny"

    from vienna_life_assistant import life_db
    from vienna_life_assistant.db import SessionLocal
    from vienna_life_assistant.models import PetCareEvent

    with SessionLocal() as db:
        events = life_db.list_rows(
            db, PetCareEvent, where=PetCareEvent.pet_name == "Benny"
        )
    assert any(e.event_type == "grooming" for e in events)
