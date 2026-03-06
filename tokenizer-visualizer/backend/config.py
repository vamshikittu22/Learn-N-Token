from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    cors_origins: list = [
        "http://localhost:5173", # Vite Dev Server Component
        "http://127.0.0.1:5173"
    ]
    supported_models: list = ["gpt2", "bert-base-uncased"]

settings = Settings()
