"""
Settings Service
Manages application settings and API keys stored in database
"""
from sqlalchemy.orm import Session
from typing import Dict, Any, Optional, List
import logging
from models.settings import Settings, DEFAULT_SETTINGS
from models.base import get_db

logger = logging.getLogger(__name__)


class SettingsService:
    """Service for managing application settings"""

    def __init__(self):
        pass

    def initialize_defaults(self, db: Session):
        """Initialize default settings if they don't exist"""
        for default in DEFAULT_SETTINGS:
            existing = db.query(Settings).filter(Settings.key == default["key"]).first()
            if not existing:
                setting = Settings(
                    key=default["key"],
                    value=default["value"],
                    is_encrypted=default.get("is_encrypted", False),
                    category=default.get("category", "general"),
                    description=default.get("description", "")
                )
                db.add(setting)

        db.commit()

    def get_setting(self, db: Session, key: str) -> Optional[str]:
        """Get a setting value by key"""
        setting = db.query(Settings).filter(Settings.key == key).first()
        return setting.value if setting else None

    def set_setting(self, db: Session, key: str, value: str, category: str = "general",
                   description: str = "", is_encrypted: bool = False):
        """Set a setting value"""
        setting = db.query(Settings).filter(Settings.key == key).first()

        if setting:
            setting.value = value
            setting.category = category
            setting.description = description
            setting.is_encrypted = is_encrypted
        else:
            setting = Settings(
                key=key,
                value=value,
                category=category,
                description=description,
                is_encrypted=is_encrypted
            )
            db.add(setting)

        db.commit()
        db.refresh(setting)
        return setting.to_dict()

    def get_all_settings(self, db: Session, category: Optional[str] = None) -> List[Dict[str, Any]]:
        """Get all settings, optionally filtered by category"""
        query = db.query(Settings)
        if category:
            query = query.filter(Settings.category == category)

        settings = query.all()
        return [setting.to_dict() for setting in settings]

    def delete_setting(self, db: Session, key: str) -> bool:
        """Delete a setting"""
        setting = db.query(Settings).filter(Settings.key == key).first()
        if setting:
            db.delete(setting)
            db.commit()
            return True
        return False

    def get_llm_config(self, db: Session) -> Dict[str, Any]:
        """Get LLM configuration for all providers"""
        config = {}

        # Get provider preference
        config["provider"] = self.get_setting(db, "llm_provider") or "ollama"

        # Ollama settings
        config["ollama"] = {
            "base_url": self.get_setting(db, "ollama_base_url") or "http://localhost:11434",
            "default_model": self.get_setting(db, "ollama_default_model") or "llama3.2:3b"
        }

        # OpenAI settings
        config["openai"] = {
            "api_key": self.get_setting(db, "openai_api_key") or "",
            "default_model": self.get_setting(db, "openai_default_model") or "gpt-4o-mini"
        }

        # Anthropic settings
        config["anthropic"] = {
            "api_key": self.get_setting(db, "anthropic_api_key") or "",
            "default_model": self.get_setting(db, "anthropic_default_model") or "claude-3-5-haiku-20241022"
        }

        return config

    def update_llm_config(self, db: Session, provider: str, settings: Dict[str, Any]):
        """Update LLM configuration for a provider"""
        if provider == "ollama":
            for key, value in settings.items():
                self.set_setting(db, f"ollama_{key}", value, "llm", f"Ollama {key}")
        elif provider == "openai":
            for key, value in settings.items():
                is_encrypted = key == "api_key"
                self.set_setting(db, f"openai_{key}", value, "llm", f"OpenAI {key}", is_encrypted)
        elif provider == "anthropic":
            for key, value in settings.items():
                is_encrypted = key == "api_key"
                self.set_setting(db, f"anthropic_{key}", value, "llm", f"Anthropic {key}", is_encrypted)
        else:
            # Update provider preference
            self.set_setting(db, "llm_provider", provider, "llm", "Primary LLM provider")


# Global instance
settings_service = SettingsService()
