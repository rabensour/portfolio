"""
Configuration loader for AI Coach system.
Loads settings from JSON files and environment variables.
"""

import json
import os
from pathlib import Path
from typing import Dict, Any
from dotenv import load_dotenv


class Config:
    """Configuration manager for AI Coach."""

    def __init__(self, base_path: str = None):
        """
        Initialize configuration.

        Args:
            base_path: Base path for the project (defaults to parent of this file)
        """
        if base_path is None:
            # Get the project root (two levels up from this file)
            self.base_path = Path(__file__).parent.parent
        else:
            self.base_path = Path(base_path)

        # Load environment variables
        env_path = self.base_path / ".env"
        load_dotenv(env_path)

        # Load settings
        self.settings = self._load_json("config/settings.json")
        self.collections_config = self._load_json("config/collections_config.json")

        # Get API key
        self.anthropic_api_key = os.getenv("ANTHROPIC_API_KEY")

        # Validate configuration
        self._validate()

    def _load_json(self, relative_path: str) -> Dict[str, Any]:
        """Load JSON configuration file."""
        file_path = self.base_path / relative_path

        if not file_path.exists():
            raise FileNotFoundError(f"Configuration file not found: {file_path}")

        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except json.JSONDecodeError as e:
            raise ValueError(f"Invalid JSON in {file_path}: {e}")

    def _validate(self):
        """Validate configuration values."""
        if not self.anthropic_api_key:
            raise ValueError(
                "ANTHROPIC_API_KEY not found in environment variables. "
                "Please create a .env file with your API key."
            )

        # Validate required settings
        required_settings = [
            "claude_model",
            "temperature",
            "max_tokens",
            "rag_top_k",
            "chunk_size",
            "chunk_overlap"
        ]

        for setting in required_settings:
            if setting not in self.settings:
                raise ValueError(f"Missing required setting: {setting}")

    def get_collection_path(self, collection_name: str) -> Path:
        """Get the source path for a collection."""
        if collection_name not in self.collections_config["collections"]:
            raise ValueError(f"Unknown collection: {collection_name}")

        relative_path = self.collections_config["collections"][collection_name]["source_path"]
        return self.base_path / relative_path

    def get_chroma_path(self) -> Path:
        """Get the ChromaDB persistence path."""
        return self.base_path / "data" / "chroma_db"

    def get_conversation_history_path(self) -> Path:
        """Get the conversation history path."""
        return self.base_path / "data" / "conversation_history"

    def get_prompt_template(self) -> str:
        """Load the coach system prompt template."""
        prompt_path = self.base_path / "config" / "coach_system_prompt.txt"

        if not prompt_path.exists():
            raise FileNotFoundError(f"Prompt template not found: {prompt_path}")

        with open(prompt_path, 'r', encoding='utf-8') as f:
            return f.read()

    @property
    def claude_model(self) -> str:
        """Get Claude model name."""
        return self.settings["claude_model"]

    @property
    def temperature(self) -> float:
        """Get temperature setting."""
        return self.settings["temperature"]

    @property
    def max_tokens(self) -> int:
        """Get max tokens setting."""
        return self.settings["max_tokens"]

    @property
    def rag_top_k(self) -> int:
        """Get number of chunks to retrieve for RAG."""
        return self.settings["rag_top_k"]

    @property
    def chunk_size(self) -> int:
        """Get chunk size for text splitting."""
        return self.settings["chunk_size"]

    @property
    def chunk_overlap(self) -> int:
        """Get chunk overlap for text splitting."""
        return self.settings["chunk_overlap"]

    @property
    def auto_ingest_history_every(self) -> int:
        """Get frequency for auto-ingesting conversation history."""
        return self.settings.get("auto_ingest_history_every", 5)

    @property
    def collections(self) -> Dict[str, Any]:
        """Get all collection configurations."""
        return self.collections_config["collections"]


# Global config instance (lazy-loaded)
_config_instance = None


def get_config(base_path: str = None) -> Config:
    """Get the global configuration instance."""
    global _config_instance
    if _config_instance is None:
        _config_instance = Config(base_path)
    return _config_instance
