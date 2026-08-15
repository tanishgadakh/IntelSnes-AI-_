from __future__ import annotations

from urllib.parse import quote_plus, urlparse, urlunparse

from pydantic import BaseSettings, Field

from app.core.settings.database import DatabaseSettings


class Settings(BaseSettings):
    APP_NAME: str = Field("IntelSense AI", env="APP_NAME")
    APP_URL: str = Field("http://localhost:8000", env="APP_URL")
    ENVIRONMENT: str = Field("development", env="ENVIRONMENT")
    API_PREFIX: str = Field("/api/v1", env="API_PREFIX")
    DATABASE_URL: str | None = Field(None, env="DATABASE_URL")
    REDIS_URL: str = Field(..., env="REDIS_URL")
    JWT_SECRET: str = Field("change-me-local-intelsense-ai-jwt-signing-key-2026", env="JWT_SECRET")
    JWT_ALGORITHM: str = Field("HS256", env="JWT_ALGORITHM")
    MODEL_CACHE_DIR: str = Field("/models", env="MODEL_CACHE_DIR")
    USE_DUMMY_MODELS: bool = Field(False, env="USE_DUMMY_MODELS")
    LOG_LEVEL: str = Field("INFO", env="LOG_LEVEL")
    # Alerting configuration
    SLACK_WEBHOOK: str | None = Field(None, env="SLACK_WEBHOOK")
    ALERT_EMAIL_TO: str | None = Field(None, env="ALERT_EMAIL_TO")
    ALERT_EMAIL_FROM: str | None = Field(None, env="ALERT_EMAIL_FROM")
    SMTP_HOST: str | None = Field(None, env="SMTP_HOST")
    SMTP_PORT: int | None = Field(None, env="SMTP_PORT")
    SMTP_USERNAME: str | None = Field(None, env="SMTP_USERNAME")
    SMTP_PASSWORD: str | None = Field(None, env="SMTP_PASSWORD")
    SMTP_USE_TLS: bool = Field(True, env="SMTP_USE_TLS")
    ALERT_NEGATIVE_RATIO_THRESHOLD: int | None = Field(30, env="ALERT_NEGATIVE_RATIO_THRESHOLD")
    ALERT_SCHEDULE_SECONDS: int | None = Field(300, env="ALERT_SCHEDULE_SECONDS")

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

    @staticmethod
    def _normalize_database_url(url: str) -> str:
        parsed = urlparse(url)
        if parsed.username is None or parsed.password is None:
            return url

        username = quote_plus(parsed.username)
        password = quote_plus(parsed.password.replace('%40', '@'))
        host = parsed.hostname or ""
        port = f":{parsed.port}" if parsed.port else ""
        netloc = f"{username}:{password}@{host}{port}"
        return urlunparse(parsed._replace(netloc=netloc))

    @property
    def database_url(self) -> str:
        if self.DATABASE_URL:
            normalized = self._normalize_database_url(self.DATABASE_URL)
            return normalized
        return DatabaseSettings().dsn


settings = Settings()
