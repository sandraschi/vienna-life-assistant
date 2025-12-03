"""
Test Calendar API endpoints
"""
import pytest
from datetime import datetime, timedelta


def test_create_calendar_event(client, sample_calendar_event_data):
    """Test creating a calendar event"""
    response = client.post("/api/calendar/", json=sample_calendar_event_data)
    assert response.status_code == 201
    
    data = response.json()
    assert data["title"] == sample_calendar_event_data["title"]
    assert data["category"] == sample_calendar_event_data["category"]
    assert "id" in data


def test_list_calendar_events(client):
    """Test listing calendar events"""
    response = client.get("/api/calendar/")
    assert response.status_code == 200
    
    data = response.json()
    assert "events" in data
    assert "total" in data


def test_get_calendar_event(client, sample_calendar_event_data):
    """Test getting a specific calendar event"""
    # Create event
    create_response = client.post("/api/calendar/", json=sample_calendar_event_data)
    event_id = create_response.json()["id"]
    
    # Get event
    response = client.get(f"/api/calendar/{event_id}")
    assert response.status_code == 200
    
    data = response.json()
    assert data["id"] == event_id


def test_update_calendar_event(client, sample_calendar_event_data):
    """Test updating a calendar event"""
    # Create event
    create_response = client.post("/api/calendar/", json=sample_calendar_event_data)
    event_id = create_response.json()["id"]
    
    # Update it
    update_data = {"title": "Updated Event Title"}
    response = client.patch(f"/api/calendar/{event_id}", json=update_data)
    assert response.status_code == 200
    
    data = response.json()
    assert data["title"] == "Updated Event Title"


def test_delete_calendar_event(client, sample_calendar_event_data):
    """Test deleting a calendar event"""
    # Create event
    create_response = client.post("/api/calendar/", json=sample_calendar_event_data)
    event_id = create_response.json()["id"]
    
    # Delete it
    response = client.delete(f"/api/calendar/{event_id}")
    assert response.status_code == 204
    
    # Verify it's gone
    get_response = client.get(f"/api/calendar/{event_id}")
    assert get_response.status_code == 404


def test_invalid_event_times(client):
    """Test creating event with end time before start time"""
    now = datetime.now()
    invalid_data = {
        "title": "Invalid Event",
        "start_time": (now + timedelta(hours=2)).isoformat(),
        "end_time": now.isoformat(),  # End before start
        "category": "personal"
    }
    
    response = client.post("/api/calendar/", json=invalid_data)
    assert response.status_code == 400

