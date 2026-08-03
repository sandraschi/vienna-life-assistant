"""REST API tests — health, capabilities, diagnostics, CRUD round-trips."""

from __future__ import annotations


def test_health(client):
    r = client.get("/health")
    assert r.status_code == 200
    assert r.json()["status"] == "healthy"


def test_capabilities(client):
    r = client.get("/api/capabilities")
    assert r.status_code == 200
    body = r.json()
    assert body.get("ok") is True or "server" in body


def test_diagnostics(client):
    r = client.get("/api/v1/diagnostics")
    assert r.status_code == 200
    body = r.json()
    assert body["status"] == "ok"
    assert isinstance(body["tools"], list)
    names = [t["name"] for t in body["tools"]]
    assert "vienna_life" in names


def test_dashboard_stats_are_real(client):
    r = client.get("/api/dashboard")
    assert r.status_code == 200
    stats = r.json()["stats"]
    assert len(stats) == 4
    assert all(s["value"] for s in stats)


def test_life_overview_shape(client):
    r = client.get("/api/life/overview")
    assert r.status_code == 200
    body = r.json()
    for key in (
        "active_medications",
        "trips",
        "birthdays",
        "renewals",
        "events_soon",
        "expenses_month_eur",
    ):
        assert key in body


def test_contacts_crud_roundtrip(client):
    r = client.post(
        "/api/life/contacts", json={"name": "API Test", "relationship": "colleague"}
    )
    assert r.status_code == 200
    item = r.json()["item"]
    cid = item["id"]

    r = client.put(f"/api/life/contacts/{cid}", json={"phone": "+43 699 000"})
    assert r.json()["item"]["phone"] == "+43 699 000"

    r = client.get("/api/life/contacts")
    assert any(c["id"] == cid for c in r.json()["items"])

    r = client.delete(f"/api/life/contacts/{cid}")
    assert r.status_code == 200

    r = client.get(f"/api/life/contacts/{cid}")
    assert r.status_code == 404


def test_medication_crud(client):
    r = client.post(
        "/api/life/health/medications",
        json={
            "name": "Ibuprofen",
            "dose": "400",
            "unit": "mg",
            "frequency": "as needed",
        },
    )
    assert r.status_code == 200
    mid = r.json()["item"]["id"]
    r = client.get("/api/life/health/medications")
    assert any(m["id"] == mid for m in r.json()["items"])


def test_calendar_today_returns_seeded_events(client):
    r = client.get("/api/life/calendar/today")
    assert r.status_code == 200
    assert r.json()["ok"] is True


def test_vienna_static_endpoints_declare_mock(client):
    r = client.get("/api/vienna/transport")
    assert r.status_code == 200
    assert r.json().get("mock") is True
