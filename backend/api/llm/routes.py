"""
LLM API Routes
Ollama model management and text generation
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from services.ollama_service import ollama_service
import logging

logger = logging.getLogger(__name__)

router = APIRouter()


class GenerateRequest(BaseModel):
    """Request model for text generation"""

    prompt: str
    model: Optional[str] = None
    system: Optional[str] = None


@router.get("/status")
async def get_llm_status():
    """Check if Ollama is running and accessible"""
    is_connected = await ollama_service.check_connection()

    if not is_connected:
        return {
            "connected": False,
            "message": "Ollama is not running or not accessible",
            "help": "Start Ollama with: ollama serve",
        }

    # Get running models
    running = await ollama_service.get_running_models()

    return {
        "connected": True,
        "base_url": ollama_service.base_url,
        "default_model": ollama_service.default_model,
        "running_models": running,
    }


@router.get("/models")
async def list_models():
    """List all available Ollama models"""
    models = await ollama_service.list_models()

    if not models:
        return {
            "models": [],
            "message": "No models found. Pull a model with: ollama pull llama3.2:3b",
        }

    return {"models": models, "default_model": ollama_service.default_model}


@router.post("/models/{model_name}/load")
async def load_model(model_name: str):
    """Load a model into memory"""
    result = await ollama_service.load_model(model_name)

    if not result.get("success"):
        raise HTTPException(status_code=400, detail=result.get("error"))

    return result


@router.post("/models/{model_name}/unload")
async def unload_model(model_name: str):
    """Unload a model from memory (informational - Ollama manages automatically)"""
    result = await ollama_service.unload_model(model_name)
    return result


@router.post("/models/{model_name}/pull")
async def pull_model(model_name: str):
    """Download a model from Ollama library"""
    result = await ollama_service.pull_model(model_name)

    if not result.get("success"):
        raise HTTPException(status_code=400, detail=result.get("error"))

    return result


@router.delete("/models/{model_name}")
async def delete_model(model_name: str):
    """Delete a model"""
    result = await ollama_service.delete_model(model_name)

    if not result.get("success"):
        raise HTTPException(status_code=400, detail=result.get("error"))

    return result


@router.get("/models/running")
async def get_running_models():
    """Get currently running models"""
    running = await ollama_service.get_running_models()
    return {"models": running}


@router.post("/generate")
async def generate_text(request: GenerateRequest):
    """
    Generate text completion using LLM

    - **prompt**: The text prompt
    - **model**: Model to use (optional, uses default if not specified)
    - **system**: System prompt (optional)
    """
    result = await ollama_service.generate(
        prompt=request.prompt, model=request.model, system=request.system
    )

    if not result.get("success"):
        raise HTTPException(status_code=400, detail=result.get("error"))

    return result


@router.post("/ensure-default")
async def ensure_default_model():
    """Ensure the default model is available (auto-pull if needed)"""
    result = await ollama_service.ensure_default_model()

    if not result.get("success"):
        raise HTTPException(status_code=400, detail=result.get("error"))

    return result


# Recommended models for different use cases
@router.get("/recommended")
async def get_recommended_models():
    """Get recommended models for different use cases"""
    return {
        "models": [
            {
                "name": "llama3.2:3b",
                "size": "~2GB",
                "use_case": "Fast general-purpose (default)",
                "speed": "very-fast",
                "quality": "good",
            },
            {
                "name": "llama3.2:1b",
                "size": "~1GB",
                "use_case": "Ultra-fast, low resource",
                "speed": "blazing-fast",
                "quality": "decent",
            },
            {
                "name": "llama3.1:8b",
                "size": "~4.5GB",
                "use_case": "Better quality, still fast",
                "speed": "fast",
                "quality": "very-good",
            },
            {
                "name": "mistral:7b",
                "size": "~4GB",
                "use_case": "Great for code and reasoning",
                "speed": "fast",
                "quality": "excellent",
            },
            {
                "name": "qwen2.5:7b",
                "size": "~4.5GB",
                "use_case": "Multilingual, excellent",
                "speed": "fast",
                "quality": "excellent",
            },
        ],
        "note": "Recommended default: llama3.2:3b (best balance of speed and quality)",
    }
