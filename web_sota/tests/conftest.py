"""Test fixtures — isolate ViLife DB into a temp file per test session.

Env vars MUST be set at module level (not in a fixture): test modules import
vienna_life_assistant at collection time, which reads VILIFE_DB_PATH at import.
A fixture runs too late and the whole suite would write to the real DB.
"""

from __future__ import annotations

import os
import sys
import tempfile
from pathlib import Path

import pytest

# Point the DB at a temp location BEFORE any app module is imported.
_here = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(_here))

_TMP = Path(tempfile.mkdtemp(prefix="vilife-test-"))
os.environ["VILIFE_DB_PATH"] = str(_TMP / "test.db")
os.environ["PA_STATE_FILE"] = str(_TMP / "pa_state.json")
os.environ["PA_AUTOBRIEF"] = "0"  # no LLM calls from the scheduler in tests
os.environ["PA_BRIEF_EMAIL"] = "0"


def pytest_sessionfinish(session, exitstatus):
    from vienna_life_assistant.db import engine

    engine.dispose()
    for key in ("VILIFE_DB_PATH", "PA_STATE_FILE", "PA_AUTOBRIEF", "PA_BRIEF_EMAIL"):
        os.environ.pop(key, None)


@pytest.fixture(scope="session")
def db():
    from vienna_life_assistant.db import SessionLocal, init_db

    init_db()
    with SessionLocal() as session:
        yield session


@pytest.fixture(scope="session")
def client():
    from fastapi.testclient import TestClient
    from vienna_life_assistant.db import init_db
    from vienna_life_assistant.server import app

    init_db()
    with TestClient(app) as c:
        yield c
