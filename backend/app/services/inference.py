"""Model lifecycle and prediction orchestration."""

import json
import logging
from pathlib import Path
from typing import Any

import joblib

from app.schemas.prediction import PredictionRequest
from app.services.preprocessing import build_feature_frame


logger = logging.getLogger(__name__)


class HousePriceInferenceService:
    """Loads the serialized model and serves validated price predictions."""

    def __init__(self, model_path: Path, locations_path: Path) -> None:
        self._model_path = model_path
        self._locations_path = locations_path
        self._model: Any | None = None
        self._known_locations: frozenset[str] = frozenset()

    def load(self) -> None:
        """Load model artifacts once during application startup."""

        if not self._model_path.is_file():
            raise FileNotFoundError(f"Model file not found: {self._model_path}")
        if not self._locations_path.is_file():
            raise FileNotFoundError(f"Locations file not found: {self._locations_path}")

        self._model = joblib.load(self._model_path)
        with self._locations_path.open(encoding="utf-8") as locations_file:
            locations = json.load(locations_file)

        if not isinstance(locations, list) or not all(
            isinstance(location, str) for location in locations
        ):
            raise ValueError("locations.json must contain a JSON list of strings")

        self._known_locations = frozenset(location.lower() for location in locations)
        logger.info("Loaded model and %d supported locations", len(self._known_locations))

    def predict(self, request: PredictionRequest) -> float:
        """Return a non-negative predicted price for a validated request."""

        if self._model is None:
            raise RuntimeError("Prediction service is not initialized")

        feature_frame = build_feature_frame(request, self._known_locations)
        prediction = float(self._model.predict(feature_frame)[0])
        return max(0.0, prediction)
