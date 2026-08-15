import pytest
from sqlalchemy.exc import OperationalError

from app.database import session


class DummySession:
        self.rollback_called = False

    async def commit(self):
        raise RuntimeError("db unavailable")

    async def rollback(self):
        self.rollback_called = True


class DummySessionContext:
    def __init__(self, session_obj):
        self.session_obj = session_obj

    async def __aenter__(self):
        return self.session_obj

    async def __aexit__(self, exc_type, exc, tb):
        return False


class DummySessionFactory:
    def __init__(self, session_obj):
        self.session_obj = session_obj

    def __call__(self):
        return DummySessionContext(self.session_obj)


@pytest.mark.asyncio
async def test_get_db_suppresses_commit_failures_and_rolls_back(monkeypatch):
    db_session = DummySession()
    monkeypatch.setattr(session, "async_session", DummySessionFactory(db_session))

    async with session.get_db() as current_session:
        assert current_session is db_session

    assert db_session.rollback_called is True


def test_login_returns_503_when_database_unavailable(monkeypatch):
    from app.main import app
    from fastapi.testclient import TestClient

    def raise_db_error(self, email):
        raise OperationalError("SELECT 1", {}, Exception("Can't connect to MySQL server on 'localhost'"))

    monkeypatch.setattr("app.repositories.user_repository.UserRepository.get_by_email", raise_db_error)

    with TestClient(app) as client:
        response = client.post("/api/v1/auth/login", json={"username": "demo", "password": "demo123"})

    assert response.status_code == 503
    assert "Database unavailable" in response.json()["message"]
