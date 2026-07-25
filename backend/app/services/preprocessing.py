"""Transform public API inputs into the trained model feature contract."""

from collections.abc import Collection

import pandas as pd

from app.schemas.prediction import PredictionRequest


MODEL_FEATURES = [
    "carpet_area_sqft",
    "super_area_sqft",
    "floor_num",
    "bathroom_num",
    "balcony_num",
    "car_parking_num",
    "location",
    "Society",
    "Status",
    "Transaction",
    "Furnishing",
    "facing",
    "overlooking",
    "Ownership",
]


def normalize_location(location: str, known_locations: Collection[str]) -> str:
    """Return a trained location category or map an unseen one to ``other``."""

    normalized_location = location.strip().lower()
    return normalized_location if normalized_location in known_locations else "other"


def build_feature_frame(
    request: PredictionRequest,
    known_locations: Collection[str],
) -> pd.DataFrame:
    """Build one row with the exact names and order expected by the pipeline.

    The public API intentionally exposes only reliable listing fields. Features not
    collected by the request are set to missing values, allowing the model's fitted
    imputers to apply the same training-time defaults.
    """

    feature_values = {
        "carpet_area_sqft": request.carpet_area_sqft,
        "super_area_sqft": None,
        "floor_num": request.floor_num,
        "bathroom_num": request.bathroom,
        "balcony_num": request.balcony,
        "car_parking_num": None,
        "location": normalize_location(request.location, known_locations),
        "Society": None,
        "Status": None,
        "Transaction": request.transaction,
        "Furnishing": request.furnishing,
        "facing": request.facing,
        "overlooking": None,
        "Ownership": request.ownership,
    }
    return pd.DataFrame([feature_values], columns=MODEL_FEATURES)
