"""
LLM Service for Vienna Life Assistant

Handles interactions with Large Language Models for AI-powered features.
This integrates with both local Ollama and cloud LLM providers.
"""

import logging
from typing import Dict, Any, Optional
from services.ollama_service import ollama_service
from services.cloud_llm_service import cloud_llm_service
from services.settings_service import settings_service
from models.base import SessionLocal

logger = logging.getLogger(__name__)

class LLMService:
    """
    Unified LLM service that routes requests to appropriate providers
    based on user settings and availability.
    """

    def __init__(self):
        self.logger = logging.getLogger(__name__)

    async def generate_response(self, prompt: str, **kwargs) -> str:
        """
        Generate a response using the configured LLM provider.

        Args:
            prompt: The input prompt
            **kwargs: Additional parameters (model, temperature, etc.)

        Returns:
            str: Generated response
        """
        try:
            # Get user settings to determine which LLM to use
            db = SessionLocal()
            try:
                settings = settings_service.get_settings(db)
                use_cloud = settings.use_cloud_llm
                provider = settings.llm_provider

                if use_cloud and provider in ["openai", "anthropic"]:
                    # Use cloud LLM
                    api_key = settings.openai_api_key if provider == "openai" else settings.anthropic_api_key
                    if api_key:
                        # TODO: Implement cloud LLM call
                        return f"Cloud {provider} response would go here"
                    else:
                        self.logger.warning(f"{provider} API key not configured, falling back to Ollama")

                # Fall back to Ollama (local LLM)
                result = await ollama_service.generate(
                    prompt=prompt,
                    model=kwargs.get('model', 'llama3.2:3b'),
                    system=kwargs.get('system', '')
                )
                return result.get('response', 'No response generated')

            finally:
                db.close()

        except Exception as e:
            self.logger.error(f"LLM generation failed: {e}")
            return "Sorry, I encountered an error while generating a response."

    def generate_sync_response(self, prompt: str, **kwargs) -> str:
        """
        Synchronous version for non-async contexts.
        """
        import asyncio
        return asyncio.run(self.generate_response(prompt, **kwargs))

# Global instance
llm_service = LLMService()
