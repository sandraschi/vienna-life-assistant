"""CRUD services + first-run seed for ViLife life domains.

Generic row helpers keep the per-domain surface thin: the MCP portmanteaus
and REST routers both call into these functions — one behavior, two surfaces.
"""

from __future__ import annotations

import logging
from datetime import date, timedelta
from typing import Any, TypeVar

from sqlalchemy import select
from sqlalchemy.orm import Session

from vienna_life_assistant.db import Base, SessionLocal
from vienna_life_assistant.models import (
    CalendarEvent,
    Contact,
    DoctorVisit,
    Expense,
    HomeTask,
    MedicalCondition,
    Medication,
    PackingItem,
    PetCareEvent,
    Subscription,
    Todo,
    TravelDocument,
    Trip,
    Vitals,
    BaseMixin,
)

ModelT = TypeVar("ModelT", bound=BaseMixin)

logger = logging.getLogger("vienna-life-assistant.db")

# --- Generic row helpers ----------------------------------------------------


def list_rows(
    db: Session,
    model: type[ModelT],
    order_by=None,
    limit: int = 200,
    where=None,
) -> list[ModelT]:
    stmt = select(model)
    if where is not None:
        stmt = stmt.where(where)
    if order_by is not None:
        stmt = stmt.order_by(order_by)
    return list(db.execute(stmt.limit(limit)).scalars().all())


def get_row(db: Session, model: type[ModelT], row_id: int) -> ModelT | None:
    return db.get(model, row_id)


def add_row(db: Session, model: type[ModelT], data: dict[str, Any]) -> ModelT:
    row = model(**{k: v for k, v in data.items() if hasattr(model, k)})
    db.add(row)
    db.commit()
    db.refresh(row)
    return row


def update_row(
    db: Session, model: type[ModelT], row_id: int, data: dict[str, Any]
) -> ModelT | None:
    row = db.get(model, row_id)
    if row is None:
        return None
    for k, v in data.items():
        if hasattr(row, k) and k != "id":
            setattr(row, k, v)
    db.commit()
    db.refresh(row)
    return row


def delete_row(db: Session, model, row_id: int) -> bool:
    row = db.get(model, row_id)
    if row is None:
        return False
    db.delete(row)
    db.commit()
    return True


def with_session(fn):
    """Run fn(db, ...) in its own session — for MCP tool call sites."""

    def wrapper(*args, **kwargs):
        with SessionLocal() as db:
            return fn(db, *args, **kwargs)

    return wrapper


# --- Domain conveniences ----------------------------------------------------


def upcoming_events(db: Session, days: int = 30) -> list[dict]:
    today = date.today().isoformat()
    horizon = (date.today() + timedelta(days=days)).isoformat()
    rows = list_rows(
        db,
        CalendarEvent,
        order_by=CalendarEvent.date,
        where=CalendarEvent.date >= today,
    )
    return [r.to_dict() for r in rows if r.date <= horizon and not r.done]


def active_medications(db: Session) -> list[dict]:
    return [
        r.to_dict()
        for r in list_rows(db, Medication, where=Medication.active.is_(True))
    ]


def upcoming_birthdays(db: Session, days: int = 30) -> list[dict]:
    """Contacts whose birthday (month-day) falls within the next N days."""
    today = date.today()
    hits: list[dict] = []
    for c in list_rows(db, Contact, order_by=Contact.name):
        if not c.birthday:
            continue
        try:
            bd = date.fromisoformat(c.birthday)
        except ValueError:
            continue
        try:
            next_bd = bd.replace(year=today.year)
        except ValueError:  # Feb 29
            next_bd = bd.replace(year=today.year, day=28)
        if next_bd < today:
            try:
                next_bd = next_bd.replace(year=today.year + 1)
            except ValueError:
                next_bd = next_bd.replace(year=today.year + 1, day=28)
        delta = (next_bd - today).days
        if 0 <= delta <= days:
            d = c.to_dict()
            d["days_until"] = delta
            d["age_turning"] = next_bd.year - bd.year
            hits.append(d)
    return sorted(hits, key=lambda x: x["days_until"])


def next_trips(db: Session, limit: int = 5) -> list[dict]:
    today = date.today().isoformat()
    return [
        r.to_dict()
        for r in list_rows(
            db, Trip, order_by=Trip.start_date, where=Trip.start_date >= today
        )[:limit]
    ]


def expiring_documents(db: Session, days: int = 120) -> list[dict]:
    today = date.today().isoformat()
    horizon = (date.today() + timedelta(days=days)).isoformat()
    return [
        r.to_dict()
        for r in list_rows(
            db,
            TravelDocument,
            order_by=TravelDocument.expiry_date,
            where=TravelDocument.expiry_date >= today,
        )
        if r.expiry_date <= horizon
    ]


def renewals_soon(db: Session, days: int = 30) -> list[dict]:
    today = date.today().isoformat()
    horizon = (date.today() + timedelta(days=days)).isoformat()
    return [
        r.to_dict()
        for r in list_rows(
            db,
            Subscription,
            order_by=Subscription.renewal_date,
            where=Subscription.renewal_date >= today,
        )
        if r.renewal_date <= horizon
    ]


def overdue_home_tasks(db: Session) -> list[dict]:
    today = date.today().isoformat()
    return [
        r.to_dict()
        for r in list_rows(db, HomeTask, order_by=HomeTask.due_date)
        if r.due_date <= today and not r.done
    ]


def expense_month_total(db: Session, period: str = "month") -> float:
    from datetime import datetime

    now = datetime.now()
    prefix = now.strftime("%Y-%m") if period == "month" else now.strftime("%Y")
    return sum(
        r.amount_eur for r in list_rows(db, Expense) if r.date.startswith(prefix)
    )


# --- Seed --------------------------------------------------------------------


def seed_if_empty(db: Session) -> None:
    """First-run seed — the previous static demo data becomes real rows."""
    if db.scalar(select(CalendarEvent.id).limit(1)) is not None:
        return
    logger.info("Seeding first-run life data into %s", db.bind)
    today = date.today()
    tomorrow = today + timedelta(days=1)

    # Calendar
    for ev in (
        {
            "date": today.isoformat(),
            "time": "09:00",
            "title": "Benny vet check",
            "location": "Alsergrund",
            "category": "pet",
        },
        {
            "date": today.isoformat(),
            "time": "11:30",
            "title": "Spar shopping run",
            "location": "Währinger Straße",
            "category": "errands",
        },
        {
            "date": today.isoformat(),
            "time": "18:00",
            "title": "Coffee with Ingrid",
            "location": "Café Berg",
            "category": "social",
        },
        {
            "date": tomorrow.isoformat(),
            "time": "10:00",
            "title": "Fleet registry review",
            "location": "Home office",
            "category": "work",
        },
        {
            "date": (today + timedelta(days=3)).isoformat(),
            "time": "19:30",
            "title": "Staatsoper — Tosca Stehplatz",
            "location": "Staatsoper",
            "category": "culture",
        },
        {
            "date": (today + timedelta(days=6)).isoformat(),
            "time": "08:15",
            "title": "ÖBB — Wien Hbf → Salzburg",
            "location": "Wien Hauptbahnhof",
            "category": "travel",
        },
    ):
        db.add(CalendarEvent(**ev))

    # Todos
    for t in (
        {"title": "Review fleet-registry merge", "priority": "high"},
        {"title": "Spar shopping run", "priority": "normal"},
        {
            "title": "Refill Jacobs Krönung",
            "priority": "normal",
            "due_date": tomorrow.isoformat(),
        },
        {
            "title": "Book Benny grooming",
            "priority": "low",
            "due_date": (today + timedelta(days=10)).isoformat(),
        },
    ):
        db.add(Todo(**t))

    # Expenses
    for e in (
        {
            "date": today.isoformat(),
            "store": "Billa",
            "amount_eur": 42.5,
            "category": "Groceries",
            "note": "Weekly staples",
        },
        {
            "date": today.isoformat(),
            "store": "Restaurant Orlik",
            "amount_eur": 68.5,
            "category": "Dining",
            "note": "Alsergrund dinner",
        },
        {
            "date": (today - timedelta(days=1)).isoformat(),
            "store": "Spar",
            "amount_eur": 31.2,
            "category": "Groceries",
            "note": "Jacobs Krönung",
        },
        {
            "date": (today - timedelta(days=1)).isoformat(),
            "store": "Wiener Linien",
            "amount_eur": 2.4,
            "category": "Transit",
            "note": "Single ticket",
        },
        {
            "date": (today - timedelta(days=2)).isoformat(),
            "store": "Musikverein",
            "amount_eur": 45.0,
            "category": "Culture",
            "note": "Vivaldi tickets",
        },
        {
            "date": (today - timedelta(days=3)).isoformat(),
            "store": "Tierarzt Alsergrund",
            "amount_eur": 89.0,
            "category": "Pet (Benny)",
            "note": "Check-up",
        },
    ):
        db.add(Expense(**e))

    # Health — doctor visits, conditions, medications, vitals
    db.add_all(
        [
            DoctorVisit(
                date=(today - timedelta(days=20)).isoformat(),
                doctor="Dr. med. Eva Musterhauser",
                specialty="Allgemeinmedizin",
                reason="Annual check-up",
                diagnosis="All values normal; slight Vitamin D deficit",
                notes="Prescribed Vitamin D3 2000 IE daily until summer",
                follow_up_date=(today + timedelta(days=60)).isoformat(),
            ),
            DoctorVisit(
                date=(today - timedelta(days=90)).isoformat(),
                doctor="Dr. Philipp Gruber",
                specialty="Zahnarzt",
                reason="Routine cleaning + check-up",
                diagnosis="Healthy; one filling monitored",
                notes="Next recall in 6 months",
                follow_up_date=(today + timedelta(days=95)).isoformat(),
            ),
            MedicalCondition(
                name="Vitamin D deficit",
                status="monitoring",
                since="2026-01-15",
                notes="Seasonal; supplement in winter",
            ),
            MedicalCondition(
                name="Hay fever (Birke)",
                status="seasonal",
                since="2019-04-01",
                notes="March–May peak; antihistamine as needed",
            ),
            Medication(
                name="Vitamin D3",
                dose="2000",
                unit="IE",
                frequency="1x daily",
                times="08:00",
                with_food=True,
                start_date=today.isoformat(),
                refill_date=(today + timedelta(days=50)).isoformat(),
                notes="With breakfast",
            ),
            Medication(
                name="Cetirizin",
                dose="10",
                unit="mg",
                frequency="as needed",
                times="",
                refill_date=(today + timedelta(days=120)).isoformat(),
                notes="Pollen season only",
            ),
            Vitals(
                date=(today - timedelta(days=1)).isoformat(),
                time="07:45",
                systolic=118,
                diastolic=76,
                pulse=64,
                weight_kg=63.5,
                notes="Morning baseline",
            ),
        ]
    )

    # Travel — trips, packing, documents
    salzburg = Trip(
        title="Salzburg weekend",
        start_date=(today + timedelta(days=6)).isoformat(),
        end_date=(today + timedelta(days=8)).isoformat(),
        destination="Salzburg",
        mode="train",
        carrier="ÖBB",
        origin="Wien Hbf",
        ref="ÖBB-7K2M",
        status="booked",
        notes="Hotel Sacher booked",
    )
    db.add(salzburg)
    db.flush()
    db.add_all(
        [
            PackingItem(trip_id=salzburg.id, item="ÖBB ticket PDF"),
            PackingItem(trip_id=salzburg.id, item="Wiener Linien annual pass"),
            PackingItem(trip_id=salzburg.id, item="EU health card"),
            PackingItem(trip_id=salzburg.id, item="Noise-cancelling headphones"),
            PackingItem(trip_id=salzburg.id, item="Calibre ebook sync"),
        ]
    )
    db.add_all(
        [
            Trip(
                title="Graz — Steirischer Herbst preview",
                start_date=(today + timedelta(days=18)).isoformat(),
                end_date=(today + timedelta(days=19)).isoformat(),
                destination="Graz",
                mode="train",
                carrier="ÖBB",
                status="planned",
            ),
            Trip(
                title="Tokyo research trip",
                start_date="2026-09-12",
                end_date="2026-09-22",
                destination="Tokyo",
                mode="flight",
                carrier="ANA",
                origin="VIE",
                status="watchlist",
                notes="Watch fare alerts; visa not needed (90 days)",
            ),
            TravelDocument(
                name="Reisepass",
                number="P-XXXXX",
                expiry_date=(date.today().replace(year=today.year + 4)).isoformat(),
                notes="EU passport",
            ),
            TravelDocument(
                name="E-Card (health insurance)",
                number="",
                expiry_date="2027-12-31",
                notes="Austrian social insurance",
            ),
        ]
    )

    # Contacts
    db.add_all(
        [
            Contact(
                name="Ingrid",
                phone="+43 660 1234567",
                email="ingrid@example.at",
                birthday="1988-04-12",
                relationship="friend",
                favorite=True,
                notes="Café Berg regular",
            ),
            Contact(
                name="Dr. med. Eva Musterhauser",
                phone="+43 1 4000000",
                email="ordi@musterhauser.at",
                relationship="doctor",
                address="Alser Straße 21, 1080 Wien",
            ),
            Contact(
                name="Mama",
                phone="+43 664 000111",
                birthday="1958-11-02",
                relationship="family",
            ),
            Contact(
                name="Tierarzt Alsergrund",
                phone="+43 1 3170000",
                relationship="vet",
                address="Währinger Straße 45, 1090 Wien",
            ),
        ]
    )

    # Pet care — Benny
    db.add_all(
        [
            PetCareEvent(
                pet_name="Benny",
                event_type="vet",
                date=(today - timedelta(days=20)).isoformat(),
                notes="Annual check-up, all good",
                next_due=(today + timedelta(days=345)).isoformat(),
            ),
            PetCareEvent(
                pet_name="Benny",
                event_type="vaccination",
                date=(today - timedelta(days=60)).isoformat(),
                notes="Rabies booster",
                next_due=(today + timedelta(days=305)).isoformat(),
            ),
            PetCareEvent(
                pet_name="Benny",
                event_type="grooming",
                date="",
                notes="Fur trim + nail clipping",
                next_due=(today + timedelta(days=10)).isoformat(),
            ),
        ]
    )

    # Subscriptions & renewals
    db.add_all(
        [
            Subscription(
                name="A1 Mobile",
                category="Telecom",
                cost_monthly_eur=29.9,
                renewal_date=(today + timedelta(days=12)).isoformat(),
                url="https://a1.at",
                auto_renew=True,
            ),
            Subscription(
                name="Wiener Linien Jahreskarte",
                category="Transit",
                cost_monthly_eur=33.5,
                renewal_date=(today + timedelta(days=45)).isoformat(),
                url="https://wienerlinien.at",
                auto_renew=False,
                notes="Renew in app for annual discount",
            ),
            Subscription(
                name="ÖGK insurance",
                category="Insurance",
                cost_monthly_eur=78.0,
                renewal_date="2027-01-01",
                auto_renew=True,
            ),
            Subscription(
                name="Spotify Family",
                category="Media",
                cost_monthly_eur=17.99,
                renewal_date=(today + timedelta(days=20)).isoformat(),
                auto_renew=True,
            ),
        ]
    )

    # Home tasks
    db.add_all(
        [
            HomeTask(
                name="Smoke detector test",
                category="Safety",
                due_date=(today + timedelta(days=5)).isoformat(),
                frequency_days=180,
            ),
            HomeTask(
                name="Water filter change",
                category="Kitchen",
                due_date=(today + timedelta(days=14)).isoformat(),
                frequency_days=90,
            ),
            HomeTask(
                name="Window cleaning",
                category="Cleaning",
                due_date=(today + timedelta(days=21)).isoformat(),
                frequency_days=120,
            ),
            HomeTask(
                name="Radiator bleed",
                category="Heating",
                due_date=(today + timedelta(days=30)).isoformat(),
                frequency_days=365,
            ),
        ]
    )

    db.commit()
    logger.info("Seed complete: %d tables populated", len(Base.metadata.tables))
