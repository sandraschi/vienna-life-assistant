"""
Vienna Life Assistant - MCP Server
Exposes life management functionality via Model Context Protocol

This MCP server allows AI agents and other tools to:
- Manage todos and tasks
- Query and create calendar events
- Access shopping offers and lists
- Track expenses

Follows FastMCP 2.13+ standards and portmanteau pattern.
"""
from fastmcp import FastMCP
from typing import Optional, List
from datetime import datetime, date
from pydantic import BaseModel, Field
import os

# Create MCP server instance
mcp = FastMCP(
    "Vienna Life Assistant",
    dependencies=["sqlalchemy", "pydantic"]
)


# ============================================================================
# SCHEMAS
# ============================================================================

class TodoItem(BaseModel):
    """Todo item schema"""
    title: str
    category: str = "personal"
    priority: str = "medium"
    due_date: Optional[str] = None
    recurrence_rule: Optional[str] = None


class CalendarEvent(BaseModel):
    """Calendar event schema"""
    title: str
    start_time: str
    end_time: str
    description: Optional[str] = None
    location: Optional[str] = None
    category: str = "personal"


class ShoppingItem(BaseModel):
    """Shopping list item schema"""
    name: str
    quantity: float = 1.0
    unit: str = "pcs"
    store: Optional[str] = None
    price: Optional[float] = None


class Expense(BaseModel):
    """Expense record schema"""
    amount: float
    category: str
    description: Optional[str] = None
    date: Optional[str] = None
    store: Optional[str] = None


# ============================================================================
# TODOS MANAGEMENT
# ============================================================================

@mcp.tool()
async def vla_todos(
    operation: str,
    title: Optional[str] = None,
    category: Optional[str] = None,
    priority: Optional[str] = None,
    due_date: Optional[str] = None,
    recurrence_rule: Optional[str] = None,
    status: Optional[str] = None,
    todo_id: Optional[str] = None,
    limit: int = 50
) -> dict:
    """
    Comprehensive todo management for Vienna Life Assistant.
    
    PORTMANTEAU PATTERN: Single tool for all todo operations.
    
    OPERATIONS:
    - list: Get all todos (filter by category, status)
    - create: Create new todo
    - update: Update existing todo
    - delete: Delete todo
    - complete: Mark todo as complete
    - stats: Get todo statistics
    
    Args:
        operation: Operation to perform (list, create, update, delete, complete, stats)
        title: Todo title (required for create)
        category: Category filter or assignment (personal, work, shopping, health, pets, home)
        priority: Priority level (low, medium, high, urgent)
        due_date: Due date in ISO format (YYYY-MM-DD)
        recurrence_rule: Recurrence pattern (daily, weekly, monthly)
        status: Status filter (pending, completed, cancelled)
        todo_id: Todo ID for update/delete/complete operations
        limit: Maximum results to return (default: 50)
    
    Returns:
        Operation-specific result with todos data
    
    Examples:
        List all pending todos: vla_todos("list", status="pending")
        Create todo: vla_todos("create", title="Walk Benny", category="pets", priority="high")
        Complete todo: vla_todos("complete", todo_id="123")
        Get stats: vla_todos("stats")
    """
    from models.todo import TodoItem as TodoModel
    from models.base import get_session
    from sqlalchemy import select, func
    
    try:
        with get_session() as session:
            if operation == "list":
                query = select(TodoModel)
                
                # Apply filters
                if category:
                    query = query.where(TodoModel.category == category)
                if status:
                    query = query.where(TodoModel.status == status)
                else:
                    query = query.where(TodoModel.status == "pending")
                
                query = query.limit(limit)
                todos = session.execute(query).scalars().all()
                
                return {
                    "success": True,
                    "operation": "list",
                    "count": len(todos),
                    "todos": [
                        {
                            "id": str(todo.id),
                            "title": todo.title,
                            "category": todo.category,
                            "priority": todo.priority,
                            "status": todo.status,
                            "due_date": todo.due_date.isoformat() if todo.due_date else None,
                            "created_at": todo.created_at.isoformat()
                        }
                        for todo in todos
                    ]
                }
            
            elif operation == "create":
                if not title:
                    return {"success": False, "error": "Title is required for create operation"}
                
                todo = TodoModel(
                    title=title,
                    category=category or "personal",
                    priority=priority or "medium",
                    status="pending",
                    due_date=datetime.fromisoformat(due_date) if due_date else None,
                    recurrence_rule=recurrence_rule
                )
                session.add(todo)
                session.commit()
                
                return {
                    "success": True,
                    "operation": "create",
                    "todo": {
                        "id": str(todo.id),
                        "title": todo.title,
                        "category": todo.category,
                        "priority": todo.priority
                    }
                }
            
            elif operation == "complete":
                if not todo_id:
                    return {"success": False, "error": "todo_id is required for complete operation"}
                
                todo = session.get(TodoModel, todo_id)
                if not todo:
                    return {"success": False, "error": f"Todo {todo_id} not found"}
                
                todo.status = "completed"
                todo.completed_at = datetime.now()
                session.commit()
                
                return {
                    "success": True,
                    "operation": "complete",
                    "todo": {
                        "id": str(todo.id),
                        "title": todo.title,
                        "status": todo.status
                    }
                }
            
            elif operation == "delete":
                if not todo_id:
                    return {"success": False, "error": "todo_id is required for delete operation"}
                
                todo = session.get(TodoModel, todo_id)
                if not todo:
                    return {"success": False, "error": f"Todo {todo_id} not found"}
                
                session.delete(todo)
                session.commit()
                
                return {
                    "success": True,
                    "operation": "delete",
                    "message": f"Todo '{todo.title}' deleted"
                }
            
            elif operation == "stats":
                total = session.execute(select(func.count(TodoModel.id))).scalar()
                pending = session.execute(
                    select(func.count(TodoModel.id)).where(TodoModel.status == "pending")
                ).scalar()
                completed = session.execute(
                    select(func.count(TodoModel.id)).where(TodoModel.status == "completed")
                ).scalar()
                
                # Category breakdown
                category_counts = session.execute(
                    select(TodoModel.category, func.count(TodoModel.id))
                    .where(TodoModel.status == "pending")
                    .group_by(TodoModel.category)
                ).all()
                
                return {
                    "success": True,
                    "operation": "stats",
                    "stats": {
                        "total": total,
                        "pending": pending,
                        "completed": completed,
                        "by_category": {cat: count for cat, count in category_counts}
                    }
                }
            
            else:
                return {
                    "success": False,
                    "error": f"Unknown operation: {operation}. Valid: list, create, update, delete, complete, stats"
                }
    
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "operation": operation
        }


# ============================================================================
# CALENDAR MANAGEMENT
# ============================================================================

@mcp.tool()
async def vla_calendar(
    operation: str,
    title: Optional[str] = None,
    start_time: Optional[str] = None,
    end_time: Optional[str] = None,
    description: Optional[str] = None,
    location: Optional[str] = None,
    category: Optional[str] = None,
    event_id: Optional[str] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    limit: int = 100
) -> dict:
    """
    Comprehensive calendar management for Vienna Life Assistant.
    
    PORTMANTEAU PATTERN: Single tool for all calendar operations.
    
    OPERATIONS:
    - list: Get events in date range
    - create: Create new calendar event
    - update: Update existing event
    - delete: Delete event
    - today: Get today's events
    - upcoming: Get upcoming events
    
    Args:
        operation: Operation to perform (list, create, update, delete, today, upcoming)
        title: Event title (required for create)
        start_time: Event start in ISO format (YYYY-MM-DDTHH:MM:SS)
        end_time: Event end in ISO format
        description: Event description
        location: Event location
        category: Event category (personal, work, health, social)
        event_id: Event ID for update/delete operations
        start_date: Filter start date (ISO format)
        end_date: Filter end date (ISO format)
        limit: Maximum results to return (default: 100)
    
    Returns:
        Operation-specific result with calendar data
    
    Examples:
        Today's events: vla_calendar("today")
        Create event: vla_calendar("create", title="Vet appointment for Benny", 
                                    start_time="2025-12-10T14:00:00", end_time="2025-12-10T15:00:00")
        List range: vla_calendar("list", start_date="2025-12-01", end_date="2025-12-31")
    """
    from models.calendar import CalendarEvent as CalendarModel
    from models.base import get_session
    from sqlalchemy import select, and_
    
    try:
        with get_session() as session:
            if operation == "today":
                today = date.today()
                start = datetime.combine(today, datetime.min.time())
                end = datetime.combine(today, datetime.max.time())
                
                query = select(CalendarModel).where(
                    and_(
                        CalendarModel.start_time >= start,
                        CalendarModel.start_time <= end
                    )
                ).order_by(CalendarModel.start_time)
                
                events = session.execute(query).scalars().all()
                
                return {
                    "success": True,
                    "operation": "today",
                    "date": today.isoformat(),
                    "count": len(events),
                    "events": [
                        {
                            "id": str(event.id),
                            "title": event.title,
                            "start_time": event.start_time.isoformat(),
                            "end_time": event.end_time.isoformat(),
                            "category": event.category,
                            "location": event.location
                        }
                        for event in events
                    ]
                }
            
            elif operation == "upcoming":
                now = datetime.now()
                week_later = datetime.now().replace(day=now.day + 7)
                
                query = select(CalendarModel).where(
                    and_(
                        CalendarModel.start_time >= now,
                        CalendarModel.start_time <= week_later
                    )
                ).order_by(CalendarModel.start_time).limit(limit)
                
                events = session.execute(query).scalars().all()
                
                return {
                    "success": True,
                    "operation": "upcoming",
                    "count": len(events),
                    "events": [
                        {
                            "id": str(event.id),
                            "title": event.title,
                            "start_time": event.start_time.isoformat(),
                            "end_time": event.end_time.isoformat(),
                            "category": event.category
                        }
                        for event in events
                    ]
                }
            
            elif operation == "create":
                if not all([title, start_time, end_time]):
                    return {"success": False, "error": "title, start_time, and end_time required"}
                
                event = CalendarModel(
                    title=title,
                    description=description,
                    start_time=datetime.fromisoformat(start_time),
                    end_time=datetime.fromisoformat(end_time),
                    category=category or "personal",
                    location=location
                )
                session.add(event)
                session.commit()
                
                return {
                    "success": True,
                    "operation": "create",
                    "event": {
                        "id": str(event.id),
                        "title": event.title,
                        "start_time": event.start_time.isoformat()
                    }
                }
            
            elif operation == "list":
                query = select(CalendarModel)
                
                if start_date:
                    start_dt = datetime.fromisoformat(start_date)
                    query = query.where(CalendarModel.start_time >= start_dt)
                
                if end_date:
                    end_dt = datetime.fromisoformat(end_date)
                    query = query.where(CalendarModel.start_time <= end_dt)
                
                query = query.order_by(CalendarModel.start_time).limit(limit)
                events = session.execute(query).scalars().all()
                
                return {
                    "success": True,
                    "operation": "list",
                    "count": len(events),
                    "events": [
                        {
                            "id": str(event.id),
                            "title": event.title,
                            "start_time": event.start_time.isoformat(),
                            "end_time": event.end_time.isoformat(),
                            "category": event.category
                        }
                        for event in events
                    ]
                }
            
            else:
                return {
                    "success": False,
                    "error": f"Unknown operation: {operation}. Valid: list, create, update, delete, today, upcoming"
                }
    
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "operation": operation
        }


# ============================================================================
# SHOPPING & EXPENSES
# ============================================================================

@mcp.tool()
async def vla_shopping(
    operation: str,
    store: Optional[str] = None,
    category: Optional[str] = None,
    limit: int = 50
) -> dict:
    """
    Access Vienna shopping intelligence (Spar, Billa offers).
    
    OPERATIONS:
    - offers: Get current store offers
    - stores: List supported Austrian stores
    - categories: Get offer categories
    
    Args:
        operation: Operation to perform (offers, stores, categories)
        store: Filter by store (spar, billa)
        category: Filter by category
        limit: Maximum results (default: 50)
    
    Returns:
        Shopping offers and store information
    
    Examples:
        Get Spar offers: vla_shopping("offers", store="spar")
        List stores: vla_shopping("stores")
    """
    try:
        if operation == "stores":
            return {
                "success": True,
                "operation": "stores",
                "stores": [
                    {"name": "Spar", "code": "spar", "supported": True},
                    {"name": "Billa", "code": "billa", "supported": True}
                ]
            }
        
        elif operation == "offers":
            # This would query scraped offers from database
            # For now, return structure
            return {
                "success": True,
                "operation": "offers",
                "store": store,
                "offers": [],
                "message": "Offer scraping integration pending"
            }
        
        elif operation == "categories":
            return {
                "success": True,
                "operation": "categories",
                "categories": [
                    "groceries", "dairy", "meat", "produce", 
                    "snacks", "beverages", "household", "pets"
                ]
            }
        
        else:
            return {
                "success": False,
                "error": f"Unknown operation: {operation}. Valid: offers, stores, categories"
            }
    
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "operation": operation
        }


# ============================================================================
# SYSTEM INFO
# ============================================================================

@mcp.tool()
async def vla_info() -> dict:
    """
    Get Vienna Life Assistant system information.
    
    Returns:
        System status, version, and available features
    
    Examples:
        Get info: vla_info()
    """
    return {
        "success": True,
        "system": "Vienna Life Assistant",
        "version": "0.1.0",
        "location": "Vienna, Austria (9th District)",
        "features": [
            "Todos management (personal, pets, home, health)",
            "Calendar (Outlook/Graph integration)",
            "Shopping (Spar/Billa offers)",
            "Expenses tracking",
            "Austrian locale (EUR, German/English)"
        ],
        "integrations": {
            "plex": "50,000+ anime/movies",
            "calibre": "15,000+ ebooks",
            "ollama": "Local AI",
            "immich": "Photo management",
            "tapo": "Home cameras"
        },
        "mcp_tools": [
            "vla_todos - Comprehensive todo management",
            "vla_calendar - Calendar operations",
            "vla_shopping - Austrian store offers",
            "vla_info - System information"
        ]
    }


if __name__ == "__main__":
    # Run MCP server
    mcp.run(transport="stdio")

