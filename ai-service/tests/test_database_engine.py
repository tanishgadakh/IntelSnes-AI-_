from app.database.engine import async_session, engine


def test_database_engine_exports_async_session_factory():
    assert engine is not None
    assert callable(async_session)
