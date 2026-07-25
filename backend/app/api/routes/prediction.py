"""Health and prediction endpoints."""

import logging

from fastapi import APIRouter, HTTPException, Request, status

from app.schemas.prediction import PredictionRequest, PredictionResponse
from app.services.inference import HousePriceInferenceService


logger = logging.getLogger(__name__)
router = APIRouter(tags=["prediction"])


@router.get("/health")
def health_check() -> dict[str, str]:
    """Report that the API process is available."""

    return {"status": "ok"}


@router.post("/predict", response_model=PredictionResponse)
def predict_price(request: Request, payload: PredictionRequest) -> PredictionResponse:
    """Estimate a property price using the loaded pipeline."""

    service: HousePriceInferenceService = request.app.state.inference_service
    try:
        predicted_price = service.predict(payload)
    except Exception as exc:
        logger.exception("Prediction failed")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Prediction could not be completed.",
        ) from exc

    return PredictionResponse(predicted_price=predicted_price)
