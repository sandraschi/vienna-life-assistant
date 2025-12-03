"""
Pydantic schemas for Calendar API
"""
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from models.calendar import EventCategory


class CalendarEventBase(BaseModel):
    """Base calendar event schema"""
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    start_time: datetime
    end_time: datetime
    category: Optional[EventCategory] = EventCategory.PERSONAL
    location: Optional[str] = Field(None, max_length=255)
    color: Optional[str] = Field(None, pattern=r"^#[0-9A-Fa-f]{6}$")
    recurrence_rule: Optional[dict] = None


class CalendarEventCreate(CalendarEventBase):
    """Schema for creating calendar events"""
    pass


class CalendarEventUpdate(BaseModel):
    """Schema for updating calendar events (all fields optional)"""
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    category: Optional[EventCategory] = None
    location: Optional[str] = Field(None, max_length=255)
    color: Optional[str] = Field(None, pattern=r"^#[0-9A-Fa-f]{6}$")
    recurrence_rule: Optional[dict] = None


class CalendarEventResponse(CalendarEventBase):
    """Schema for calendar event responses"""
    id: str
    outlook_id: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class CalendarEventList(BaseModel):
    """Paginated list of calendar events"""
    events: list[CalendarEventResponse]
    total: int
    page: int
    page_size: int

