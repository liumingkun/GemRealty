from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    OPENROUTER_API_KEY: str = "your_openrouter_api_key_here"
    OPENROUTER_MODEL: str = ""
    CREA_DDF_USERNAME: Optional[str] = None
    CREA_DDF_PASSWORD: Optional[str] = None
    DATABASE_URL: str = "sqlite+aiosqlite:///./app/data/gemrealty.db"

    
    # Use .env file if it exists
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

settings = Settings()
