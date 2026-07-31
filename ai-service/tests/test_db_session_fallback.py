import pytest

from app.database import session


class DummySession:
    def __init__(self):
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
