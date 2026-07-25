"""API tests for prediction behavior and request validation."""

from fastapi.testclient import TestClient

from app.main import app


VALID_PAYLOAD = {
    "location": "thane",
    "carpet_area_sqft": 750.0,
    "floor_num": 5,
    "bathroom": 2,
    "balcony": 1,
    "furnishing": "Semi-Furnished",
    "transaction": "Resale",
    "ownership": "Freehold",
    "facing": "East",
}


def test_health_check() -> None:
    """The service reports a healthy process."""

    with TestClient(app) as client:
        response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_predict_returns_non_negative_price() -> None:
    """A valid request produces the documented prediction response."""

    with TestClient(app) as client:
        response = client.post("/predict", json=VALID_PAYLOAD)

    assert response.status_code == 200
    response_body = response.json()
    assert isinstance(response_body["predicted_price"], float)
    assert response_body["predicted_price"] >= 0


def test_predict_rejects_invalid_input() -> None:
    """Pydantic rejects invalid numeric inputs before inference."""

    invalid_payload = {**VALID_PAYLOAD, "carpet_area_sqft": 0}
    with TestClient(app) as client:
        response = client.post("/predict", json=invalid_payload)

    assert response.status_code == 422
