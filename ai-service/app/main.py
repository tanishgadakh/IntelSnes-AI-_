from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app import models  # noqa: F401  # register SQLAlchemy models before schema creation
from app.api import admin, alerts, analytics, assistant, auth, health, history, prediction, recommendation, reports, summary
from app.cache.redis_client import redis_client
from app.core.config import settings
from app.core.logging import init_logging
from app.database.session import init_db
from app.middleware.exception_handler import ExceptionMiddleware
from app.middleware.jwt_auth import JWTAuthMiddleware
from app.middleware.request_logging import RequestLoggingMiddleware
from app.services.ai_manager import AIManager
from fastapi.openapi.utils import get_openapi


def create_app() -> FastAPI:
    init_logging()
    app = FastAPI(
        title=settings.APP_NAME,
        openapi_url="/openapi.json",
        docs_url="/docs",
    )

    def custom_openapi():
        if app.openapi_schema:
            return app.openapi_schema
        openapi_schema = get_openapi(
            title=app.title,
            version="1.0.0",
            description="IntelSense AI service",
            routes=app.routes,
        )
        app.openapi_schema = openapi_schema
        return app.openapi_schema

    app.openapi = custom_openapi
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"] if settings.ENVIRONMENT == "development" else [],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    app.add_middleware(RequestLoggingMiddleware)
    app.add_middleware(ExceptionMiddleware)
    app.add_middleware(JWTAuthMiddleware)

    app.include_router(health.router, prefix=settings.API_PREFIX, tags=["health"])
    app.include_router(prediction.router, prefix=settings.API_PREFIX, tags=["prediction"])
    app.include_router(assistant.router, prefix=settings.API_PREFIX, tags=["assistant"])
    app.include_router(summary.router, prefix=settings.API_PREFIX, tags=["summary"])
    app.include_router(analytics.router, prefix=settings.API_PREFIX, tags=["analytics"])
    app.include_router(alerts.router, prefix=settings.API_PREFIX, tags=["alerts"])
    app.include_router(reports.router, prefix=settings.API_PREFIX, tags=["reports"])
    app.include_router(recommendation.router, prefix=settings.API_PREFIX, tags=["recommendation"])
    app.include_router(admin.router, prefix=settings.API_PREFIX, tags=["admin"])
    app.include_router(history.router, prefix=settings.API_PREFIX, tags=["history"])
    app.include_router(auth.router, prefix=settings.API_PREFIX, tags=["auth"])

    @app.on_event("startup")
    async def startup():
        await init_db()
        await redis_client.connect()
        await AIManager.initialize(use_dummy=settings.USE_DUMMY_MODELS)
        try:
            from app.services.alert_scheduler import AlertScheduler
            await AlertScheduler.start()
        except Exception:
            pass

    @app.on_event("shutdown")
    async def shutdown():
        await redis_client.close()
        try:
            from app.services.alert_scheduler import AlertScheduler
            await AlertScheduler.stop()
        except Exception:
            pass

    return app


app = create_app()
