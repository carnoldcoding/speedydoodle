// The price estimate that the quote form shows. The prices come from the server, and the
// server decides the final price when a quote is sent.
export interface Prices {
  liveHourlyRate: number;
  facesPerHour: number;
  customBase: number;
  // The added price for 0, 1, 2, and 3 people.
  customPeople: [number, number, number, number];
  customExtraPerson: number;
  backgroundSimple: number;
  backgroundComplex: number;
  words: number;
  logoHourlyRate: number;
  illustration: number;
}

export type Background = "none" | "simple" | "complex";
export type OtherChoice = "logo" | "illustration";

// Round to whole cents, the same way the server does.
const roundCurrency = (amount: number) => Math.round((amount + Number.EPSILON) * 100) / 100;

// Hours between two "HH:MM" times. An end before the start means the next day.
export function eventHours(startTime: string, endTime: string): number {
  const minutes = (time: string) => Number(time.slice(0, 2)) * 60 + Number(time.slice(3));
  let difference = minutes(endTime) - minutes(startTime);
  if (difference < 0) difference += 24 * 60;
  return difference / 60;
}

// `travelCost` comes from the server with the distance. It is null while the distance is
// not known, and the estimate then has no travel cost.
export function estimateLive(answers: { startTime: string; endTime: string; travelCost: number | null }, prices: Prices): number {
  const eventCost = roundCurrency(prices.liveHourlyRate * eventHours(answers.startTime, answers.endTime));
  return roundCurrency(eventCost + (answers.travelCost ?? 0));
}

export function estimateCustom(answers: { people: number; background: Background; words: boolean }, prices: Prices): number {
  const people =
    answers.people <= 3
      ? prices.customPeople[answers.people]
      : prices.customPeople[3] + (answers.people - 3) * prices.customExtraPerson;
  const background =
    answers.background === "simple"
      ? prices.backgroundSimple
      : answers.background === "complex"
        ? prices.backgroundComplex
        : 0;
  return roundCurrency(prices.customBase + people + background + (answers.words ? prices.words : 0));
}

export function estimateOther(choice: OtherChoice, prices: Prices): { amount: number; perHour: boolean } {
  return choice === "logo"
    ? { amount: prices.logoHourlyRate, perHour: true }
    : { amount: prices.illustration, perHour: false };
}

// The lowest price of a custom caricature: the base price plus one person.
export const customFrom = (prices: Prices) => prices.customBase + prices.customPeople[1];

export const formatMoney = (amount: number) => `$${amount.toFixed(2)}`;

// A whole number of dollars shows with no cents: "$150". Any other amount shows its cents.
export const dollars = (amount: number) => (Number.isInteger(amount) ? `$${amount}` : formatMoney(amount));
