"""
Ollama LLM Service
Manages local LLM models via Ollama
"""

import httpx
from typing import List, Dict, Any, Optional
import logging

logger = logging.getLogger(__name__)


class OllamaService:
    """Service for managing Ollama LLM models"""

    def __init__(self, base_url: str = "http://localhost:11434"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.default_model = "llama3.2:3b"  # Reasonable default - fast and capable
        self.timeout = 60.0

    async def check_connection(self) -> bool:
        """Check if Ollama is running and accessible"""
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                # Try the API endpoint instead of root
                response = await client.get(f"{self.api_url}/tags")
                return response.status_code == 200
        except httpx.ConnectError as e:
            logger.warning(f"Ollama connection failed: {e}")
            return False
        except httpx.TimeoutException as e:
            logger.warning(f"Ollama connection timeout: {e}")
            return False
        except Exception as e:
            logger.warning(f"Ollama not accessible: {e}")
            return False

    async def list_models(self) -> List[Dict[str, Any]]:
        """
        List all available models

        Returns:
            List of model dictionaries with name, size, modified date
        """
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.get(f"{self.api_url}/tags")
                response.raise_for_status()

                data = response.json()
                models = data.get("models", [])

                logger.info(f"Found {len(models)} Ollama models")
                return models

        except Exception as e:
            logger.error(f"Failed to list models: {e}")
            return []

    async def load_model(self, model_name: str) -> Dict[str, Any]:
        """
        Load a model into memory

        Args:
            model_name: Name of the model to load

        Returns:
            Status dictionary
        """
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                # Generate a simple prompt to load the model
                payload = {"model": model_name, "prompt": "Hello", "stream": False}

                response = await client.post(f"{self.api_url}/generate", json=payload)
                response.raise_for_status()

                logger.info(f"Loaded model: {model_name}")
                return {
                    "success": True,
                    "model": model_name,
                    "message": f"Model {model_name} loaded successfully",
                }

        except Exception as e:
            logger.error(f"Failed to load model {model_name}: {e}")
            return {"success": False, "model": model_name, "error": str(e)}

    async def unload_model(self, model_name: str) -> Dict[str, Any]:
        """
        Unload a model from memory

        Note: Ollama doesn't have explicit unload API, but we can try to free memory
        """
        # Ollama automatically manages memory, so this is informational
        return {
            "success": True,
            "model": model_name,
            "message": f"Model {model_name} will be unloaded by Ollama automatically when needed",
        }

    async def get_running_models(self) -> List[Dict[str, Any]]:
        """
        Get currently running models

        Returns:
            List of running model info
        """
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.get(f"{self.api_url}/ps")
                response.raise_for_status()

                data = response.json()
                models = data.get("models", [])

                return models

        except Exception as e:
            logger.error(f"Failed to get running models: {e}")
            return []

    async def pull_model(self, model_name: str) -> Dict[str, Any]:
        """
        Pull/download a model from Ollama library

        Args:
            model_name: Name of the model to pull (e.g., "llama3.2:3b")

        Returns:
            Status dictionary
        """
        try:
            async with httpx.AsyncClient(
                timeout=300.0
            ) as client:  # Long timeout for downloads
                payload = {"name": model_name}

                response = await client.post(f"{self.api_url}/pull", json=payload)
                response.raise_for_status()

                logger.info(f"Pulled model: {model_name}")
                return {
                    "success": True,
                    "model": model_name,
                    "message": f"Model {model_name} pulled successfully",
                }

        except Exception as e:
            logger.error(f"Failed to pull model {model_name}: {e}")
            return {"success": False, "model": model_name, "error": str(e)}

    async def delete_model(self, model_name: str) -> Dict[str, Any]:
        """
        Delete a model

        Args:
            model_name: Name of the model to delete

        Returns:
            Status dictionary
        """
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                payload = {"name": model_name}

                response = await client.delete(f"{self.api_url}/delete", json=payload)
                response.raise_for_status()

                logger.info(f"Deleted model: {model_name}")
                return {
                    "success": True,
                    "model": model_name,
                    "message": f"Model {model_name} deleted successfully",
                }

        except Exception as e:
            logger.error(f"Failed to delete model {model_name}: {e}")
            return {"success": False, "model": model_name, "error": str(e)}

    async def ensure_default_model(self) -> Dict[str, Any]:
        """
        Ensure default model is available, pull if not

        Returns:
            Status dictionary
        """
        models = await self.list_models()
        model_names = [m.get("name", "") for m in models]

        if self.default_model not in model_names:
            logger.info(f"Default model {self.default_model} not found, pulling...")
            return await self.pull_model(self.default_model)
        else:
            logger.info(f"Default model {self.default_model} already available")
            return {
                "success": True,
                "model": self.default_model,
                "message": "Default model already available",
            }

    async def generate(
        self, prompt: str, model: Optional[str] = None, system: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Generate text completion

        Args:
            prompt: The prompt to generate from
            model: Model to use (defaults to default_model)
            system: System prompt

        Returns:
            Generation result
        """
        try:
            model_name = model or self.default_model

            payload = {"model": model_name, "prompt": prompt, "stream": False}

            if system:
                payload["system"] = system

            async with httpx.AsyncClient(timeout=120.0) as client:
                response = await client.post(f"{self.api_url}/generate", json=payload)
                response.raise_for_status()

                data = response.json()

                return {
                    "success": True,
                    "model": model_name,
                    "response": data.get("response", ""),
                    "done": data.get("done", False),
                }

        except Exception as e:
            logger.error(f"Generation failed: {e}")
            return {"success": False, "error": str(e)}


# Global Ollama service instance
ollama_service = OllamaService()
