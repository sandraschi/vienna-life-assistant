"""Control Tower tests - pure logic + mocked subprocess/psutil, no real probes."""

from __future__ import annotations

import json
import types

import pytest

from vienna_life_assistant import control_tower as ct


@pytest.fixture(autouse=True)
def _fresh_ct_cache():
    ct._CACHE.clear()
    yield
    ct._CACHE.clear()


# ------------------------------------------------------------- nssm parsing


def test_nssm_app_extraction():
    assert (
        ct._nssm_app(r'"C:\nssm\nssm.exe" "D:\apps\server.py" arg1')
        == r"D:\apps\server.py"
    )
    assert ct._nssm_app(r"C:\nssm\nssm.exe D:\apps\server.py") == r"D:\apps\server.py"
    assert ct._nssm_app(r"C:\nssm\nssm.exe") is None


def test_windows_services_parses_and_classifies(monkeypatch):
    fake_json = json.dumps(
        [
            {
                "Name": "svc-naked",
                "DisplayName": "Naked service",
                "State": "Running",
                "StartMode": "Auto",
                "ProcessId": 100,
                "PathName": r"C:\bin\app.exe",
            },
            {
                "Name": "svc-nssm",
                "DisplayName": "NSSM service",
                "State": "Stopped",
                "StartMode": "Auto",
                "ProcessId": 0,
                "PathName": r'C:\nssm\nssm.exe "D:\apps\svc.py"',
            },
        ]
    )
    fake = types.SimpleNamespace(returncode=0, stdout=fake_json, stderr="")
    monkeypatch.setattr("subprocess.run", lambda *a, **k: fake)

    out = ct.windows_services(fresh=True)
    assert out["source_ok"] is True
    assert out["nssm_count"] == 1
    assert out["naked_count"] == 1
    assert out["running_count"] == 1

    nssm = next(i for i in out["items"] if i["nssm"])
    assert nssm["app_name"] == r"D:\apps\svc.py"
    assert nssm["state"] == "Stopped"

    naked = next(i for i in out["items"] if not i["nssm"])
    assert naked["app_name"] is None
    assert naked["pid"] == 100


def test_windows_services_handles_bad_output(monkeypatch):
    fake = types.SimpleNamespace(returncode=1, stdout="", stderr="boom")
    monkeypatch.setattr("subprocess.run", lambda *a, **k: fake)

    out = ct.windows_services(fresh=True)
    assert out["source_ok"] is False
    assert "boom" in out["error"]


def test_windows_services_single_row_is_not_a_list(monkeypatch):
    fake = types.SimpleNamespace(
        returncode=0,
        stdout=json.dumps(
            {
                "Name": "only",
                "DisplayName": "Only",
                "State": "Running",
                "StartMode": "Manual",
                "ProcessId": 5,
                "PathName": r"C:\bin\only.exe",
            }
        ),
        stderr="",
    )
    monkeypatch.setattr("subprocess.run", lambda *a, **k: fake)
    out = ct.windows_services(fresh=True)
    assert out["source_ok"] is True
    assert len(out["items"]) == 1
    assert out["items"][0]["name"] == "only"


# ---------------------------------------------------------------- verdict


def test_verdict_labels():
    idle = {"util": 2.0, "ram": {"pressure_pct": 20.0}}
    busy = {"util": 60.0, "ram": {"pressure_pct": 40.0}}
    under = {"util": 10.0, "ram": {"pressure_pct": 30.0}}
    choking = {"util": 92.0, "ram": {"pressure_pct": 95.0}}
    hot_gpu = {"util_pct": 99.0, "temp_c": 90.0}

    assert ct._verdict(idle, None)["label"] == "idle"
    assert ct._verdict(busy, None)["label"] == "busy"
    assert ct._verdict(under, None)["label"] == "underutilized"
    assert ct._verdict(choking, hot_gpu)["label"] == "choking"
    assert "CPU" in ct._verdict(busy, None)["reason"]


# -------------------------------------------------------------- aggregate


def test_build_control_tower_merges(monkeypatch):
    fake_services = {
        "summary": {"total": 2, "online": None, "quarantined": 0},
        "ships": [
            {"id": "a", "backend_port": 1111, "frontend_port": 0, "health": "unknown"}
        ],
    }
    fake_ws = {
        "items": [],
        "nssm_count": 0,
        "naked_count": 0,
        "running_count": 0,
        "source_ok": True,
    }
    fake_g = {"source_ok": True, "verdict": {"label": "idle", "reason": "quiet"}}

    monkeypatch.setattr(ct, "build_fleet_section", lambda *, probe: fake_services)
    monkeypatch.setattr(ct, "windows_services", lambda *, fresh=False: fake_ws)
    monkeypatch.setattr(ct, "goliath_stats", lambda *, fresh=False: fake_g)

    payload = ct.build_control_tower(probe=False, fresh=True)
    assert payload["services"] is fake_services
    assert payload["windows_services"] is fake_ws
    assert payload["goliath"] is fake_g
    assert payload["source_health"]["goliath"] == "ok"
    assert payload["source_health"]["windows-services"] == "ok"
    assert "generated_at" in payload
    assert payload["cached_for"] == ct.CACHE_TTL


# ----------------------------------------------------------------- routes


def test_control_tower_routes(client, monkeypatch):
    monkeypatch.setattr(
        ct, "build_control_tower", lambda *, probe=True, fresh=False: {"ok": True}
    )
    monkeypatch.setattr(ct, "windows_services", lambda *, fresh=False: {"items": []})
    monkeypatch.setattr(ct, "goliath_stats", lambda *, fresh=False: {"source_ok": True})

    r = client.get("/api/control-tower")
    assert r.status_code == 200
    assert r.json()["ok"] is True

    r = client.get("/api/services")
    assert r.status_code == 200
    assert r.json()["items"] == []

    r = client.get("/api/goliath")
    assert r.status_code == 200
    assert r.json()["source_ok"] is True
