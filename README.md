# 🏠 House Price Prediction

![Python](https://img.shields.io/badge/Python-3.11-3776AB?logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![scikit-learn](https://img.shields.io/badge/scikit--learn-F7931E?logo=scikitlearn&logoColor=white)
![Random Forest](https://img.shields.io/badge/Model-Random%20Forest-darkgreen)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![Status](https://img.shields.io/badge/Status-Completed-success)
![Last Commit](https://img.shields.io/github/last-commit/12345678910Ganna/ML-house-price-prediction)

A full-stack machine learning project that predicts residential property prices in India from listing attributes such as location, carpet area, floor, bathrooms, furnishing, ownership, transaction type, and facing direction. The project includes a cleaned training notebook, an exported scikit-learn pipeline, a production-ready FastAPI inference backend, and a modern React + TypeScript frontend.

## Features

- End-to-end machine learning workflow for house price prediction.
- Data cleaning for prices, floor values, area units, bathrooms, balconies, parking, and high-cardinality categories.
- Trained scikit-learn pipeline with preprocessing fully integrated.
- FastAPI backend with model loading, validation, CORS, health checks, and prediction endpoint.
- React + TypeScript frontend with client-side validation, location dropdown, loading state, error handling, and result page.
- Exported `house_price.pkl` model retained in the repository for reproducible inference.

## Architecture Diagram

```flowchart LR
    subgraph Frontend
        A[User]
        B[React + Vite]
        H[Result Page]
    end

    subgraph Backend
        C[FastAPI]
        D[Pydantic Validation]
        E[Preprocessing]
        F[scikit-learn Pipeline]
        G[Price Prediction]
    end

    A --> B
    B -->|POST /predict| C
    C --> D
    D --> E
    E --> F
    F --> G
    G --> C
    C -->|JSON Response| H
```

## Project Structure

```text
ML-house-price/
├── backend/
│   ├── app/
│   │   ├── api/routes/prediction.py
│   │   ├── core/config.py
│   │   ├── schemas/prediction.py
│   │   ├── services/inference.py
│   │   ├── services/preprocessing.py
│   │   ├── utils/logging_config.py
│   │   └── main.py
│   ├── models/
│   │   ├── house_price.pkl
│   │   └── locations.json
│   ├── tests/
│   ├── .env.example
│   └── requirements.txt
├── frontend/
│   ├── public/locations.json
│   ├── src/
│   │   ├── api/predictionClient.ts
│   │   ├── components/PredictionForm.tsx
│   │   ├── pages/
│   │   ├── styles/global.css
│   │   ├── types/prediction.ts
│   │   └── App.tsx
│   ├── .env.example
│   └── package.json
├── notebooks/
│   ├── house_price_model.ipynb
│   ├── house_price.pkl
│   └── locations.json
├── .env.example
├── .gitignore
├── README.md
└── requirements.txt
```

## Tech Stack

- **Machine Learning:** Python, pandas, NumPy, scikit-learn, joblib
- **Backend:** FastAPI, Pydantic, Uvicorn
- **Frontend:** React, TypeScript, Vite, React Router, CSS
- **Testing:** pytest, FastAPI TestClient
- **Model Artifact:** scikit-learn `Pipeline` exported with joblib

## Dataset Link

Dataset: [House Price Dataset on Kaggle](https://www.kaggle.com/datasets/juhibhojani/house-price)

## Dataset Download Instructions

1. Open the Kaggle dataset link.
2. Sign in to Kaggle.
3. Download the dataset archive.
4. Extract `house_prices.csv`.
5. Place `house_prices.csv` in the project root before running the notebook.

The raw dataset is intentionally ignored by Git because it is large and should be downloaded from Kaggle.

## Live Demo

Frontend:
https://ml-house-price-prediction.vercel.app/

> Note: The frontend is deployed for demonstration purposes. Backend API hosting is not currently available, so prediction requests are disabled in the live demo.

## Installation

Clone the repository and move into the project directory:

```bash
git clone https://github.com/<your-username>/ML-house-price.git
cd ML-house-price
```

## Backend Setup

Create and activate a Python virtual environment:

```bash
python -m venv .venv
.venv\Scripts\activate
```

Install backend dependencies:

```bash
pip install -r backend/requirements.txt
```

Create the backend environment file:

```bash
copy backend\.env.example backend\.env
```

Run the API:

```bash
cd backend
uvicorn app.main:app --reload
```

The backend runs at `http://localhost:8000`.

## Frontend Setup

Install frontend dependencies:

```bash
cd frontend
npm install
```

Create the frontend environment file:

```bash
copy .env.example .env
```

Run the frontend:

```bash
npm run dev
```

The frontend runs at `http://localhost:5173`.

## Running the Project (Windows)

After installing the dependencies, you can simply run:

```bash
run_project.bat
```

Or run each service separately:

```bash
run_backend.bat
```

```bash
run_frontend.bat
```

## Environment Variables

Root example file: `.env.example`

Backend variables:

| Variable | Description | Default |
| --- | --- | --- |
| `APP_NAME` | FastAPI application name | `House Price Prediction API` |
| `ENVIRONMENT` | Runtime environment | `production` |
| `LOG_LEVEL` | Logging level | `INFO` |
| `MODEL_PATH` | Path to exported model | `models/house_price.pkl` |
| `LOCATIONS_PATH` | Path to known locations JSON | `models/locations.json` |

Frontend variables:

| Variable | Description | Default |
| --- | --- | --- |
| `VITE_API_BASE_URL` | FastAPI backend base URL | `http://localhost:8000` |

## API Documentation

FastAPI automatically provides interactive documentation when the backend is running:

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`
- Health check: `GET /health`
- Prediction: `POST /predict`

### `GET /health`

Returns API availability.

```json
{
  "status": "ok"
}
```

### `POST /predict`

Request body:

```json
{
  "location": "thane",
  "carpet_area_sqft": 1200,
  "floor_num": 3,
  "bathroom": 2,
  "balcony": 1,
  "furnishing": "Semi-Furnished",
  "transaction": "Resale",
  "ownership": "Freehold",
  "facing": "East"
}
```

## Example curl Request

```bash
curl -X POST "http://localhost:8000/predict" \
  -H "Content-Type: application/json" \
  -d '{
    "location": "thane",
    "carpet_area_sqft": 1200,
    "floor_num": 3,
    "bathroom": 2,
    "balcony": 1,
    "furnishing": "Semi-Furnished",
    "transaction": "Resale",
    "ownership": "Freehold",
    "facing": "East"
  }'
```

## Example Response

```json
{
  "predicted_price": 8750000.0
}
```

## Model Training Summary

The notebook performs a complete supervised regression workflow:

- Loads and audits `house_prices.csv`.
- Converts price strings such as `42 Lac` and `1.5 Cr` into numeric rupee values.
- Converts carpet area and super area into square feet.
- Normalizes floor, bathroom, balcony, and parking values.
- Groups rare `location` and `Society` values into `other`.
- Removes extreme outliers using the 1st and 99th percentile of price per square foot.
- Trains models through scikit-learn pipelines with imputation, scaling, and one-hot encoding.
- Exports the best model to `house_price.pkl`.

## Model Comparison

| Model | MAE | RMSE | R² |
| --- | ---: | ---: | ---: |
| RandomForestRegressor | 954,640.10 | 3,566,923.00 | 0.9281 |
| GradientBoostingRegressor | 2,370,879.00 | 4,245,843.00 | 0.8982 |
| LinearRegression | 2,800,395.00 | 5,103,262.00 | 0.8529 |

## Final Metrics

The selected model is `RandomForestRegressor` because it achieved the lowest test RMSE and highest R² among the evaluated models.

| Metric | Value |
| --- | ---: |
| MAE | 954,640.10 |
| RMSE | 3,566,923.00 |
| R² | 0.9281 |
| 5-Fold CV Mean R² | 0.9412 |


## Contributors

- Ganna
- ![Stars](https://img.shields.io/github/stars/12345678910Ganna/ML-house-price-prediction?style=social)
- ![Forks](https://img.shields.io/github/forks/12345678910Ganna/ML-house-price-prediction?style=social)
