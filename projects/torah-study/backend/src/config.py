from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """Application settings"""

    # Database
    database_url: str = "postgresql://user:password@localhost:5432/torah_study"

    # API
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    debug: bool = True

    # Sefaria API
    sefaria_base_url: str = "https://www.sefaria.org/api/v3"
    sefaria_user_agent: str = "TorahStudyApp/1.0"

    # Cache
    cache_ttl_days: int = 30

    class Config:
        env_file = ".env"
        case_sensitive = False


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance"""
    return Settings()
