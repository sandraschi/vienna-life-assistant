"""Life DB layer tests — seed, CRUD, and convenience aggregations."""

from __future__ import annotations

from vienna_life_assistant import life_db
from vienna_life_assistant.models import (
    CalendarEvent,
    Contact,
    DoctorVisit,
    Medication,
    Subscription,
    Trip,
)


def test_seed_populates_all_domains(db):
    assert len(life_db.list_rows(db, CalendarEvent)) >= 5
    assert len(life_db.list_rows(db, Medication)) >= 1
    assert len(life_db.list_rows(db, Trip)) >= 1
    assert len(life_db.list_rows(db, Contact)) >= 1
    assert len(life_db.list_rows(db, Subscription)) >= 1
    assert len(life_db.list_rows(db, DoctorVisit)) >= 1


def test_seed_is_idempotent(db):
    before = len(life_db.list_rows(db, CalendarEvent))
    life_db.seed_if_empty(db)
    assert len(life_db.list_rows(db, CalendarEvent)) == before


def test_add_update_delete_roundtrip(db):
    row = life_db.add_row(
        db, Contact, {"name": "Test Person", "relationship": "friend"}
    )
    assert row.id > 0
    assert row.name == "Test Person"

    updated = life_db.update_row(db, Contact, row.id, {"phone": "+43 1 2345678"})
    assert updated is not None
    assert updated.phone == "+43 1 2345678"

    assert life_db.delete_row(db, Contact, row.id) is True
    assert life_db.get_row(db, Contact, row.id) is None


def test_update_unknown_id_returns_none(db):
    assert life_db.update_row(db, Contact, 999999, {"name": "x"}) is None
    assert life_db.delete_row(db, Contact, 999999) is False


def test_active_medications_only(db):
    meds = life_db.active_medications(db)
    assert all(m["active"] for m in meds)


def test_expense_month_total_is_numeric(db):
    assert life_db.expense_month_total(db) >= 0


def test_next_trips_sorted_and_future(db):
    trips = life_db.next_trips(db, limit=5)
    dates = [t["start_date"] for t in trips]
    assert dates == sorted(dates)


def test_upcoming_birthdays_shape(db):
    hits = life_db.upcoming_birthdays(db, days=3650)
    for b in hits:
        assert "days_until" in b
        assert "age_turning" in b
