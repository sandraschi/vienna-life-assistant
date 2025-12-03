"""
Calendar Event Model
Stores calendar events with Outlook integration support
"""
from sqlalchemy import Column, String, DateTime, Text, JSON, Enum as SQLEnum
import uuid
from datetime import datetime
import enum
from .base import Base


class EventCategory(str, enum.Enum):
    """Event categories"""
    PERSONAL = "personal"
    BENNY = "benny"
    SHOPPING = "shopping"
    SELF_CARE = "self-care"
    APPOINTMENT = "appointment"
    OTHER = "other"


class CalendarEvent(Base):
    """Calendar event model with Outlook sync support"""
    __tablename__ = "calendar_events"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=True)
    start_time = Column(DateTime(timezone=True), nullable=False, index=True)
    end_time = Column(DateTime(timezone=True), nullable=False)
    
    # Categorization
    # Use String for SQLite compatibility
    category = Column(
        String(50),
        default="personal",
        nullable=False
    )
    
    location = Column(String(255), nullable=True)
    color = Column(String(7), nullable=True, default="#1976D2")
    
    # Outlook integration
    outlook_id = Column(String(255), unique=True, nullable=True, index=True)
    outlook_etag = Column(String(255), nullable=True)
    
    # Recurrence (store as JSON)
    recurrence_rule = Column(JSON, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f"<CalendarEvent(id={self.id}, title='{self.title}', start={self.start_time})>"
    
    def to_dict(self):
        """Convert to dictionary for API responses"""
        return {
            "id": str(self.id),
            "title": self.title,
            "description": self.description,
            "start_time": self.start_time.isoformat() if self.start_time else None,
            "end_time": self.end_time.isoformat() if self.end_time else None,
            "category": self.category.value if self.category else None,
            "location": self.location,
            "color": self.color,
            "outlook_id": self.outlook_id,
            "recurrence_rule": self.recurrence_rule,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }

