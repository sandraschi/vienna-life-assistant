"""SQLAlchemy models for ViLife life domains.

Dates and times are ISO strings (YYYY-MM-DD / HH:MM) — pragmatic for a
personal app, timezone-safe at the call site, JSON-native for REST and MCP.
"""

from __future__ import annotations

from sqlalchemy import Boolean, Float, Integer, String, Text, inspect
from sqlalchemy.orm import Mapped, mapped_column

from vienna_life_assistant.db import Base


class BaseMixin:
    """Row → dict serializer shared by every model."""

    def to_dict(self) -> dict:
        state = inspect(self)
        if state is None:
            return {}
        return {c.key: getattr(self, c.key) for c in state.mapper.column_attrs}


class CalendarEvent(Base, BaseMixin):
    __tablename__ = "calendar_events"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    date: Mapped[str] = mapped_column(String(10), index=True)
    time: Mapped[str] = mapped_column(String(5), default="09:00")
    title: Mapped[str] = mapped_column(String(200))
    location: Mapped[str] = mapped_column(String(200), default="")
    category: Mapped[str] = mapped_column(String(50), default="general", index=True)
    notes: Mapped[str] = mapped_column(Text, default="")
    done: Mapped[bool] = mapped_column(Boolean, default=False)


class Todo(Base, BaseMixin):
    __tablename__ = "todos"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    title: Mapped[str] = mapped_column(String(200))
    priority: Mapped[str] = mapped_column(String(20), default="normal")
    status: Mapped[str] = mapped_column(String(20), default="open", index=True)
    due_date: Mapped[str] = mapped_column(String(10), default="")
    notes: Mapped[str] = mapped_column(Text, default="")


class Expense(Base, BaseMixin):
    __tablename__ = "expenses"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    date: Mapped[str] = mapped_column(String(10), index=True)
    store: Mapped[str] = mapped_column(String(120))
    amount_eur: Mapped[float] = mapped_column(Float, default=0.0)
    category: Mapped[str] = mapped_column(String(50), default="Other", index=True)
    note: Mapped[str] = mapped_column(Text, default="")


class DoctorVisit(Base, BaseMixin):
    __tablename__ = "doctor_visits"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    date: Mapped[str] = mapped_column(String(10), index=True)
    doctor: Mapped[str] = mapped_column(String(120))
    specialty: Mapped[str] = mapped_column(String(80), default="")
    reason: Mapped[str] = mapped_column(String(300), default="")
    diagnosis: Mapped[str] = mapped_column(Text, default="")
    notes: Mapped[str] = mapped_column(Text, default="")
    follow_up_date: Mapped[str] = mapped_column(String(10), default="")
    done: Mapped[bool] = mapped_column(Boolean, default=False)


class MedicalCondition(Base, BaseMixin):
    __tablename__ = "medical_conditions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(200))
    status: Mapped[str] = mapped_column(String(40), default="monitoring", index=True)
    since: Mapped[str] = mapped_column(String(10), default="")
    notes: Mapped[str] = mapped_column(Text, default="")


class Medication(Base, BaseMixin):
    __tablename__ = "medications"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(200))
    dose: Mapped[str] = mapped_column(String(60), default="")
    unit: Mapped[str] = mapped_column(String(40), default="")
    frequency: Mapped[str] = mapped_column(String(80), default="")  # e.g. "2x daily"
    times: Mapped[str] = mapped_column(String(120), default="")  # e.g. "08:00,20:00"
    with_food: Mapped[bool] = mapped_column(Boolean, default=False)
    start_date: Mapped[str] = mapped_column(String(10), default="")
    end_date: Mapped[str] = mapped_column(String(10), default="")
    refill_date: Mapped[str] = mapped_column(String(10), default="")
    active: Mapped[bool] = mapped_column(Boolean, default=True, index=True)
    notes: Mapped[str] = mapped_column(Text, default="")


class Vitals(Base, BaseMixin):
    __tablename__ = "vitals"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    date: Mapped[str] = mapped_column(String(10), index=True)
    time: Mapped[str] = mapped_column(String(5), default="08:00")
    systolic: Mapped[int] = mapped_column(Integer, default=0)
    diastolic: Mapped[int] = mapped_column(Integer, default=0)
    pulse: Mapped[int] = mapped_column(Integer, default=0)
    weight_kg: Mapped[float] = mapped_column(Float, default=0.0)
    notes: Mapped[str] = mapped_column(Text, default="")


class Trip(Base, BaseMixin):
    __tablename__ = "trips"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    title: Mapped[str] = mapped_column(String(200))
    start_date: Mapped[str] = mapped_column(String(10), index=True)
    end_date: Mapped[str] = mapped_column(String(10), default="")
    destination: Mapped[str] = mapped_column(String(120), default="")
    mode: Mapped[str] = mapped_column(
        String(20), default="train"
    )  # train | flight | car
    carrier: Mapped[str] = mapped_column(String(80), default="")
    origin: Mapped[str] = mapped_column(String(120), default="Wien Hbf")
    ref: Mapped[str] = mapped_column(String(60), default="")
    status: Mapped[str] = mapped_column(String(20), default="planned", index=True)
    notes: Mapped[str] = mapped_column(Text, default="")


class PackingItem(Base, BaseMixin):
    __tablename__ = "packing_items"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    trip_id: Mapped[int] = mapped_column(Integer, index=True)
    item: Mapped[str] = mapped_column(String(200))
    done: Mapped[bool] = mapped_column(Boolean, default=False)


class TravelDocument(Base, BaseMixin):
    __tablename__ = "travel_documents"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(200))
    number: Mapped[str] = mapped_column(String(120), default="")
    expiry_date: Mapped[str] = mapped_column(String(10), index=True)
    trip_id: Mapped[int] = mapped_column(Integer, default=0)
    notes: Mapped[str] = mapped_column(Text, default="")


class Contact(Base, BaseMixin):
    __tablename__ = "contacts"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(200))
    phone: Mapped[str] = mapped_column(String(60), default="")
    email: Mapped[str] = mapped_column(String(200), default="")
    birthday: Mapped[str] = mapped_column(String(10), default="")  # YYYY-MM-DD
    relationship: Mapped[str] = mapped_column(String(60), default="")
    address: Mapped[str] = mapped_column(String(300), default="")
    notes: Mapped[str] = mapped_column(Text, default="")
    favorite: Mapped[bool] = mapped_column(Boolean, default=False)


class PetCareEvent(Base, BaseMixin):
    __tablename__ = "pet_care_events"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    pet_name: Mapped[str] = mapped_column(String(80), index=True)
    event_type: Mapped[str] = mapped_column(
        String(40), index=True
    )  # vet | vaccination | medication | grooming | walk | weight
    date: Mapped[str] = mapped_column(String(10), index=True)
    notes: Mapped[str] = mapped_column(Text, default="")
    next_due: Mapped[str] = mapped_column(String(10), default="")


class Subscription(Base, BaseMixin):
    __tablename__ = "subscriptions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(200))
    category: Mapped[str] = mapped_column(String(60), default="Other")
    cost_monthly_eur: Mapped[float] = mapped_column(Float, default=0.0)
    renewal_date: Mapped[str] = mapped_column(String(10), index=True)
    url: Mapped[str] = mapped_column(String(300), default="")
    auto_renew: Mapped[bool] = mapped_column(Boolean, default=True)
    notes: Mapped[str] = mapped_column(Text, default="")


class HomeTask(Base, BaseMixin):
    __tablename__ = "home_tasks"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(200))
    category: Mapped[str] = mapped_column(String(60), default="Maintenance")
    due_date: Mapped[str] = mapped_column(String(10), index=True)
    frequency_days: Mapped[int] = mapped_column(Integer, default=0)  # 0 = one-off
    done: Mapped[bool] = mapped_column(Boolean, default=False)
    notes: Mapped[str] = mapped_column(Text, default="")
