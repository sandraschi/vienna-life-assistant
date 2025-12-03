"""
Test Todos API endpoints
"""
import pytest


def test_create_todo(client, sample_todo_data):
    """Test creating a todo"""
    response = client.post("/api/todos/", json=sample_todo_data)
    assert response.status_code == 201
    
    data = response.json()
    assert data["title"] == sample_todo_data["title"]
    assert data["description"] == sample_todo_data["description"]
    assert data["priority"] == sample_todo_data["priority"]
    assert data["category"] == sample_todo_data["category"]
    assert data["completed"] is False
    assert "id" in data


def test_list_todos_empty(client):
    """Test listing todos when none exist"""
    response = client.get("/api/todos/")
    assert response.status_code == 200
    
    data = response.json()
    assert data["total"] == 0
    assert data["todos"] == []


def test_list_todos_with_data(client, sample_todo_data):
    """Test listing todos after creating some"""
    # Create two todos
    client.post("/api/todos/", json=sample_todo_data)
    client.post("/api/todos/", json={**sample_todo_data, "title": "Second Todo"})
    
    response = client.get("/api/todos/")
    assert response.status_code == 200
    
    data = response.json()
    assert data["total"] == 2
    assert len(data["todos"]) == 2


def test_get_todo(client, sample_todo_data):
    """Test getting a specific todo"""
    # Create a todo
    create_response = client.post("/api/todos/", json=sample_todo_data)
    todo_id = create_response.json()["id"]
    
    # Get the todo
    response = client.get(f"/api/todos/{todo_id}")
    assert response.status_code == 200
    
    data = response.json()
    assert data["id"] == todo_id
    assert data["title"] == sample_todo_data["title"]


def test_get_nonexistent_todo(client):
    """Test getting a todo that doesn't exist"""
    response = client.get("/api/todos/nonexistent-id")
    assert response.status_code == 404


def test_update_todo(client, sample_todo_data):
    """Test updating a todo"""
    # Create a todo
    create_response = client.post("/api/todos/", json=sample_todo_data)
    todo_id = create_response.json()["id"]
    
    # Update it
    update_data = {"title": "Updated Title", "priority": "urgent"}
    response = client.patch(f"/api/todos/{todo_id}", json=update_data)
    assert response.status_code == 200
    
    data = response.json()
    assert data["title"] == "Updated Title"
    assert data["priority"] == "urgent"


def test_complete_todo(client, sample_todo_data):
    """Test marking a todo as complete"""
    # Create a todo
    create_response = client.post("/api/todos/", json=sample_todo_data)
    todo_id = create_response.json()["id"]
    
    # Complete it
    response = client.post(f"/api/todos/{todo_id}/complete")
    assert response.status_code == 200
    
    data = response.json()
    assert data["completed"] is True
    assert data["completed_at"] is not None


def test_uncomplete_todo(client, sample_todo_data):
    """Test unmarking a todo as complete"""
    # Create and complete a todo
    create_response = client.post("/api/todos/", json=sample_todo_data)
    todo_id = create_response.json()["id"]
    client.post(f"/api/todos/{todo_id}/complete")
    
    # Uncomplete it
    response = client.post(f"/api/todos/{todo_id}/uncomplete")
    assert response.status_code == 200
    
    data = response.json()
    assert data["completed"] is False
    assert data["completed_at"] is None


def test_delete_todo(client, sample_todo_data):
    """Test deleting a todo"""
    # Create a todo
    create_response = client.post("/api/todos/", json=sample_todo_data)
    todo_id = create_response.json()["id"]
    
    # Delete it
    response = client.delete(f"/api/todos/{todo_id}")
    assert response.status_code == 204
    
    # Verify it's gone
    get_response = client.get(f"/api/todos/{todo_id}")
    assert get_response.status_code == 404


def test_get_stats(client, sample_todo_data):
    """Test getting todo statistics"""
    # Create some todos
    client.post("/api/todos/", json=sample_todo_data)
    client.post("/api/todos/", json={**sample_todo_data, "priority": "urgent"})
    
    # Complete one
    todos_response = client.get("/api/todos/")
    first_todo_id = todos_response.json()["todos"][0]["id"]
    client.post(f"/api/todos/{first_todo_id}/complete")
    
    # Get stats
    response = client.get("/api/todos/stats")
    assert response.status_code == 200
    
    data = response.json()
    assert data["total"] == 2
    assert data["completed"] == 1
    assert data["pending"] == 1
    assert data["urgent"] >= 0


def test_filter_by_priority(client, sample_todo_data):
    """Test filtering todos by priority"""
    # Create todos with different priorities
    client.post("/api/todos/", json={**sample_todo_data, "priority": "urgent"})
    client.post("/api/todos/", json={**sample_todo_data, "priority": "normal"})
    client.post("/api/todos/", json={**sample_todo_data, "priority": "someday"})
    
    # Filter by urgent
    response = client.get("/api/todos/?priority=urgent")
    assert response.status_code == 200
    
    data = response.json()
    assert all(todo["priority"] == "urgent" for todo in data["todos"])


def test_filter_by_completed(client, sample_todo_data):
    """Test filtering todos by completion status"""
    # Create and complete one todo
    create_response = client.post("/api/todos/", json=sample_todo_data)
    todo_id = create_response.json()["id"]
    client.post(f"/api/todos/{todo_id}/complete")
    
    # Create another incomplete todo
    client.post("/api/todos/", json={**sample_todo_data, "title": "Incomplete"})
    
    # Filter by completed
    response = client.get("/api/todos/?completed=true")
    assert response.status_code == 200
    
    data = response.json()
    assert all(todo["completed"] is True for todo in data["todos"])
    
    # Filter by incomplete
    response = client.get("/api/todos/?completed=false")
    assert response.status_code == 200
    
    data = response.json()
    assert all(todo["completed"] is False for todo in data["todos"])

