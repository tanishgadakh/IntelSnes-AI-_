from __future__ import annotations

from urllib.parse import quote_plus, urlparse, urlunparse

from pydantic import BaseSettings, Field

from app.core.settings.database import DatabaseSettings


class Settings(BaseSettings):
    APP_NAME: str = Field("IntelSense AI", env="APP_NAME")
    ENVIRONMENT: str = Field("development", env="ENVIRONMENT")
    API_PREFIX: str = Field("/api/v1", env="API_PREFIX")
    DATABASE_URL: str | None = Field(None, env="DATABASE_URL")
    REDIS_URL: str = Field(..., env="REDIS_URL")
    JWT_SECRET: str = Field("change-me-local-intelsense-ai-jwt-signing-key-2026", env="JWT_SECRET")
    JWT_ALGORITHM: str = Field("HS256", env="JWT_ALGORITHM")
    MODEL_CACHE_DIR: str = Field("/models", env="MODEL_CACHE_DIR")
    USE_DUMMY_MODELS: bool = Field(False, env="USE_DUMMY_MODELS")
    LOG_LEVEL: str = Field("INFO", env="LOG_LEVEL")

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

    @staticmethod
    def _normalize_database_url(url: str) -> str:
        parsed = urlparse(url)
        if parsed.username is None or parsed.password is None:
            return url

        username = quote_plus(parsed.username)
        password = quote_plus(parsed.password)
        host = parsed.hostname or ""
        port = f":{parsed.port}" if parsed.port else ""
        netloc = f"{username}:{password}@{host}{port}"
        return urlunparse(parsed._replace(netloc=netloc))

    @property
    def database_url(self) -> str:
        if self.DATABASE_URL:
            return self._normalize_database_url(self.DATABASE_URL)
        return DatabaseSettings().dsn


settings = Settings()
