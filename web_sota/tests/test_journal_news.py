"""Journal (personal log) + News (aiwatcher bridge) tests."""

from __future__ import annotations

from vienna_life_assistant import life_db
from vienna_life_assistant.models import JournalEntry


# --- Journal: DB layer -------------------------------------------------------


def test_journal_seeded(db):
    assert len(life_db.list_rows(db, JournalEntry)) >= 3


def test_journal_streak_counts_consecutive_days(db):
    streak = life_db.journal_streak(db)
    assert streak >= 1  # seed includes today + yesterday


def test_journal_on_this_day_returns_previous_years(db):
    # Seed has no Aug-03 previous-year entry; add one and re-check.
    life_db.add_row(
        db,
        JournalEntry,
        {
            "date": "2025-08-03",
            "title": "Last year on this day",
            "body": "…",
            "mood": 7,
        },
    )
    hits = life_db.journal_on_this_day(db)
    assert any("2025-08-03" == e["date"] for e in hits)


def test_journal_search_matches_title_and_tags(db):
    life_db.add_row(
        db,
        JournalEntry,
        {
            "date": "2026-08-02",
            "title": "Sacher torte quest",
            "body": "",
            "tags": "coffee,desert",
        },
    )
    assert len(life_db.journal_search(db, "sacher")) >= 1
    assert len(life_db.journal_search(db, "desert")) >= 1
    assert life_db.journal_search(db, "") == []


def test_journal_crud_roundtrip(db):
    row = life_db.add_row(
        db,
        JournalEntry,
        {"date": "2026-08-01", "title": "CRUD", "body": "x", "mood": 5},
    )
    assert row.id > 0
    updated = life_db.update_row(db, JournalEntry, row.id, {"mood": 9})
    assert updated is not None and updated.mood == 9
    assert life_db.delete_row(db, JournalEntry, row.id) is True


# --- Journal: REST -----------------------------------------------------------


def test_journal_api_today_and_streak(client):
    r = client.get("/api/life/logs/streak")
    assert r.status_code == 200
    assert r.json()["streak"] >= 1
    r = client.get("/api/life/logs/today")
    assert r.status_code == 200
    assert r.json()["ok"] is True


def test_journal_api_crud_and_search(client):
    r = client.post(
        "/api/life/logs",
        json={
            "date": "2026-08-03",
            "title": "API journal",
            "body": "integration test",
            "mood": 6,
            "tags": "test",
        },
    )
    assert r.status_code == 200
    eid = r.json()["item"]["id"]
    r = client.get("/api/life/logs/search?q=integration")
    assert r.status_code == 200
    assert any(e["id"] == eid for e in r.json()["entries"])
    r = client.delete(f"/api/life/logs/{eid}")
    assert r.status_code == 200


# --- News: aiwatcher bridge --------------------------------------------------


def test_news_overview_shape(client):
    r = client.get("/api/news/overview")
    assert r.status_code == 200
    body = r.json()
    assert "upstream_ok" in body
    assert isinstance(body.get("top"), list)
    assert isinstance(body.get("trends"), list)
    assert isinstance(body.get("morning"), list)


def test_news_search_requires_query(client):
    r = client.get("/api/news/search")
    assert r.status_code == 422


def test_news_bridge_tolerates_unreachable_upstream(monkeypatch):
    from vienna_life_assistant import news_routes

    monkeypatch.setattr(
        news_routes, "AIWATCHER_URL", "http://127.0.0.1:1"
    )  # nothing listens here
    payload = news_routes._aw("/api/stats")
    assert payload.get("ok") is False
    assert "error" in payload


# --- Notes: onenote-mcp bridge -----------------------------------------------


def test_notes_status_reports_unreachable(monkeypatch):
    from vienna_life_assistant import notes_routes

    monkeypatch.setattr(notes_routes, "ONENOTE_MCP_URL", "http://127.0.0.1:1")
    payload = notes_routes._on("/api/auth/status")
    assert payload.get("ok") is False
    assert "error" in payload


def test_notes_export_journal_missing_entry(client):
    r = client.post("/api/notes/export-journal", json={"entry_id": 999999})
    assert r.status_code == 200
    assert r.json()["ok"] is False
    assert "not found" in r.json()["error"]


def test_notes_export_journal_unreachable_is_graceful(client, monkeypatch):
    from vienna_life_assistant import notes_routes

    monkeypatch.setattr(notes_routes, "ONENOTE_MCP_URL", "http://127.0.0.1:1")
    r = client.post("/api/notes/export-journal", json={"entry_id": 1})
    assert r.status_code == 200
    assert r.json()["ok"] is False
    assert "onenote" in r.json()["error"].lower()


def test_notes_export_journal_success(client, monkeypatch):
    from vienna_life_assistant import notes_routes

    def fake_on(url, params=None, json_body=None, method="GET"):
        if url == "/api/notebooks":
            return {
                "ok": True,
                "notebooks": [{"id": "nb1", "display_name": "ViLife Journal"}],
            }
        if url == "/api/pages":
            assert json_body is not None
            return {
                "ok": True,
                "page": {"id": "pg1", "title": json_body.get("title", "")},
            }
        return {"ok": True}

    monkeypatch.setattr(notes_routes, "_on", fake_on)
    r = client.post("/api/notes/export-journal", json={"entry_id": 1})
    assert r.status_code == 200
    body = r.json()
    assert body["ok"] is True
    assert "ViLife Journal" in body["message"]
    assert body["page"] is not None
    assert body["page"]["id"] == "pg1"
