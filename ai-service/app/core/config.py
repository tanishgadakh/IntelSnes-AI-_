from pydantic import BaseSettings, Field


class Settings(BaseSettings):
    APP_NAME: str = Field("IntelSense AI", env="APP_NAME")
    ENVIRONMENT: str = Field("development", env="ENVIRONMENT")
    API_PREFIX: str = Field("/api/v1", env="API_PREFIX")
    DATABASE_URL: str = Field(..., env="DATABASE_URL")
    REDIS_URL: str = Field(..., env="REDIS_URL")
    JWT_SECRET: str = Field("change-me-local-intelsense-ai-jwt-signing-key-2026", env="JWT_SECRET")
    JWT_ALGORITHM: str = Field("HS256", env="JWT_ALGORITHM")
    MODEL_CACHE_DIR: str = Field("/models", env="MODEL_CACHE_DIR")
    USE_DUMMY_MODELS: bool = Field(True, env="USE_DUMMY_MODELS")
    LOG_LEVEL: str = Field("INFO", env="LOG_LEVEL")

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
