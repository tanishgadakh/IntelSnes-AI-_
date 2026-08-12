import pytest
from httpx import AsyncClient
from app.main import app
from unittest.mock import patch, AsyncMock


@pytest.mark.asyncio
async def test_password_reset_and_confirm(monkeypatch):
    """Test complete password reset flow: request link, then confirm with new password."""
    sent = {}

    async with AsyncClient(app=app, base_url='http://test') as ac:
        # Mock the email send to capture token
        def fake_send(email, token):
            sent['email'] = email
            sent['token'] = token
            return True

        monkeypatch.setattr('app.api.auth.send_password_reset', fake_send)

        # Step 1: Request password reset
        res = await ac.post('/api/v1/auth/password-reset', json={'email': 'demo@company.com'})
        assert res.status_code == 200
        assert sent.get('email') == 'demo@company.com'
        
        # Verify token was generated
        token = sent.get('token')
        assert token

        # Step 2: Confirm reset with new password
        res2 = await ac.post('/api/v1/auth/password-reset/confirm', json={
            'token': token,
            'new_password': 'NewPassword123!'
        })
        assert res2.status_code == 200
        assert res2.json()['status'] == 'ok'


@pytest.mark.asyncio
async def test_password_reset_weak_password(monkeypatch):
    """Test that weak passwords are rejected."""
    sent = {}

    async with AsyncClient(app=app, base_url='http://test') as ac:
        def fake_send(email, token):
            sent['email'] = email
            sent['token'] = token
            return True

        monkeypatch.setattr('app.api.auth.send_password_reset', fake_send)

        # Request reset
        res = await ac.post('/api/v1/auth/password-reset', json={'email': 'demo@company.com'})
        assert res.status_code == 200
        token = sent.get('token')

        # Try to confirm with weak password (too short)
        res2 = await ac.post('/api/v1/auth/password-reset/confirm', json={
            'token': token,
            'new_password': 'weak'
        })
        assert res2.status_code == 400
        assert 'weak' in res2.json()['detail'].lower()


@pytest.mark.asyncio
async def test_invalid_reset_token(monkeypatch):
    """Test that invalid tokens are rejected."""
    async with AsyncClient(app=app, base_url='http://test') as ac:
        # Try to confirm with invalid token
        res = await ac.post('/api/v1/auth/password-reset/confirm', json={
            'token': 'invalid.token.here',
            'new_password': 'NewPassword123!'
        })
        assert res.status_code == 400
        assert 'invalid' in res.json()['detail'].lower() or 'expired' in res.json()['detail'].lower()
