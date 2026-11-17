import {
  estimateCustom,
  estimateLive,
  estimateOther,
  eventHours,
  formatMoney,
  type Background,
  type OtherChoice,
} from "./estimate";
import type { QuoteType } from "./gallery";

export const MAX_PEOPLE = 50;

// Each answer of the quote form. One object holds the answers of the three types,
// so a visitor who goes back and chooses a type again finds each answer.
export interface QuoteAnswers {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  // A live event.
  event: string;
  headcount: string;
  location: string;
  // The day as the date input gives it: "YYYY-MM-DD".
  date: string;
  // The times as "HH:MM" on a 24-hour clock.
  startTime: string;
  endTime: string;
  // A custom caricature.
  people: number;
  background: Background | "";
  words: "yes" | "no" | "";
  textContent: string;
  description: string;
  // A logo or an illustration.
  selection: OtherChoice | "";
  lniDescription: string;
  // Step 3.
  notes: string;
}

export type FieldKey = keyof QuoteAnswers;
export type Problems = Partial<Record<FieldKey, string>>;

export const EMPTY_ANSWERS: QuoteAnswers = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  event: "",
  headcount: "",
  location: "",
  date: "",
  startTime: "",
  endTime: "",
  people: 1,
  background: "",
  words: "",
  textContent: "",
  description: "",
  selection: "",
  lniDescription: "",
  notes: "",
};

export const isQuoteType = (value: unknown): value is QuoteType =>
  value === "live" || value === "custom" || value === "lni";

// The fields of each type, in the order of the screen.
const SHARED_FIELDS: FieldKey[] = ["firstName", "lastName", "email", "phone"];
const TYPE_FIELDS: Record<QuoteType, FieldKey[]> = {
  live: ["event", "headcount", "location", "date", "startTime", "endTime"],
  custom: ["people", "background", "words", "textContent", "description"],
  lni: ["selection", "lniDescription"],
};
const FIELD_ORDER: FieldKey[] = [...SHARED_FIELDS, ...TYPE_FIELDS.live, ...TYPE_FIELDS.custom, ...TYPE_FIELDS.lni, "notes"];

// The sentence under a field when its answer is missing.
const MISSING: Partial<Record<FieldKey, string>> = {
  firstName: "Type your first name.",
  lastName: "Type your last name.",
  email: "Type an email address, for example name@example.com.",
  event: "Tell Mike what the event is.",
  headcount: "Type a number of guests, for example 80.",
  location: "Type the address of the event.",
  date: "Choose the day of the event.",
  startTime: "Choose a start time.",
  endTime: "Choose an end time.",
  background: "Choose one of the three.",
  words: "Choose yes or no.",
  textContent: "Type the words for the drawing.",
  description: "Describe the drawing in a sentence or two.",
  selection: "Choose a logo or an illustration.",
  lniDescription: "Describe what you need in a sentence or two.",
};

// The sentence under a field when its answer is there and the server does not accept it.
const NOT_ACCEPTED: Partial<Record<FieldKey, string>> = {
  firstName: "Use only letters, spaces, apostrophes, periods, and hyphens in your first name.",
  lastName: "Use only letters, spaces, apostrophes, periods, and hyphens in your last name.",
  phone: "Type a phone number with 7 digits or more, or leave this empty.",
  people: `Choose from 1 to ${MAX_PEOPLE} people.`,
  notes: "That's too long to send. Make it a little shorter.",
};

// The same patterns as the server.
const NAME_PATTERN = /^[\p{L}][\p{L}\p{M} .'-]*$/u;
const EMAIL_PATTERN = /^[^\s@<>"',;]+@[^\s@<>"',;]+\.[^\s@<>"',;]{2,}$/;
const PHONE_PATTERN = /^[0-9+().\- ]{7,25}$/;
const DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const MAX_GUESTS = 100000;
const MAX_DETAILS = 2000;

// What the server gets as `additionalInfo`. It has no field for the description of a logo
// or an illustration, so that description goes first, and the notes of step 3 follow.
function details(type: QuoteType, answers: QuoteAnswers): string {
  const notes = answers.notes.trim();
  if (type !== "lni") return notes;
  return [answers.lniDescription.trim(), notes].filter(Boolean).join("\n\n");
}

// Find each answer that the server would not accept. The result is empty when the form can be sent.
export function findProblems(type: QuoteType, answers: QuoteAnswers): Problems {
  const problems: Problems = {};
  const text = (key: FieldKey) => String(answers[key]).trim();

  for (const key of [...SHARED_FIELDS, ...TYPE_FIELDS[type]]) {
    if (key === "phone" || key === "people") continue;
    if (key === "textContent" && answers.words !== "yes") continue;
    if (text(key) === "") problems[key] = MISSING[key];
  }

  for (const key of ["firstName", "lastName"] as const) {
    if (!problems[key] && !NAME_PATTERN.test(text(key))) problems[key] = NOT_ACCEPTED[key];
  }
  if (!problems.email && !EMAIL_PATTERN.test(text("email"))) problems.email = MISSING.email;

  const phone = text("phone");
  if (phone !== "" && (!PHONE_PATTERN.test(phone) || phone.replace(/\D/g, "").length < 7)) {
    problems.phone = NOT_ACCEPTED.phone;
  }

  if (type === "live") {
    const guests = text("headcount");
    if (!/^\d{1,6}$/.test(guests) || Number(guests) < 1 || Number(guests) > MAX_GUESTS) {
      problems.headcount = MISSING.headcount;
    }
    if (!problems.date && !DATE_PATTERN.test(text("date"))) problems.date = MISSING.date;
    // The server counts an end equal to the start as 0 hours, which gives a price of $0.
    if (!problems.endTime && answers.startTime !== "" && answers.endTime === answers.startTime) {
      problems.endTime = "Pick an end time that's later than the start time.";
    }
  }

  if (type === "custom" && (!Number.isInteger(answers.people) || answers.people < 1 || answers.people > MAX_PEOPLE)) {
    problems.people = NOT_ACCEPTED.people;
  }

  if (details(type, answers).length > MAX_DETAILS) problems.notes = NOT_ACCEPTED.notes;
  return problems;
}

// The first field with a problem, in the order of the screen.
export function firstProblem(problems: Problems): FieldKey | null {
  return FIELD_ORDER.find((key) => problems[key] !== undefined) ?? null;
}

interface SharedBody {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  additionalInfo?: string;
}

export type QuoteBody =
  | (SharedBody & { type: "live"; event: string; headcount: number; location: string; date: string; startTime: string; endTime: string })
  | (SharedBody & { type: "custom"; description: string; background: Background | ""; personCount: number; includeText: boolean; textContent?: string })
  | (SharedBody & { type: "lni"; selection: OtherChoice | "" });

// The body of POST /api/quotes. An empty optional answer is left out.
export function buildRequestBody(type: QuoteType, answers: QuoteAnswers): QuoteBody {
  const phone = answers.phone.trim();
  const additionalInfo = details(type, answers);
  const shared = {
    firstName: answers.firstName.trim(),
    lastName: answers.lastName.trim(),
    email: answers.email.trim(),
    ...(phone ? { phone } : {}),
  };
  const last = additionalInfo ? { additionalInfo } : {};

  if (type === "live") {
    return {
      type,
      ...shared,
      event: answers.event.trim(),
      headcount: Number(answers.headcount.trim()),
      location: answers.location.trim(),
      date: answers.date.replace(DATE_PATTERN, "$2/$3/$1"),
      startTime: answers.startTime,
      endTime: answers.endTime,
      ...last,
    };
  }
  if (type === "custom") {
    const includeText = answers.words === "yes";
    return {
      type,
      ...shared,
      description: answers.description.trim(),
      background: answers.background,
      personCount: answers.people,
      includeText,
      ...(includeText ? { textContent: answers.textContent.trim() } : {}),
      ...last,
    };
  }
  return { type, ...shared, selection: answers.selection, ...last };
}

// The server names the field it does not accept. Find the field of the form with that answer.
// The result is null when the form shows no such field.
export function fieldFromServer(type: QuoteType, field: unknown): FieldKey | null {
  if (typeof field !== "string") return null;
  if (field === "additionalInfo") return "notes";
  if (field === "personCount") return type === "custom" ? "people" : null;
  if (field === "includeText") return type === "custom" ? "words" : null;
  return [...SHARED_FIELDS, ...TYPE_FIELDS[type]].find((key) => key === field && key !== "people" && key !== "lniDescription") ?? null;
}

// The sentence under a field that the server did not accept.
export function serverProblem(key: FieldKey): string {
  return NOT_ACCEPTED[key] ?? MISSING[key] ?? "Check this answer, then try again.";
}

// The distance from the server is text, for example "20.0 mi". Any other shape is unknown.
export function parseMiles(distance: unknown): number | null {
  if (typeof distance !== "string") return null;
  const match = /^(\d[\d,]*(?:\.\d+)?) mi$/.exec(distance.trim());
  return match ? Number(match[1].replace(/,/g, "")) : null;
}

const pad = (n: number) => String(n).padStart(2, "0");

function timeOption(halfHour: number) {
  const hour = Math.floor(halfHour / 2);
  const minutes = halfHour % 2 ? "30" : "00";
  return { value: `${pad(hour)}:${minutes}`, label: `${hour % 12 || 12}:${minutes} ${hour < 12 ? "AM" : "PM"}` };
}

// One entry for each 30 minutes. The list starts at noon, because most events are after noon.
export const TIME_OPTIONS = [...Array(48).keys()].map((index) => timeOption((index + 24) % 48));

export const timeLabel = (value: string) => TIME_OPTIONS.find((option) => option.value === value)?.label ?? value;

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// "2027-06-20" as "June 20, 2027".
export function longDate(date: string): string {
  const match = DATE_PATTERN.exec(date);
  if (!match) return date;
  return `${MONTHS[Number(match[2]) - 1] ?? match[2]} ${Number(match[3])}, ${match[1]}`;
}

// What the estimate bar shows. `oneWayMiles` is null while the distance is not known.
export function estimateFor(type: QuoteType, answers: QuoteAnswers, oneWayMiles: number | null): { text: string; note: string } {
  if (type === "live") {
    const { startTime, endTime } = answers;
    if (!startTime || !endTime) return { text: "—", note: "Pick the two times to see it." };
    const hours = eventHours(startTime, endTime);
    const travel = oneWayMiles === null ? "Travel is added once Mike has the address." : "Includes travel.";
    return {
      text: formatMoney(estimateLive({ startTime, endTime, oneWayMiles })),
      note: `${hours} ${hours === 1 ? "hour" : "hours"}. ${travel}`,
    };
  }
  if (type === "custom") {
    const amount = estimateCustom({
      people: answers.people,
      background: answers.background || "none",
      words: answers.words === "yes",
    });
    return { text: formatMoney(amount), note: "" };
  }
  if (answers.selection === "") return { text: "—", note: "Choose one to see it." };
  const { amount, perHour } = estimateOther(answers.selection);
  return { text: perHour ? `$${amount} an hour` : formatMoney(amount), note: "" };
}
