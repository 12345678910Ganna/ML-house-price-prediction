export interface PredictionRequest {
  location: string;
  carpet_area_sqft: number;
  floor_num: number;
  bathroom: number;
  balcony: number;
  furnishing: string;
  transaction: string;
  ownership: string;
  facing: string;
}

export interface PredictionResponse {
  predicted_price: number;
}

export interface PredictionResultState {
  predictedPrice: number;
  request: PredictionRequest;
}

export interface PredictionFormValues {
  location: string;
  carpetAreaSqft: string;
  floorNum: string;
  bathroom: string;
  balcony: string;
  furnishing: string;
  transaction: string;
  ownership: string;
  facing: string;
}

export type PredictionFormErrors = Partial<
  Record<keyof PredictionFormValues, string>
>;
