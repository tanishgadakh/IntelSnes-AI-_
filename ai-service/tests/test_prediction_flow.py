from app.core.security import encode_jwt


def test_docs_endpoint_is_public(client):
    resp = client.get("/docs")
    assert resp.status_code == 200
    assert "swagger" in resp.text.lower()


def test_predict_endpoint(client):
    token = encode_jwt({"sub": "unit-test", "role": "test"})
    resp = client.post(
        "/api/v1/predict",
        json={"text": "I love this product!", "source": "unit-test"},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["input_text"] == "I love this product!"
    assert "result" in data
