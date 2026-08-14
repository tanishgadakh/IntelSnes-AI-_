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
    assert data["language"] == "en"
    assert isinstance(data["confidence"], float)
    assert "result" in data
    assert data["result"]["language"] == "en"
    assert data["result"]["confidence"] == data["confidence"]


def test_negative_review_recommendations_reference_real_issue():
    from app.ai.recommendation.recommend import recommend_actions

    recommendations = recommend_actions(
        {"label": "negative", "score": 0.8},
        {"joy": 0.72, "anger": 0.68, "sadness": 0.82},
        ["product", "quality", "delivery", "delay"],
        ["product_quality", "delivery"],
    )

    joined = " ".join(recommendations).lower()
    assert "delivery" in joined
    assert "delay" in joined
    assert "product quality" in joined
    assert "investigate the issues around" not in joined
    assert "prioritize follow-up on" not in joined
