"""
Settings and Configuration Models
Stores API keys, provider preferences, and user settings
"""
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text
from sqlalchemy.sql import func
from models.base import Base


class Settings(Base):
    """User settings and API configuration"""
    __tablename__ = "settings"

    id = Column(Integer, primary_key=True, index=True)
    key = Column(String(100), unique=True, nullable=False, index=True)
    value = Column(Text, nullable=True)
    is_encrypted = Column(Boolean, default=False)
    category = Column(String(50), default="general")  # general, llm, mcp, etc.
    description = Column(String(255))
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    def to_dict(self):
        return {
            "id": self.id,
            "key": self.key,
            "value": self.value if not self.is_encrypted else "***encrypted***",
            "is_encrypted": self.is_encrypted,
            "category": self.category,
            "description": self.description,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }


# Default settings that should be initialized
DEFAULT_SETTINGS = [
    {
        "key": "llm_provider",
        "value": "ollama",
        "category": "llm",
        "description": "Primary LLM provider (ollama, openai, anthropic)"
    },
    {
        "key": "ollama_base_url",
        "value": "http://localhost:11434",
        "category": "llm",
        "description": "Ollama server URL"
    },
    {
        "key": "ollama_default_model",
        "value": "llama3.2:3b",
        "category": "llm",
        "description": "Default Ollama model"
    },
    {
        "key": "openai_api_key",
        "value": "",
        "is_encrypted": True,
        "category": "llm",
        "description": "OpenAI API key"
    },
    {
        "key": "openai_default_model",
        "value": "gpt-4o-mini",
        "category": "llm",
        "description": "Default OpenAI model"
    },
    {
        "key": "anthropic_api_key",
        "value": "",
        "is_encrypted": True,
        "category": "llm",
        "description": "Anthropic API key"
    },
    {
        "key": "anthropic_default_model",
        "value": "claude-3-5-haiku-20241022",
        "category": "llm",
        "description": "Default Anthropic model"
    }
]
