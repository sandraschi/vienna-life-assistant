"""
Test LLM API endpoints
"""
import pytest


def test_get_llm_status(client):
    """Test getting LLM status"""
    response = client.get("/api/llm/status")
    assert response.status_code == 200
    
    data = response.json()
    assert "connected" in data
    assert "base_url" in data
    assert "default_model" in data


def test_list_models(client):
    """Test listing Ollama models"""
    response = client.get("/api/llm/models")
    assert response.status_code == 200
    
    data = response.json()
    assert "models" in data


def test_get_recommended_models(client):
    """Test getting recommended models"""
    response = client.get("/api/llm/recommended")
    assert response.status_code == 200
    
    data = response.json()
    assert "models" in data
    assert len(data["models"]) > 0
    
    # Check first model has required fields
    model = data["models"][0]
    assert "name" in model
    assert "size" in model
    assert "use_case" in model
    assert "speed" in model
    assert "quality" in model


def test_get_running_models(client):
    """Test getting running models"""
    response = client.get("/api/llm/models/running")
    assert response.status_code == 200
    
    data = response.json()
    assert "models" in data

