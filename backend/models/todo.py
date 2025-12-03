"""
Todo Item Model
Stores todos with recurring task support
"""
from sqlalchemy import Column, String, DateTime, Text, Boolean, JSON, Enum as SQLEnum
from sqlalchemy import ForeignKey
import uuid
from datetime import datetime
import enum
from .base import Base


class TodoPriority(str, enum.Enum):
    """Todo priority levels"""
    URGENT = "urgent"
    NORMAL = "normal"
    SOMEDAY = "someday"


class TodoItem(Base):
    """Todo item model with recurring support"""
    __tablename__ = "todo_items"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=True)
    due_date = Column(DateTime(timezone=True), nullable=True, index=True)
    
    # Priority and categorization
    # Use String for SQLite compatibility (SQLite doesn't have native enums)
    priority = Column(
        String(20),
        default="normal",
        nullable=False,
        index=True
    )
    category = Column(String(50), nullable=True, index=True)
    
    # Completion status
    completed = Column(Boolean, default=False, nullable=False, index=True)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    
    # Recurrence (store as JSON)
    recurrence_rule = Column(JSON, nullable=True)
    
    # Link to calendar event (optional)
    linked_event_id = Column(String(36), ForeignKey("calendar_events.id"), nullable=True)
    
    # Tags (JSON array for SQLite compatibility)
    tags = Column(JSON, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f"<TodoItem(id={self.id}, title='{self.title}', completed={self.completed})>"
    
    def to_dict(self):
        """Convert to dictionary for API responses"""
        return {
            "id": str(self.id),
            "title": self.title,
            "description": self.description,
            "due_date": self.due_date.isoformat() if self.due_date else None,
            "priority": self.priority,  # Already a string
            "category": self.category,
            "completed": self.completed,
            "completed_at": self.completed_at.isoformat() if self.completed_at else None,
            "recurrence_rule": self.recurrence_rule,
            "linked_event_id": str(self.linked_event_id) if self.linked_event_id else None,
            "tags": self.tags,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }

