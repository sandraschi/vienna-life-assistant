"""Test fixtures — isolate ViLife DB into a temp file per test session."""

from __future__ import annotations

import os
import sys
from pathlib import Path

import pytest

# Point the DB at a temp location BEFORE importing the app modules.
_here = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(_here))


@pytest.fixture(scope="session", autouse=True)
def _isolated_db(tmp_path_factory):
    db_path = tmp_path_factory.mktemp("vilife") / "test.db"
    os.environ["VILIFE_DB_PATH"] = str(db_path)
    yield db_path
    os.environ.pop("VILIFE_DB_PATH", None)
    from vienna_life_assistant.db import engine

    engine.dispose()


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
