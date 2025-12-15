"""
LLM API Routes
Support for Ollama (local) and cloud LLM providers (OpenAI, Anthropic)
"""
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, Dict, Any
from sqlalchemy.orm import Session
from services.ollama_service import ollama_service
from services.cloud_llm_service import cloud_llm_service, LLMProvider
from services.settings_service import settings_service
from models.base import get_db
import logging

logger = logging.getLogger(__name__)

router = APIRouter()


class GenerateRequest(BaseModel):
    """Request model for text generation"""
    prompt: str
    model: Optional[str] = None
    system: Optional[str] = None
    provider: Optional[str] = None  # ollama, openai, anthropic


class LLMConfigUpdate(BaseModel):
    """Request model for updating LLM configuration"""
    provider: str
    settings: Dict[str, Any]


@router.get("/status")
async def get_llm_status(db: Session = Depends(get_db)):
    """Check LLM provider status and configuration"""
    config = settings_service.get_llm_config(db)
    provider = config["provider"]

    status = {
        "provider": provider,
        "config": config,
        "providers_status": {}
    }

    # Check Ollama status
    ollama_connected = await ollama_service.check_connection()
    status["providers_status"]["ollama"] = {
        "connected": ollama_connected,
        "base_url": config["ollama"]["base_url"],
        "default_model": config["ollama"]["default_model"]
    }
    if ollama_connected:
        running = await ollama_service.get_running_models()
        status["providers_status"]["ollama"]["running_models"] = running

    # Check cloud providers
    for cloud_provider in ["openai", "anthropic"]:
        api_key = config[cloud_provider]["api_key"]
        if api_key:
            try:
                provider_enum = LLMProvider(cloud_provider)
                cloud_llm_service.configure_provider(provider_enum, api_key)
                connected = await cloud_llm_service.check_connection(provider_enum)
                status["providers_status"][cloud_provider] = {
                    "configured": True,
                    "connected": connected,
                    "default_model": config[cloud_provider]["default_model"]
                }
            except Exception as e:
                status["providers_status"][cloud_provider] = {
                    "configured": True,
                    "connected": False,
                    "error": str(e)
                }
        else:
            status["providers_status"][cloud_provider] = {
                "configured": False,
                "message": f"{cloud_provider.title()} API key not configured"
            }

    return status


@router.get("/models")
async def list_models():
    """List all available Ollama models"""
    models = await ollama_service.list_models()
    
    if not models:
        return {
            "models": [],
            "message": "No models found. Pull a model with: ollama pull llama3.2:3b"
        }
    
    return {
        "models": models,
        "default_model": ollama_service.default_model
    }


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
async def generate_text(request: GenerateRequest, db: Session = Depends(get_db)):
    """
    Generate text completion using configured LLM provider

    - **prompt**: The text prompt
    - **model**: Model to use (optional, uses default if not specified)
    - **system**: System prompt (optional)
    - **provider**: LLM provider to use (optional, uses configured default)
    """
    config = settings_service.get_llm_config(db)
    provider = request.provider or config["provider"]

    if provider == "ollama":
        result = await ollama_service.generate(
            prompt=request.prompt,
            model=request.model or config["ollama"]["default_model"],
            system=request.system
        )
    elif provider in ["openai", "anthropic"]:
        provider_enum = LLMProvider(provider)
        api_key = config[provider]["api_key"]
        if not api_key:
            raise HTTPException(status_code=400, detail=f"{provider.title()} API key not configured")

        cloud_llm_service.configure_provider(provider_enum, api_key)
        result = await cloud_llm_service.generate(
            provider=provider_enum,
            prompt=request.prompt,
            model=request.model or config[provider]["default_model"],
            system=request.system
        )
    else:
        raise HTTPException(status_code=400, detail=f"Unsupported provider: {provider}")

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


@router.get("/config")
async def get_llm_config(db: Session = Depends(get_db)):
    """Get current LLM configuration"""
    return settings_service.get_llm_config(db)


@router.post("/config")
async def update_llm_config(request: LLMConfigUpdate, db: Session = Depends(get_db)):
    """Update LLM configuration"""
    try:
        result = settings_service.update_llm_config(db, request.provider, request.settings)
        return {"success": True, "message": "Configuration updated"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to update config: {str(e)}")


@router.get("/providers")
async def get_available_providers():
    """Get list of available LLM providers"""
    return {
        "providers": [
            {
                "id": "ollama",
                "name": "Ollama (Local)",
                "description": "Run LLMs locally on your machine",
                "requires_api_key": False,
                "models": ["llama3.2:3b", "llama3.2:1b", "llama3.1:8b", "mistral:7b", "qwen2.5:7b"]
            },
            {
                "id": "openai",
                "name": "OpenAI",
                "description": "GPT models via OpenAI API",
                "requires_api_key": True,
                "models": ["gpt-4o", "gpt-4o-mini", "gpt-4-turbo", "gpt-3.5-turbo"]
            },
            {
                "id": "anthropic",
                "name": "Anthropic",
                "description": "Claude models via Anthropic API",
                "requires_api_key": True,
                "models": ["claude-3-5-sonnet-20241022", "claude-3-5-haiku-20241022", "claude-3-opus-20240229"]
            }
        ]
    }


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
                "quality": "good"
            },
            {
                "name": "llama3.2:1b",
                "size": "~1GB",
                "use_case": "Ultra-fast, low resource",
                "speed": "blazing-fast",
                "quality": "decent"
            },
            {
                "name": "llama3.1:8b",
                "size": "~4.5GB",
                "use_case": "Better quality, still fast",
                "speed": "fast",
                "quality": "very-good"
            },
            {
                "name": "mistral:7b",
                "size": "~4GB",
                "use_case": "Great for code and reasoning",
                "speed": "fast",
                "quality": "excellent"
            },
            {
                "name": "qwen2.5:7b",
                "size": "~4.5GB",
                "use_case": "Multilingual, excellent",
                "speed": "fast",
                "quality": "excellent"
            }
        ],
        "note": "Recommended default: llama3.2:3b (best balance of speed and quality)"
    }

