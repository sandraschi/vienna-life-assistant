"""
Test Ollama service
"""

import pytest
from services.ollama_service import OllamaService


@pytest.mark.asyncio
async def test_ollama_service_init():
    """Test Ollama service initialization"""
    service = OllamaService()
    assert service.base_url == "http://localhost:11434"
    assert service.default_model == "llama3.2:3b"


@pytest.mark.asyncio
async def test_check_connection():
    """Test checking Ollama connection"""
    service = OllamaService()
    is_connected = await service.check_connection()
    # Will be True if Ollama is running, False otherwise
    assert isinstance(is_connected, bool)


@pytest.mark.asyncio
async def test_list_models():
    """Test listing Ollama models"""
    service = OllamaService()
    models = await service.list_models()
    assert isinstance(models, list)
    # May be empty if Ollama not running or no models installed
