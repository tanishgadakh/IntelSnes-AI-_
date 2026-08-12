from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.dependency import get_db_session
from app.repositories.alert_repository import AlertRepository

router = APIRouter()


@router.get('/alerts')
async def list_alerts(limit: int = 50, db: AsyncSession = Depends(get_db_session)):
    repo = AlertRepository(db)
    alerts = await repo.list_recent(limit=limit)
    return [
        {
            'id': a.id,
            'level': a.level,
            'message': a.message,
            'payload': a.payload,
            'created_at': a.created_at.isoformat() if a.created_at else None,
        }
        for a in alerts
    ]
