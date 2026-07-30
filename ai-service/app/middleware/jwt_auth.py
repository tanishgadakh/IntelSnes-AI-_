import json
from typing import Callable
from fastapi import Request
from starlette.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from app.core.config import settings
from app.core.security import decode_jwt


class JWTAuthMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next: Callable):
        path = request.url.path
        public_paths = {
            "/",
            "/docs",
            "/docs/",
            "/openapi.json",
            "/favicon.ico",
            "/health",
            "/api/v1/health",
            "/api/v1/docs",
            "/api/v1/docs/",
            "/api/v1/openapi.json",
        }

        if path in public_paths or path.startswith("/docs") or path.startswith("/api/v1/docs"):
            return await call_next(request)

        auth_header = request.headers.get("Authorization", "")
        if not auth_header.startswith("Bearer "):
            return JSONResponse(status_code=401, content={"detail": "Missing bearer token"})

        token = auth_header.split(" ", 1)[1]
        try:
            payload = decode_jwt(token)
            request.state.user = payload
        except Exception:
            return JSONResponse(status_code=401, content={"detail": "Invalid token"})

        return await call_next(request)
