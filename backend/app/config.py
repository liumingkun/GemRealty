from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    GEMINI_API_KEY: str = "your_gemini_api_key_here"
    GEMINI_MODEL_ID: str = "gemini-2.5-flash"
    OPENROUTER_API_KEY: str = "your_openrouter_api_key_here"
    OPENROUTER_MODEL: str = ""
    CREA_DDF_USERNAME: Optional[str] = None
    CREA_DDF_PASSWORD: Optional[str] = None
    
    # Use .env file if it exists
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

settings = Settings()
