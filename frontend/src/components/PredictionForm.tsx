import { FormEvent, useMemo, useState } from "react";

import type {
  PredictionFormErrors,
  PredictionFormValues,
  PredictionRequest,
} from "../types/prediction";

const FURNISHING_OPTIONS = ["Furnished", "Semi-Furnished", "Unfurnished"];
const TRANSACTION_OPTIONS = ["New Property", "Resale"];
const OWNERSHIP_OPTIONS = [
  "Freehold",
  "Leasehold",
  "Co-operative Society",
  "Power Of Attorney",
];
const FACING_OPTIONS = [
  "East",
  "West",
  "North",
  "South",
  "North - East",
  "North - West",
  "South - East",
  "South - West",
];

const INITIAL_VALUES: PredictionFormValues = {
  location: "",
  carpetAreaSqft: "",
  floorNum: "",
  bathroom: "",
  balcony: "",
  furnishing: "",
  transaction: "",
  ownership: "",
  facing: "",
};

interface PredictionFormProps {
  locations: string[];
  isSubmitting: boolean;
  onSubmit: (payload: PredictionRequest) => Promise<void>;
}

function formatLocationLabel(location: string): string {
  return location
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function isMissing(value: string): boolean {
  return value.trim().length === 0;
}

function parseNumber(value: string): number {
  return Number(value.trim());
}

function validatePositiveNumber(
  value: string,
  fieldName: string,
): string | undefined {
  if (isMissing(value)) {
    return `${fieldName} is required.`;
  }

  const parsedValue = parseNumber(value);
  if (!Number.isFinite(parsedValue) || parsedValue <= 0) {
    return `${fieldName} must be greater than 0.`;
  }

  return undefined;
}

function validateNonNegativeNumber(
  value: string,
  fieldName: string,
  minimumValue = 0,
): string | undefined {
  if (isMissing(value)) {
    return `${fieldName} is required.`;
  }

  const parsedValue = parseNumber(value);
  if (!Number.isInteger(parsedValue) || parsedValue < minimumValue) {
    return `${fieldName} must be a whole number of at least ${minimumValue}.`;
  }

  return undefined;
}

function validateRequired(value: string, fieldName: string): string | undefined {
  return isMissing(value) ? `${fieldName} is required.` : undefined;
}

function validateForm(values: PredictionFormValues): PredictionFormErrors {
  const errors: PredictionFormErrors = {
    location: validateRequired(values.location, "Location"),
    carpetAreaSqft: validatePositiveNumber(values.carpetAreaSqft, "Carpet area"),
    floorNum: validateNonNegativeNumber(values.floorNum, "Floor", -1),
    bathroom: validateNonNegativeNumber(values.bathroom, "Bathroom"),
    balcony: validateNonNegativeNumber(values.balcony, "Balcony"),
    furnishing: validateRequired(values.furnishing, "Furnishing"),
    transaction: validateRequired(values.transaction, "Transaction"),
    ownership: validateRequired(values.ownership, "Ownership"),
    facing: validateRequired(values.facing, "Facing"),
  };

  return Object.fromEntries(
    Object.entries(errors).filter(([, message]) => Boolean(message)),
  ) as PredictionFormErrors;
}

function toPredictionRequest(values: PredictionFormValues): PredictionRequest {
  return {
    location: values.location,
    carpet_area_sqft: parseNumber(values.carpetAreaSqft),
    floor_num: parseNumber(values.floorNum),
    bathroom: parseNumber(values.bathroom),
    balcony: parseNumber(values.balcony),
    furnishing: values.furnishing,
    transaction: values.transaction,
    ownership: values.ownership,
    facing: values.facing,
  };
}

function hasErrors(errors: PredictionFormErrors): boolean {
  return Object.keys(errors).length > 0;
}

export default function PredictionForm({
  locations,
  isSubmitting,
  onSubmit,
}: PredictionFormProps): JSX.Element {
  const [values, setValues] = useState<PredictionFormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<PredictionFormErrors>({});

  const sortedLocations = useMemo(
    () =>
      [...locations].sort((firstLocation, secondLocation) =>
        formatLocationLabel(firstLocation).localeCompare(
          formatLocationLabel(secondLocation),
        ),
      ),
    [locations],
  );

  function updateValue(field: keyof PredictionFormValues, value: string): void {
    setValues((currentValues) => ({ ...currentValues, [field]: value }));
    setErrors((currentErrors) => ({ ...currentErrors, [field]: undefined }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    const validationErrors = validateForm(values);
    setErrors(validationErrors);

    if (hasErrors(validationErrors)) {
      return;
    }

    await onSubmit(toPredictionRequest(values));
  }

  return (
    <form className="prediction-form" onSubmit={handleSubmit} noValidate>
      <div className="form-grid">
        <label className="field">
          <span>Location</span>
          <select
            value={values.location}
            onChange={(event) => updateValue("location", event.target.value)}
          >
            <option value="">Select location</option>
            {sortedLocations.map((location) => (
              <option key={location} value={location}>
                {formatLocationLabel(location)}
              </option>
            ))}
          </select>
          {errors.location && <small>{errors.location}</small>}
        </label>

        <label className="field">
          <span>Carpet Area</span>
          <input
            min="1"
            inputMode="decimal"
            placeholder="1200"
            type="number"
            value={values.carpetAreaSqft}
            onChange={(event) =>
              updateValue("carpetAreaSqft", event.target.value)
            }
          />
          {errors.carpetAreaSqft && <small>{errors.carpetAreaSqft}</small>}
        </label>

        <label className="field">
          <span>Floor</span>
          <input
            min="-1"
            inputMode="numeric"
            placeholder="3"
            type="number"
            value={values.floorNum}
            onChange={(event) => updateValue("floorNum", event.target.value)}
          />
          {errors.floorNum && <small>{errors.floorNum}</small>}
        </label>

        <label className="field">
          <span>Bathroom</span>
          <input
            min="0"
            inputMode="numeric"
            placeholder="2"
            type="number"
            value={values.bathroom}
            onChange={(event) => updateValue("bathroom", event.target.value)}
          />
          {errors.bathroom && <small>{errors.bathroom}</small>}
        </label>

        <label className="field">
          <span>Balcony</span>
          <input
            min="0"
            inputMode="numeric"
            placeholder="1"
            type="number"
            value={values.balcony}
            onChange={(event) => updateValue("balcony", event.target.value)}
          />
          {errors.balcony && <small>{errors.balcony}</small>}
        </label>

        <label className="field">
          <span>Furnishing</span>
          <select
            value={values.furnishing}
            onChange={(event) => updateValue("furnishing", event.target.value)}
          >
            <option value="">Select furnishing</option>
            {FURNISHING_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errors.furnishing && <small>{errors.furnishing}</small>}
        </label>

        <label className="field">
          <span>Transaction</span>
          <select
            value={values.transaction}
            onChange={(event) => updateValue("transaction", event.target.value)}
          >
            <option value="">Select transaction</option>
            {TRANSACTION_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errors.transaction && <small>{errors.transaction}</small>}
        </label>

        <label className="field">
          <span>Ownership</span>
          <select
            value={values.ownership}
            onChange={(event) => updateValue("ownership", event.target.value)}
          >
            <option value="">Select ownership</option>
            {OWNERSHIP_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errors.ownership && <small>{errors.ownership}</small>}
        </label>

        <label className="field">
          <span>Facing</span>
          <select
            value={values.facing}
            onChange={(event) => updateValue("facing", event.target.value)}
          >
            <option value="">Select facing</option>
            {FACING_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errors.facing && <small>{errors.facing}</small>}
        </label>
      </div>

      <button className="primary-button" disabled={isSubmitting} type="submit">
        {isSubmitting ? <span className="spinner" aria-hidden="true" /> : null}
        {isSubmitting ? "Predicting..." : "Predict Price"}
      </button>
    </form>
  );
}
