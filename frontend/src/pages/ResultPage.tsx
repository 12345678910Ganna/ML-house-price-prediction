import { Link, Navigate, useLocation } from "react-router-dom";

import type { PredictionResultState } from "../types/prediction";

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

function formatLabel(value: string): string {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default function ResultPage(): JSX.Element {
  const location = useLocation();
  const state = location.state as PredictionResultState | null;

  if (!state) {
    return <Navigate to="/" replace />;
  }

  return (
    <main className="page-shell result-shell">
      <section className="result-panel">
        <p className="eyebrow">Estimated Market Price</p>
        <h1>{formatPrice(state.predictedPrice)}</h1>
        <p>
          This estimate is generated from the trained pipeline using your
          submitted property attributes.
        </p>

        <div className="summary-grid">
          <div>
            <span>Location</span>
            <strong>{formatLabel(state.request.location)}</strong>
          </div>
          <div>
            <span>Carpet Area</span>
            <strong>{state.request.carpet_area_sqft.toLocaleString()} sqft</strong>
          </div>
          <div>
            <span>Floor</span>
            <strong>{state.request.floor_num}</strong>
          </div>
          <div>
            <span>Bathrooms</span>
            <strong>{state.request.bathroom}</strong>
          </div>
          <div>
            <span>Balconies</span>
            <strong>{state.request.balcony}</strong>
          </div>
          <div>
            <span>Furnishing</span>
            <strong>{state.request.furnishing}</strong>
          </div>
          <div>
            <span>Transaction</span>
            <strong>{state.request.transaction}</strong>
          </div>
          <div>
            <span>Ownership</span>
            <strong>{state.request.ownership}</strong>
          </div>
          <div>
            <span>Facing</span>
            <strong>{state.request.facing}</strong>
          </div>
        </div>

        <Link className="secondary-button" to="/">
          Make Another Prediction
        </Link>
      </section>
    </main>
  );
}
