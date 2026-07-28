"""FastAPI application entry point."""

from contextlib import asynccontextmanager
from typing import AsyncIterator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.prediction import router
from app.core.config import settings
from app.services.inference import HousePriceInferenceService
from app.utils.logging_config import configure_logging


@asynccontextmanager
async def lifespan(application: FastAPI) -> AsyncIterator[None]:
    """Initialize model resources before accepting requests."""

    configure_logging(settings.log_level)
    service = HousePriceInferenceService(settings.model_path, settings.locations_path)
    service.load()
    application.state.inference_service = service
    yield


app = FastAPI(title=settings.app_name, lifespan=lifespan)
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=settings.cors_origins,
#     allow_credentials=True,
#     allow_methods=["GET", "POST"],
#     allow_headers=["*"],
# )
app.add_middleware(
    CORSMiddleware,
    #allow_origins=["*"],
    allow_origins=[
    "https://ml-house-price-prediction.vercel.app" , 
    "http://localhost:5173/"
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(router)
