from fastapi import Request
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from app.core.exceptions import ServiceError


class ExceptionMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        try:
            return await call_next(request)
        except ServiceError as se:
            return JSONResponse(status_code=se.code, content={"status": "error", "message": se.message})
        except ExceptionGroup as eg:
            # Handle Python 3.11+ ExceptionGroup from asyncio.TaskGroup
            # Extract and format sub-exceptions for clearer error responses
            messages = []
            for exc in eg.exceptions:
                if isinstance(exc, ServiceError):
                    messages.append(f"{exc.message} (code: {exc.code})")
                else:
                    messages.append(str(exc))
            error_msg = "; ".join(messages) if messages else "Multiple errors occurred"
            return JSONResponse(status_code=500, content={"status": "error", "message": error_msg})
        except Exception as e:
            return JSONResponse(status_code=500, content={"status": "error", "message": str(e)})
