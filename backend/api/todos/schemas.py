"""
Pydantic schemas for Todos API
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from models.todo import TodoPriority


class TodoItemBase(BaseModel):
    """Base todo item schema"""

    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    due_date: Optional[datetime] = None
    priority: Optional[TodoPriority] = TodoPriority.NORMAL
    category: Optional[str] = Field(None, max_length=50)
    tags: Optional[list[str]] = None
    recurrence_rule: Optional[dict] = None


class TodoItemCreate(TodoItemBase):
    """Schema for creating todo items"""

    pass


class TodoItemUpdate(BaseModel):
    """Schema for updating todo items (all fields optional)"""

    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    due_date: Optional[datetime] = None
    priority: Optional[TodoPriority] = None
    category: Optional[str] = Field(None, max_length=50)
    completed: Optional[bool] = None
    tags: Optional[list[str]] = None
    recurrence_rule: Optional[dict] = None


class TodoItemResponse(TodoItemBase):
    """Schema for todo item responses"""

    id: str
    completed: bool
    completed_at: Optional[datetime] = None
    linked_event_id: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class TodoItemList(BaseModel):
    """Paginated list of todo items"""

    todos: list[TodoItemResponse]
    total: int
    page: int
    page_size: int


class TodoStats(BaseModel):
    """Todo statistics"""

    total: int
    completed: int
    pending: int
    urgent: int
    overdue: int
