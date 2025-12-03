"""
Calendar API Routes
CRUD operations for calendar events
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import and_
from typing import Optional
from datetime import datetime, timedelta
from models import get_db, CalendarEvent, EventCategory
from .schemas import (
    CalendarEventCreate,
    CalendarEventUpdate,
    CalendarEventResponse,
    CalendarEventList,
)

router = APIRouter()


@router.get("/", response_model=CalendarEventList)
async def list_events(
    start_date: Optional[datetime] = Query(
        None, description="Filter events after this date"
    ),
    end_date: Optional[datetime] = Query(
        None, description="Filter events before this date"
    ),
    category: Optional[EventCategory] = Query(None, description="Filter by category"),
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(50, ge=1, le=100, description="Items per page"),
    db: Session = Depends(get_db),
):
    """
    Get list of calendar events with optional filters

    - **start_date**: Show events after this date
    - **end_date**: Show events before this date
    - **category**: Filter by event category
    - **page**: Page number for pagination
    - **page_size**: Number of items per page
    """
    query = db.query(CalendarEvent)

    # Apply filters
    filters = []
    if start_date:
        filters.append(CalendarEvent.start_time >= start_date)
    if end_date:
        filters.append(CalendarEvent.end_time <= end_date)
    if category:
        filters.append(CalendarEvent.category == category)

    if filters:
        query = query.filter(and_(*filters))

    # Get total count
    total = query.count()

    # Paginate
    offset = (page - 1) * page_size
    events = (
        query.order_by(CalendarEvent.start_time).offset(offset).limit(page_size).all()
    )

    return {
        "events": [CalendarEventResponse.model_validate(event) for event in events],
        "total": total,
        "page": page,
        "page_size": page_size,
    }


@router.get("/{event_id}", response_model=CalendarEventResponse)
async def get_event(event_id: str, db: Session = Depends(get_db)):
    """Get a specific calendar event by ID"""
    event = db.query(CalendarEvent).filter(CalendarEvent.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return CalendarEventResponse.model_validate(event)


@router.post("/", response_model=CalendarEventResponse, status_code=201)
async def create_event(event_data: CalendarEventCreate, db: Session = Depends(get_db)):
    """Create a new calendar event"""

    # Validate end time is after start time
    if event_data.end_time <= event_data.start_time:
        raise HTTPException(status_code=400, detail="End time must be after start time")

    # Create event
    event = CalendarEvent(**event_data.model_dump())
    db.add(event)
    db.commit()
    db.refresh(event)

    return CalendarEventResponse.model_validate(event)


@router.patch("/{event_id}", response_model=CalendarEventResponse)
async def update_event(
    event_id: str, event_data: CalendarEventUpdate, db: Session = Depends(get_db)
):
    """Update an existing calendar event"""
    event = db.query(CalendarEvent).filter(CalendarEvent.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    # Update only provided fields
    update_data = event_data.model_dump(exclude_unset=True)

    # Validate times if both are being updated
    start = update_data.get("start_time", event.start_time)
    end = update_data.get("end_time", event.end_time)
    if end <= start:
        raise HTTPException(status_code=400, detail="End time must be after start time")

    for field, value in update_data.items():
        setattr(event, field, value)

    event.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(event)

    return CalendarEventResponse.model_validate(event)


@router.delete("/{event_id}", status_code=204)
async def delete_event(event_id: str, db: Session = Depends(get_db)):
    """Delete a calendar event"""
    event = db.query(CalendarEvent).filter(CalendarEvent.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    db.delete(event)
    db.commit()
    return None


@router.get("/today/", response_model=CalendarEventList)
async def get_today_events(db: Session = Depends(get_db)):
    """Get all events for today"""
    now = datetime.now()
    start_of_day = now.replace(hour=0, minute=0, second=0, microsecond=0)
    end_of_day = start_of_day + timedelta(days=1)

    events = (
        db.query(CalendarEvent)
        .filter(
            and_(
                CalendarEvent.start_time >= start_of_day,
                CalendarEvent.start_time < end_of_day,
            )
        )
        .order_by(CalendarEvent.start_time)
        .all()
    )

    return {
        "events": [CalendarEventResponse.model_validate(event) for event in events],
        "total": len(events),
        "page": 1,
        "page_size": len(events),
    }
