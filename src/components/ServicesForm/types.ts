export type CommissionKind = "live" | "custom" | "lni";
export type OtherSelection = "logo" | "illustration";

// The state of the quote form. A field that has no value yet holds "".
export interface QuoteFormData {
  // All forms
  type: CommissionKind | "";
  firstName: string;
  lastName: string;
  email: string;
  extraDetails: string;

  // Live caricatures
  location: string;
  event: string;
  headcount: string;
  date: string; // "MM/DD/YYYY"
  startTime: Date | "";
  endTime: Date | "";

  // Calculated fields. The server gives the distance as text, such as "12.3 mi".
  distance: number | string;
  totalDistance: number;
  gasCost: number;
  wage: number;
  eventTime: number;
  eventCost: number;
  totalCost: number;

  // Custom caricatures. The input gives text, and update() changes it to a number.
  personCount: number | string;
  personCountPrice: number;
  background: string; // "", "0", "50" or "75"
  textOption: string; // "", "0" or "25"
  textContent: string;
  description: string;

  // Calculated field
  customCost: number;

  // Logos and illustrations
  other: { type: OtherSelection; price: number }[];
  otherSelection: OtherSelection | "";
  otherPrice: number | string;

  // Description
  additionalInfo: string;
}

// A wrong field name, or a value of the wrong type for the field, does not compile.
export type UpdateQuoteForm = <K extends keyof QuoteFormData>(
  field: K,
  value: QuoteFormData[K]
) => void;

// The fields that accept any text. A text input can write to these only.
export type TextFieldKey = {
  [K in keyof QuoteFormData]-?: string extends QuoteFormData[K] ? K : never;
}[keyof QuoteFormData];
