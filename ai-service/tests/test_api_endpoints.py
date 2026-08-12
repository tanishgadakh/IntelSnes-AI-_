import json
from fastapi.testclient import TestClient
from app.main import app
from app.core.security import encode_jwt


client = TestClient(app)


def get_auth_headers():
    token = encode_jwt({"sub": "test", "role": "ANALYST"})
    return {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}


def test_assistant_endpoint_returns_structure():
    headers = get_auth_headers()
    payload = {"prompt": "The product is good but delivery slow"}
    resp = client.post(f"/api/v1/assistant", json=payload, headers=headers)
    assert resp.status_code == 200
    data = resp.json()
    assert "summary" in data
    assert "sentiment" in data
    # assistant returns an 'explanation' field with model explainability
    assert "explanation" in data


def test_analytics_overview_endpoint():
    headers = get_auth_headers()
    resp = client.get(f"/api/v1/analytics/overview", headers=headers)
    assert resp.status_code == 200
    data = resp.json()
    assert "total_events" in data
    assert "negative_ratio_percent" in data
