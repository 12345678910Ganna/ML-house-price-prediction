import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { loadLocations, predictHousePrice } from "../api/predictionClient";
import PredictionForm from "../components/PredictionForm";
import type { PredictionRequest } from "../types/prediction";

export default function HomePage(): JSX.Element {
  const navigate = useNavigate();
  const [locations, setLocations] = useState<string[]>([]);
  const [pageError, setPageError] = useState<string>("");
  const [isLoadingLocations, setIsLoadingLocations] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    async function fetchLocations(): Promise<void> {
      try {
        const loadedLocations = await loadLocations();
        if (isMounted) {
          setLocations(loadedLocations);
        }
      } catch (error) {
        if (isMounted) {
          setPageError(
            error instanceof Error
              ? error.message
              : "Locations could not be loaded.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoadingLocations(false);
        }
      }
    }

    void fetchLocations();

    return () => {
      isMounted = false;
    };
  }, []);

  async function handlePredict(payload: PredictionRequest): Promise<void> {
    setIsSubmitting(true);
    setPageError("");

    try {
      const response = await predictHousePrice(payload);
      navigate("/result", {
        state: {
          predictedPrice: response.predicted_price,
          request: payload,
        },
      });
    } catch (error) {
      setPageError(
        error instanceof Error
          ? error.message
          : "Prediction could not be completed.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="page-shell">
      <section className="hero-panel">
        <div className="hero-copy">
          <p className="eyebrow">Machine Learning Price Estimator</p>
          <h1>Predict residential property prices with clean model inputs.</h1>
          <p>
            Enter the core listing details and get an estimated sale price from
            the trained house price prediction pipeline.
          </p>
        </div>

        <div className="form-card">
          <div className="form-heading">
            <span>Prediction Form</span>
            <strong>India housing data</strong>
          </div>

          {pageError ? <div className="alert">{pageError}</div> : null}

          {isLoadingLocations ? (
            <div className="loading-panel">
              <span className="spinner" aria-hidden="true" />
              Loading locations...
            </div>
          ) : (
            <PredictionForm
              locations={locations}
              isSubmitting={isSubmitting}
              onSubmit={handlePredict}
            />
          )}
        </div>
      </section>
    </main>
  );
}
