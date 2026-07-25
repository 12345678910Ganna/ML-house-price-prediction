import type { PredictionRequest, PredictionResponse } from "../types/prediction";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ?? "http://localhost:8000";
console.log("API_BASE_URL =", API_BASE_URL);

async function parseErrorMessage(response: Response): Promise<string> {
  try {
    const data = (await response.json()) as { detail?: unknown };
    if (typeof data.detail === "string") {
      return data.detail;
    }
  } catch {
    return "The prediction service returned an unexpected response.";
  }

  return "The prediction request could not be completed.";
}

export async function predictHousePrice(
  payload: PredictionRequest,
): Promise<PredictionResponse> {
  const response = await fetch(`${API_BASE_URL}/predict`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response));
  }

  return (await response.json()) as PredictionResponse;
}

export async function loadLocations(): Promise<string[]> {
  const response = await fetch("/locations.json");

  if (!response.ok) {
    throw new Error("Locations could not be loaded.");
  }

  return (await response.json()) as string[];
}
