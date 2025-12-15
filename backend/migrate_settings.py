#!/usr/bin/env python3
"""
Database migration to add settings table for LLM configuration
"""
import sqlite3
from pathlib import Path

def migrate_settings():
    """Add settings table to existing database"""

    # Find database file
    db_paths = [
        Path("vienna_life.db"),
        Path("viennalife.db"),
        Path("../viennalife.db"),
        Path("data/vienna_life.db")
    ]

    db_path = None
    for path in db_paths:
        if path.exists():
            db_path = path
            break

    if not db_path:
        print("Database file not found")
        return False

    print(f"Found database: {db_path}")

    try:
        conn = sqlite3.connect(str(db_path))
        cursor = conn.cursor()

        # Check if settings table already exists
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='settings'")
        if cursor.fetchone():
            print("Settings table already exists")
            conn.close()
            return True

        # Create settings table
        cursor.execute("""
            CREATE TABLE settings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                key VARCHAR(100) UNIQUE NOT NULL,
                value TEXT,
                is_encrypted BOOLEAN DEFAULT 0,
                category VARCHAR(50) DEFAULT 'general',
                description VARCHAR(255),
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        """)

        # Create index on key
        cursor.execute("CREATE INDEX idx_settings_key ON settings(key)")
        cursor.execute("CREATE INDEX idx_settings_category ON settings(category)")

        # Insert default settings
        default_settings = [
            ("llm_provider", "ollama", 0, "llm", "Primary LLM provider (ollama, openai, anthropic)"),
            ("ollama_base_url", "http://localhost:11434", 0, "llm", "Ollama server URL"),
            ("ollama_default_model", "llama3.2:3b", 0, "llm", "Default Ollama model"),
            ("openai_api_key", "", 1, "llm", "OpenAI API key"),
            ("openai_default_model", "gpt-4o-mini", 0, "llm", "Default OpenAI model"),
            ("anthropic_api_key", "", 1, "llm", "Anthropic API key"),
            ("anthropic_default_model", "claude-3-5-haiku-20241022", 0, "llm", "Default Anthropic model")
        ]

        cursor.executemany("""
            INSERT INTO settings (key, value, is_encrypted, category, description)
            VALUES (?, ?, ?, ?, ?)
        """, default_settings)

        conn.commit()
        conn.close()

        print("Settings table created and populated with defaults")
        return True

    except Exception as e:
        print(f"Migration failed: {e}")
        return False

if __name__ == "__main__":
    print("Migrating database to add settings table...")
    success = migrate_settings()
    if success:
        print("Migration completed successfully!")
    else:
        print("Migration failed!")
        exit(1)
