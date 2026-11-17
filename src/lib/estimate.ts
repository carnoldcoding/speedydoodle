// The prices of the site. The server holds the same values and decides the final price.
// The admin panel will move these to the database.
export const PRICES = {
  liveHourlyRate: 150,
  milesPerGallon: 27,
  pricePerGallon: 3.7,
  customBase: 150,
  customPeople: [0, 75, 150, 190],
  customExtraPerson: 50,
  backgroundSimple: 50,
  backgroundComplex: 75,
  words: 25,
  logoHourlyRate: 75,
  illustration: 500,
} as const;

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

// `oneWayMiles` is null when the distance is not known. The travel cost is then 0.
export function estimateLive(answers: { startTime: string; endTime: string; oneWayMiles: number | null }): number {
  const eventCost = roundCurrency(PRICES.liveHourlyRate * eventHours(answers.startTime, answers.endTime));
  const travelCost =
    answers.oneWayMiles === null
      ? 0
      : roundCurrency(((answers.oneWayMiles * 2) / PRICES.milesPerGallon) * PRICES.pricePerGallon);
  return roundCurrency(eventCost + travelCost);
}

export function estimateCustom(answers: { people: number; background: Background; words: boolean }): number {
  const people =
    answers.people <= 3
      ? PRICES.customPeople[answers.people]
      : PRICES.customPeople[3] + (answers.people - 3) * PRICES.customExtraPerson;
  const background =
    answers.background === "simple"
      ? PRICES.backgroundSimple
      : answers.background === "complex"
        ? PRICES.backgroundComplex
        : 0;
  return roundCurrency(PRICES.customBase + people + background + (answers.words ? PRICES.words : 0));
}

export function estimateOther(choice: OtherChoice): { amount: number; perHour: boolean } {
  return choice === "logo"
    ? { amount: PRICES.logoHourlyRate, perHour: true }
    : { amount: PRICES.illustration, perHour: false };
}

export const formatMoney = (amount: number) => `$${amount.toFixed(2)}`;
