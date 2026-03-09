from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Union


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    cors_origins: Union[str, list[str]] = [
        "http://localhost:5173",  # Vite Dev Server Component
        "http://127.0.0.1:5173",
    ]
    host: str = "0.0.0.0"
    port: int = 8000
    log_level: str = "info"
    hf_home: str = ""
    supported_models: list[str] = ["gpt2", "bert-base-uncased"]

    @field_validator("cors_origins", mode="before")
    @classmethod
    def parse_cors_origins(cls, v):
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(",") if origin.strip()]
        return v


settings = Settings()
