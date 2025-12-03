"""
Test Todo model
"""

from models.todo import TodoItem


def test_create_todo_model(test_db):
    """Test creating a todo model instance"""
    todo = TodoItem(
        title="Test Todo",
        description="Test Description",
        priority="normal",
        category="Testing",
    )

    test_db.add(todo)
    test_db.commit()
    test_db.refresh(todo)

    assert todo.id is not None
    assert todo.title == "Test Todo"
    assert todo.priority == "normal"
    assert todo.completed is False


def test_todo_to_dict(test_db):
    """Test converting todo to dictionary"""
    todo = TodoItem(title="Test Todo", priority="urgent", category="Test")

    test_db.add(todo)
    test_db.commit()
    test_db.refresh(todo)

    todo_dict = todo.to_dict()

    assert todo_dict["title"] == "Test Todo"
    assert todo_dict["priority"] == "urgent"
    assert todo_dict["category"] == "Test"
    assert todo_dict["completed"] is False
    assert "id" in todo_dict


def test_complete_todo(test_db):
    """Test completing a todo"""
    todo = TodoItem(title="Test", priority="normal")
    test_db.add(todo)
    test_db.commit()

    # Mark as completed
    todo.completed = True
    from datetime import datetime

    todo.completed_at = datetime.utcnow()
    test_db.commit()

    assert todo.completed is True
    assert todo.completed_at is not None
