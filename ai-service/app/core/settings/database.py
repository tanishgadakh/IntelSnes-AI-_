"""Database configuration settings for the IntelSense AI service.

This module centralizes all database-related configuration values for the
FastAPI service and exposes them through a typed settings object. It is
intended to be used by the SQLAlchemy engine, session management layer,
and any database-dependent service components.
"""

from __future__ import annotations

from pydantic import BaseSettings, Field, validator


class DatabaseSettings(BaseSettings):
    """Typed settings for the shared MySQL database integration.

    These values are loaded from environment variables and optional local
    configuration files. The settings object is designed to support both
    local development and production deployment scenarios.
    """

    host: str = Field(default="localhost", env="DB_HOST")
    port: int = Field(default=3306, env="DB_PORT")
    username: str = Field(default="root", env="DB_USERNAME")
    password: str = Field(default="", env="DB_PASSWORD")
    database: str = Field(default="intelsense_ai", env="DB_NAME")
    charset: str = Field(default="utf8mb4", env="DB_CHARSET")
    pool_size: int = Field(default=10, env="DB_POOL_SIZE")
    max_overflow: int = Field(default=20, env="DB_MAX_OVERFLOW")
    pool_pre_ping: bool = Field(default=True, env="DB_POOL_PRE_PING")
    echo: bool = Field(default=False, env="DB_ECHO")
    ssl_disabled: bool = Field(default=True, env="DB_SSL_DISABLED")
    connect_timeout: int = Field(default=30, env="DB_CONNECT_TIMEOUT")
    isolation_level: str = Field(default="READ COMMITTED", env="DB_ISOLATION_LEVEL")
    timezone: str = Field(default="UTC", env="DB_TIMEZONE")

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False
        extra = "ignore"

    @validator("host", "username", "password", "database", pre=True, always=True)
    def validate_required_strings(cls, value: str) -> str:
        """Ensure string-based database fields are not blank."""
        if value is None:
            return ""
        return str(value).strip()

    @validator("port")
    def validate_port(cls, value: int) -> int:
        """Ensure the configured database port is valid."""
        if value <= 0 or value > 65535:
            raise ValueError("Database port must be between 1 and 65535")
        return value

    @validator("pool_size", "max_overflow", "connect_timeout")
    def validate_positive_int(cls, value: int) -> int:
        """Ensure numeric database settings are positive."""
        if value <= 0:
            raise ValueError("Database numeric settings must be greater than zero")
        return value

    @property
    def dsn(self) -> str:
        """Build a SQLAlchemy-compatible DSN string for MySQL."""
        password = self.password.replace("@", "%40") if self.password else ""
        return (
            f"mysql+aiomysql://{self.username}:{password}@{self.host}:{self.port}/"
            f"{self.database}?charset={self.charset}"
        )

    @property
    def sync_dsn(self) -> str:
        """Build a synchronous DSN string for migration tooling."""
        password = self.password.replace("@", "%40") if self.password else ""
        return (
            f"mysql+pymysql://{self.username}:{password}@{self.host}:{self.port}/"
            f"{self.database}?charset={self.charset}"
        )

    @property
    def pool_settings(self) -> dict[str, int | bool]:
        """Return SQLAlchemy pool configuration values."""
        return {
            "pool_size": self.pool_size,
            "max_overflow": self.max_overflow,
            "pool_pre_ping": self.pool_pre_ping,
        }

    @property
    def is_configured(self) -> bool:
        """Return whether the database settings appear to be usable."""
        return bool(self.host and self.database and self.username)


settings = DatabaseSettings()
