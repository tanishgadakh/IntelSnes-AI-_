from fastapi import APIRouter, Body, HTTPException
from pydantic import BaseModel
from app.services.ai_manager import AIManager

router = APIRouter()


class SwitchModelRequest(BaseModel):
    model: str
    version: str


@router.get("/admin")
async def admin():
    return {"status": "ok"}


@router.get("/admin/models")
async def list_models():
    return AIManager.list_models()


@router.post("/admin/models/switch")
async def switch_model(payload: SwitchModelRequest = Body(...)):
    ok = await AIManager.switch_model_version(payload.model, payload.version)
    if not ok:
        raise HTTPException(status_code=400, detail="Failed to switch model version")
    return {"status": "ok", "model": payload.model, "version": payload.version}
