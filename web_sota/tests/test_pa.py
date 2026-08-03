"""PA engine + agent loop tests — LLM calls mocked for determinism."""

from __future__ import annotations

from vienna_life_assistant import pa_agent


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
