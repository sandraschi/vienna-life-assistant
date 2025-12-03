"""
Todos API Routes
CRUD operations for todo items
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import and_
from typing import Optional
from datetime import datetime
import logging
from models import get_db, TodoItem, TodoPriority
from .schemas import (
    TodoItemCreate,
    TodoItemUpdate,
    TodoItemResponse,
    TodoItemList,
    TodoStats,
)

logger = logging.getLogger(__name__)
router = APIRouter()


@router.get("/", response_model=TodoItemList)
async def list_todos(
    completed: Optional[bool] = Query(None, description="Filter by completion status"),
    priority: Optional[TodoPriority] = Query(None, description="Filter by priority"),
    category: Optional[str] = Query(None, description="Filter by category"),
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(50, ge=1, le=100, description="Items per page"),
    db: Session = Depends(get_db),
):
    """
    Get list of todo items with optional filters

    - **completed**: Filter by completion status (true/false)
    - **priority**: Filter by priority level
    - **category**: Filter by category name
    - **page**: Page number for pagination
    - **page_size**: Number of items per page
    """
    query = db.query(TodoItem)

    # Apply filters
    filters = []
    if completed is not None:
        filters.append(TodoItem.completed == completed)
    if priority:
        filters.append(TodoItem.priority == priority)
    if category:
        filters.append(TodoItem.category == category)

    if filters:
        query = query.filter(and_(*filters))

    # Get total count
    total = query.count()

    # Paginate - order by: not completed first, then by due date, then by priority
    offset = (page - 1) * page_size
    todos = (
        query.order_by(TodoItem.completed.asc())
        .order_by(TodoItem.due_date.asc())
        .order_by(TodoItem.priority.desc())
        .offset(offset)
        .limit(page_size)
        .all()
    )

    return {
        "todos": [TodoItemResponse.model_validate(todo) for todo in todos],
        "total": total,
        "page": page,
        "page_size": page_size,
    }


@router.get("/stats", response_model=TodoStats)
async def get_stats(db: Session = Depends(get_db)):
    """Get statistics about todos"""
    total = db.query(TodoItem).count()
    completed = db.query(TodoItem).filter(TodoItem.completed).count()
    pending = total - completed
    urgent = (
        db.query(TodoItem)
        .filter(and_(~TodoItem.completed, TodoItem.priority == TodoPriority.URGENT))
        .count()
    )

    # Count overdue (not completed and due date in past)
    now = datetime.now()
    overdue = (
        db.query(TodoItem)
        .filter(
            and_(
                ~TodoItem.completed,
                TodoItem.due_date.is_not(None),
                TodoItem.due_date < now,
            )
        )
        .count()
    )

    return {
        "total": total,
        "completed": completed,
        "pending": pending,
        "urgent": urgent,
        "overdue": overdue,
    }


@router.get("/{todo_id}", response_model=TodoItemResponse)
async def get_todo(todo_id: str, db: Session = Depends(get_db)):
    """Get a specific todo item by ID"""
    todo = db.query(TodoItem).filter(TodoItem.id == todo_id).first()
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    return TodoItemResponse.model_validate(todo)


@router.post("/", response_model=TodoItemResponse, status_code=201)
async def create_todo(todo_data: TodoItemCreate, db: Session = Depends(get_db)):
    """Create a new todo item"""
    try:
        # Use model_dump() instead of dict() for Pydantic v2
        todo = TodoItem(**todo_data.model_dump())
        db.add(todo)
        db.commit()
        db.refresh(todo)

        return TodoItemResponse.model_validate(todo)
    except Exception as e:
        db.rollback()
        logger.error(f"Failed to create todo: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to create todo: {str(e)}")


@router.patch("/{todo_id}", response_model=TodoItemResponse)
async def update_todo(
    todo_id: str, todo_data: TodoItemUpdate, db: Session = Depends(get_db)
):
    """Update an existing todo item"""
    todo = db.query(TodoItem).filter(TodoItem.id == todo_id).first()
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")

    # Update only provided fields
    update_data = todo_data.model_dump(exclude_unset=True)

    # Handle completion status change
    if "completed" in update_data:
        if update_data["completed"] and not todo.completed:
            # Mark as completed
            update_data["completed_at"] = datetime.utcnow()
        elif not update_data["completed"] and todo.completed:
            # Mark as not completed
            update_data["completed_at"] = None

    for field, value in update_data.items():
        setattr(todo, field, value)

    todo.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(todo)

    return TodoItemResponse.model_validate(todo)


@router.delete("/{todo_id}", status_code=204)
async def delete_todo(todo_id: str, db: Session = Depends(get_db)):
    """Delete a todo item"""
    todo = db.query(TodoItem).filter(TodoItem.id == todo_id).first()
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")

    db.delete(todo)
    db.commit()
    return None


@router.post("/{todo_id}/complete", response_model=TodoItemResponse)
async def complete_todo(todo_id: str, db: Session = Depends(get_db)):
    """Mark a todo item as completed"""
    todo = db.query(TodoItem).filter(TodoItem.id == todo_id).first()
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")

    if not todo.completed:
        todo.completed = True
        todo.completed_at = datetime.utcnow()
        todo.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(todo)

    return TodoItemResponse.model_validate(todo)


@router.post("/{todo_id}/uncomplete", response_model=TodoItemResponse)
async def uncomplete_todo(todo_id: str, db: Session = Depends(get_db)):
    """Mark a todo item as not completed"""
    todo = db.query(TodoItem).filter(TodoItem.id == todo_id).first()
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")

    if todo.completed:
        todo.completed = False
        todo.completed_at = None
        todo.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(todo)

    return TodoItemResponse.model_validate(todo)
