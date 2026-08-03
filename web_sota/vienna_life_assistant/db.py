"""SQLite persistence for ViLife — single source of truth for life data.

Replaces the static mock module (life_data.py) as the backing store. The
existing mock content becomes the seed dataset so the app is never empty.

DB file: web_sota/data/vilife.db (override with VILIFE_DB_PATH).
"""

from __future__ import annotations

import os
from pathlib import Path

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

_DEFAULT_DB = Path(__file__).resolve().parent.parent / "data" / "vilife.db"
DB_PATH = Path(os.environ.get("VILIFE_DB_PATH", str(_DEFAULT_DB)))


class Base(DeclarativeBase):
    """Declarative base for all ViLife models."""


engine = create_engine(
    f"sqlite:///{DB_PATH}",
    connect_args={"check_same_thread": False},
)
SessionLocal = sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)


def init_db() -> None:
    """Create tables (and seed first-run data)."""
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    # Import models so metadata is populated before create_all.
    import vienna_life_assistant.models  # noqa: F401

    Base.metadata.create_all(engine)
    from vienna_life_assistant.life_db import seed_if_empty

    with SessionLocal() as db:
        seed_if_empty(db)


def get_db():
    """FastAPI dependency — one session per request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
