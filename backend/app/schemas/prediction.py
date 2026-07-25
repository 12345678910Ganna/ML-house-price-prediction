"""Request and response schemas for price predictions."""

from pydantic import BaseModel, ConfigDict, Field


class PredictionRequest(BaseModel):
    """Validated public input used to estimate a house price."""

    model_config = ConfigDict(str_strip_whitespace=True)

    location: str = Field(min_length=1, max_length=100)
    carpet_area_sqft: float = Field(gt=0, le=1_000_000)
    floor_num: int = Field(ge=-1, le=500)
    bathroom: int = Field(ge=0, le=50)
    balcony: int = Field(ge=0, le=50)
    furnishing: str = Field(min_length=1, max_length=100)
    transaction: str = Field(min_length=1, max_length=100)
    ownership: str = Field(min_length=1, max_length=100)
    facing: str = Field(min_length=1, max_length=100)


class PredictionResponse(BaseModel):
    """Predicted property price in Indian rupees."""

    predicted_price: float = Field(ge=0)
