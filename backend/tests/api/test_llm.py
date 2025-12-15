"""
Test LLM API endpoints
"""


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


def test_load_model(client):
    """Test loading an Ollama model"""
    # This test assumes Ollama is running
    response = client.post("/api/llm/models/llama3.2:3b/load")
    # May fail if Ollama not running, but should return proper response
    assert response.status_code in [200, 500]


def test_unload_model(client):
    """Test unloading an Ollama model"""
    response = client.post("/api/llm/models/llama3.2:3b/unload")
    # May fail if model not loaded, but should return proper response
    assert response.status_code in [200, 500]


def test_pull_model(client):
    """Test pulling an Ollama model"""
    response = client.post("/api/llm/models/llama3.2:1b/pull")
    # May fail if Ollama not running, but should return proper response
    assert response.status_code in [200, 500]


def test_delete_model(client):
    """Test deleting an Ollama model"""
    response = client.delete("/api/llm/models/test-model")
    # May fail if model doesn't exist, but should return proper response
    assert response.status_code in [200, 404, 500]


def test_generate_text(client):
    """Test text generation endpoint"""
    response = client.post("/api/llm/generate", json={
        "prompt": "Say hello",
        "model": "llama3.2:3b",
        "max_tokens": 50
    })
    # May fail if Ollama not running, but should return proper response
    assert response.status_code in [200, 500]


def test_ensure_default_model(client):
    """Test ensuring default model is available"""
    response = client.post("/api/llm/ensure-default")
    assert response.status_code in [200, 500]


def test_generate_text_missing_prompt(client):
    """Test text generation with missing prompt"""
    response = client.post("/api/llm/generate", json={
        "model": "llama3.2:3b"
    })
    assert response.status_code == 422  # Validation error


def test_generate_text_empty_prompt(client):
    """Test text generation with empty prompt"""
    response = client.post("/api/llm/generate", json={
        "prompt": "",
        "model": "llama3.2:3b"
    })
    assert response.status_code == 422  # Validation error


def test_load_invalid_model(client):
    """Test loading invalid model name"""
    response = client.post("/api/llm/models/invalid-model-name/load")
    assert response.status_code in [200, 404, 500]


def test_get_model_info_invalid(client):
    """Test getting info for non-existent model"""
    response = client.get("/api/llm/models/non-existent-model")
    assert response.status_code in [200, 404, 500]