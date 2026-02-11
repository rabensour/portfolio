from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    # API Keys
    anthropic_api_key: str

    # Database
    database_path: str = "./data/newsletter.db"

    # CORS
    cors_origins: List[str] = ["http://localhost:5175"]

    # Mailgun
    mailgun_webhook_secret: str = ""

    # Claude AI
    claude_model: str = "claude-sonnet-4-5-20250929"


settings = Settings()
