"""
Cloud LLM Service
Supports OpenAI, Anthropic, and other cloud LLM providers
"""
import httpx
from typing import List, Dict, Any, Optional
import logging
import json
from enum import Enum

logger = logging.getLogger(__name__)


class LLMProvider(Enum):
    """Supported LLM providers"""
    OPENAI = "openai"
    ANTHROPIC = "anthropic"


class CloudLLMService:
    """Service for managing cloud LLM providers"""

    def __init__(self):
        self.timeout = 60.0
        self.providers = {}

    def configure_provider(self, provider: LLMProvider, api_key: str, base_url: Optional[str] = None):
        """Configure a cloud LLM provider"""
        self.providers[provider.value] = {
            "api_key": api_key,
            "base_url": base_url or self._get_default_base_url(provider)
        }

    def _get_default_base_url(self, provider: LLMProvider) -> str:
        """Get default base URL for provider"""
        urls = {
            LLMProvider.OPENAI: "https://api.openai.com/v1",
            LLMProvider.ANTHROPIC: "https://api.anthropic.com"
        }
        return urls.get(provider, "")

    async def check_connection(self, provider: LLMProvider) -> bool:
        """Check if provider API is accessible"""
        if provider.value not in self.providers:
            return False

        try:
            # Simple test request
            if provider == LLMProvider.OPENAI:
                return await self._test_openai_connection()
            elif provider == LLMProvider.ANTHROPIC:
                return await self._test_anthropic_connection()
            return False
        except Exception as e:
            logger.warning(f"Cloud LLM connection test failed for {provider.value}: {e}")
            return False

    async def _test_openai_connection(self) -> bool:
        """Test OpenAI API connection"""
        config = self.providers.get("openai")
        if not config:
            return False

        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(
                f"{config['base_url']}/models",
                headers={"Authorization": f"Bearer {config['api_key']}"}
            )
            return response.status_code == 200

    async def _test_anthropic_connection(self) -> bool:
        """Test Anthropic API connection"""
        config = self.providers.get("anthropic")
        if not config:
            return False

        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(
                f"{config['base_url']}/v1/messages",
                headers={
                    "x-api-key": config['api_key'],
                    "anthropic-version": "2023-06-01"
                },
                json={
                    "model": "claude-3-5-haiku-20241022",
                    "max_tokens": 1,
                    "messages": [{"role": "user", "content": "test"}]
                }
            )
            return response.status_code == 200

    async def generate(self, provider: LLMProvider, prompt: str, model: str,
                      system: Optional[str] = None, **kwargs) -> Dict[str, Any]:
        """
        Generate text using cloud LLM provider

        Args:
            provider: LLM provider to use
            prompt: User prompt
            model: Model name
            system: System prompt (optional)
            **kwargs: Additional parameters

        Returns:
            Dict with success status and response
        """
        try:
            if provider == LLMProvider.OPENAI:
                return await self._generate_openai(prompt, model, system, **kwargs)
            elif provider == LLMProvider.ANTHROPIC:
                return await self._generate_anthropic(prompt, model, system, **kwargs)
            else:
                return {
                    "success": False,
                    "error": f"Unsupported provider: {provider.value}"
                }
        except Exception as e:
            logger.error(f"Cloud LLM generation failed for {provider.value}: {e}")
            return {
                "success": False,
                "error": str(e)
            }

    async def _generate_openai(self, prompt: str, model: str,
                              system: Optional[str] = None, **kwargs) -> Dict[str, Any]:
        """Generate text using OpenAI"""
        config = self.providers.get("openai")
        if not config:
            return {"success": False, "error": "OpenAI not configured"}

        messages = []
        if system:
            messages.append({"role": "system", "content": system})
        messages.append({"role": "user", "content": prompt})

        async with httpx.AsyncClient(timeout=self.timeout) as client:
            response = await client.post(
                f"{config['base_url']}/chat/completions",
                headers={
                    "Authorization": f"Bearer {config['api_key']}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": model,
                    "messages": messages,
                    "temperature": kwargs.get("temperature", 0.7),
                    "max_tokens": kwargs.get("max_tokens", 1000),
                    "stream": kwargs.get("stream", False)
                }
            )

            if response.status_code == 200:
                data = response.json()
                return {
                    "success": True,
                    "response": data["choices"][0]["message"]["content"],
                    "usage": data.get("usage", {}),
                    "model": data.get("model")
                }
            else:
                return {
                    "success": False,
                    "error": f"OpenAI API error: {response.status_code} - {response.text}"
                }

    async def _generate_anthropic(self, prompt: str, model: str,
                                 system: Optional[str] = None, **kwargs) -> Dict[str, Any]:
        """Generate text using Anthropic"""
        config = self.providers.get("anthropic")
        if not config:
            return {"success": False, "error": "Anthropic not configured"}

        system_prompt = system or "You are a helpful assistant."

        async with httpx.AsyncClient(timeout=self.timeout) as client:
            response = await client.post(
                f"{config['base_url']}/v1/messages",
                headers={
                    "x-api-key": config['api_key'],
                    "anthropic-version": "2023-06-01",
                    "Content-Type": "application/json"
                },
                json={
                    "model": model,
                    "max_tokens": kwargs.get("max_tokens", 1000),
                    "temperature": kwargs.get("temperature", 0.7),
                    "system": system_prompt,
                    "messages": [{"role": "user", "content": prompt}],
                    "stream": kwargs.get("stream", False)
                }
            )

            if response.status_code == 200:
                data = response.json()
                return {
                    "success": True,
                    "response": data["content"][0]["text"],
                    "usage": data.get("usage", {}),
                    "model": data.get("model")
                }
            else:
                return {
                    "success": False,
                    "error": f"Anthropic API error: {response.status_code} - {response.text}"
                }

    async def list_models(self, provider: LLMProvider) -> List[Dict[str, Any]]:
        """List available models for provider"""
        try:
            if provider == LLMProvider.OPENAI:
                return await self._list_openai_models()
            elif provider == LLMProvider.ANTHROPIC:
                return self._list_anthropic_models()
            return []
        except Exception as e:
            logger.error(f"Failed to list models for {provider.value}: {e}")
            return []

    async def _list_openai_models(self) -> List[Dict[str, Any]]:
        """List OpenAI models"""
        config = self.providers.get("openai")
        if not config:
            return []

        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(
                f"{config['base_url']}/models",
                headers={"Authorization": f"Bearer {config['api_key']}"}
            )

            if response.status_code == 200:
                data = response.json()
                return [
                    {
                        "name": model["id"],
                        "owned_by": model["owned_by"],
                        "created": model["created"]
                    }
                    for model in data["data"]
                    if model["id"].startswith(("gpt-", "text-"))
                ]
            return []

    def _list_anthropic_models(self) -> List[Dict[str, Any]]:
        """List Anthropic models (static list)"""
        return [
            {
                "name": "claude-3-5-sonnet-20241022",
                "owned_by": "anthropic",
                "description": "Most intelligent model"
            },
            {
                "name": "claude-3-5-haiku-20241022",
                "owned_by": "anthropic",
                "description": "Fast and efficient"
            },
            {
                "name": "claude-3-opus-20240229",
                "owned_by": "anthropic",
                "description": "Powerful model (legacy)"
            },
            {
                "name": "claude-3-sonnet-20240229",
                "owned_by": "anthropic",
                "description": "Balanced model (legacy)"
            },
            {
                "name": "claude-3-haiku-20240307",
                "owned_by": "anthropic",
                "description": "Fast model (legacy)"
            }
        ]


# Global instance
cloud_llm_service = CloudLLMService()
