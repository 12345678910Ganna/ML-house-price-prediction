"""Centralized application configuration."""

from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


BACKEND_DIR = Path(__file__).resolve().parents[2]


class Settings(BaseSettings):
    """Settings read from environment variables and an optional .env file."""

    model_config = SettingsConfigDict(
        env_file=BACKEND_DIR / ".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    app_name: str = "House Price Prediction API"
    environment: str = "production"
    log_level: str = "INFO"
    model_path: Path = BACKEND_DIR / "models" / "house_price.pkl"
    locations_path: Path = BACKEND_DIR / "models" / "locations.json"
    cors_origins: list[str] = [
    "http://localhost:5173",
    "https://ml-house-price-prediction.vercel.app/",
    ]


settings = Settings()
