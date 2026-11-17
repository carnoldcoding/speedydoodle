// Each request of the admin panel to the backend, and the small pure helpers of the panel.
// This file reads nothing from the browser, so each part can run in a test.

// ---- What the backend sends ----

export const CATEGORIES = ["party", "custom", "illustrations", "logos"] as const;
export type Category = (typeof CATEGORIES)[number];

export interface Setting {
  key: string;
  label: string;
  group: string;
  type: "number";
  value: number;
}

export interface Testimonial {
  id: number;
  text: string;
  name: string;
}

export interface GalleryItem {
  id: number;
  category: Category;
  file_id: string;
  url: string;
  width: number;
  height: number;
  caption: string;
}

export interface LiveDetails {
  event: string;
  headcount: number | string;
  location: string;
  date: string;
  startTime: string;
  endTime: string;
}

export interface CustomDetails {
  description: string;
  background: "none" | "simple" | "complex";
  personCount: number;
  text: boolean;
  textContent?: string;
}

export interface LniDetails {
  selection: "logo" | "illustration";
}

export interface QuotePrice {
  amount: number;
  unit: "total" | "hour";
  breakdown: Record<string, number | null | undefined>;
}

export type EmailStatus = "sent" | "failed" | "pending" | "skipped";

interface QuoteCommon {
  id: number;
  createdAt: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  additionalInfo: string;
  price: QuotePrice;
  artistEmail: EmailStatus;
  customerEmail: EmailStatus;
  handled: boolean;
}

export type Quote = QuoteCommon &
  ({ type: "live"; details: LiveDetails } | { type: "custom"; details: CustomDetails } | { type: "lni"; details: LniDetails });

export interface QuotePage {
  total: number;
  quotes: Quote[];
}

// ---- The result of a request ----

// The one sentence for a failure that is not a problem with a field.
export const FAILED = "That didn't work. Check your connection and try again.";

export type Problem =
  // The session has ended. The page shows the login form again.
  | { ok: false; kind: "logged-out" }
  // The server refused one value. `message` is a sentence for the person.
  | { ok: false; kind: "field"; field: string; message: string }
  // All other failures. `status` is 0 when the request did not arrive.
  | { ok: false; kind: "failed"; status: number; message?: string };

export type Result<T> = { ok: true; data: T } | Problem;

export type LoginResult = { ok: true } | { ok: false; problem: string };

type Fetch = (url: string, init?: RequestInit) => Promise<Response>;

interface ApiOptions {
  fetch: Fetch;
  // The address of the backend, with no slash at the end.
  base: string;
  // Called when a request finds that the session has ended.
  onLoggedOut?: () => void;
}

interface Send {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  // A value to send as JSON.
  json?: unknown;
  // A file to send as it is.
  file?: Blob;
  // True for the first session check: "not logged in" is then an answer, not an event.
  quiet?: boolean;
  // True when a success has no body.
  empty?: boolean;
}

// The text of a property of an answer, when the answer is an object that has it.
function textOf(body: unknown, key: string): string | undefined {
  if (typeof body !== "object" || body === null) return undefined;
  const value = (body as Record<string, unknown>)[key];
  return typeof value === "string" && value !== "" ? value : undefined;
}

// The body of an answer as JSON, or undefined when it is not JSON.
async function readJson(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return undefined;
  }
}

// The list inside an answer. An answer with no such list is a failure, not a crash.
function listOf<Item>(result: Result<unknown>, key: string): Result<Item[]> {
  if (!result.ok) return result;
  const list = typeof result.data === "object" && result.data !== null ? (result.data as Record<string, unknown>)[key] : undefined;
  return Array.isArray(list) ? { ok: true, data: list as Item[] } : { ok: false, kind: "failed", status: 200 };
}

export function createAdminApi({ fetch, base, onLoggedOut }: ApiOptions) {
  const root = `${base}/api/admin`;

  function init({ method = "GET", json, file }: Send): RequestInit {
    // The session is a cookie, so each request must carry the cookies.
    const request: RequestInit = { method, credentials: "include" };
    if (file !== undefined) {
      request.headers = { "Content-Type": file.type };
      request.body = file;
    } else if (json !== undefined) {
      request.headers = { "Content-Type": "application/json" };
      request.body = JSON.stringify(json);
    }
    return request;
  }

  async function send<T>(path: string, options: Send = {}): Promise<Result<T>> {
    let response: Response;
    try {
      response = await fetch(root + path, init(options));
    } catch {
      return { ok: false, kind: "failed", status: 0 };
    }
    if (response.status === 401) {
      if (!options.quiet) onLoggedOut?.();
      return { ok: false, kind: "logged-out" };
    }
    if (response.ok && options.empty) return { ok: true, data: undefined as T };
    const body = response.status === 204 ? undefined : await readJson(response);
    if (response.ok) {
      const usable = typeof body === "object" && body !== null;
      return usable ? { ok: true, data: body as T } : { ok: false, kind: "failed", status: response.status };
    }
    const field = textOf(body, "field");
    const message = textOf(body, "message");
    if (response.status === 400 && field && message) return { ok: false, kind: "field", field, message };
    return message ? { ok: false, kind: "failed", status: response.status, message } : { ok: false, kind: "failed", status: response.status };
  }

  return {
    async login(password: string): Promise<LoginResult> {
      let response: Response;
      try {
        response = await fetch(`${root}/login`, init({ method: "POST", json: { password } }));
      } catch {
        return { ok: false, problem: FAILED };
      }
      if (response.status === 204) return { ok: true };
      const message = textOf(await readJson(response), "message");
      if (response.status === 401) return { ok: false, problem: message ?? "That password is not correct." };
      // The web server limits tries too, and its answer has no sentence.
      if (response.status === 429) return { ok: false, problem: message ?? "Too many tries. Wait a minute, then try again." };
      if (response.status === 403) return { ok: false, problem: "This page must be opened at speedydoodle.com." };
      return { ok: false, problem: FAILED };
    },

    logout: () => send<void>("/logout", { method: "POST", quiet: true, empty: true }),
    session: () => send<{ username: string }>("/session", { quiet: true }),
    changePassword: (currentPassword: string, newPassword: string) => send<void>("/password", { method: "PUT", json: { currentPassword, newPassword }, empty: true }),

    settings: async () => listOf<Setting>(await send<unknown>("/settings"), "settings"),
    saveSettings: async (values: Record<string, number>) =>
      listOf<Setting>(await send<unknown>("/settings", { method: "PUT", json: { values } }), "settings"),

    testimonials: async () => listOf<Testimonial>(await send<unknown>("/testimonials"), "testimonials"),
    addTestimonial: (words: { text: string; name: string }) => send<Testimonial>("/testimonials", { method: "POST", json: words }),
    editTestimonial: (id: number, words: { text: string; name: string }) => send<Testimonial>(`/testimonials/${id}`, { method: "PUT", json: words }),
    removeTestimonial: (id: number) => send<void>(`/testimonials/${id}`, { method: "DELETE", empty: true }),
    // `ids` holds every testimonial, in the new order.
    orderTestimonials: async (ids: number[]) =>
      listOf<Testimonial>(await send<unknown>("/testimonials/order", { method: "PUT", json: { ids } }), "testimonials"),

    quotes: (limit: number, offset: number) => send<QuotePage>(`/quotes?limit=${limit}&offset=${offset}`),
    quote: (id: number) => send<Quote>(`/quotes/${id}`),
    setHandled: (id: number, handled: boolean) => send<Quote>(`/quotes/${id}/handled`, { method: "PUT", json: { handled } }),

    gallery: async (category: Category) => listOf<GalleryItem>(await send<unknown>(`/gallery?category=${category}`), "items"),
    // The picture bytes are the body. The gallery and the file name are in the address.
    uploadPicture: (category: Category, file: File) =>
      send<GalleryItem>(`/gallery?category=${category}&name=${encodeURIComponent(file.name)}`, { method: "POST", file }),
    setCaption: (id: number, caption: string) => send<GalleryItem>(`/gallery/${id}`, { method: "PUT", json: { caption } }),
    removePicture: (id: number) => send<void>(`/gallery/${id}`, { method: "DELETE", empty: true }),
    // `ids` holds every picture of that gallery, in the new order.
    orderGallery: async (category: Category, ids: number[]) =>
      listOf<GalleryItem>(await send<unknown>("/gallery/order", { method: "PUT", json: { category, ids } }), "items"),
  };
}

export type AdminApi = ReturnType<typeof createAdminApi>;

// ---- Pictures ----

export const PICTURE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
export const PICTURE_LIMIT = 25 * 1024 * 1024;
export const CAPTION_LIMIT = 140;

// The reason a file cannot be uploaded, as a sentence that names the file. Null when it can.
export function checkPicture(file: { name: string; size: number; type: string }): string | null {
  if (!PICTURE_TYPES.includes(file.type)) return `${file.name} is not a JPEG, PNG, WebP, or GIF picture.`;
  if (file.size > PICTURE_LIMIT) return `${file.name} is larger than 25 MB.`;
  return null;
}

// What to say after the last file. Each failure is a full sentence.
export function uploadSummary(uploaded: number, failures: string[]): string {
  const done = `${uploaded} uploaded.`;
  return failures.length === 0 ? done : `${done} ${failures.length} failed: ${failures.join(" ")}`;
}

// The address of a copy of a picture that is 400 pixels wide.
export function thumbnail(url: string): string {
  return `${url}${url.includes("?") ? "&" : "?"}tr=w-400`;
}

// ---- The order of a list ----

export type Move = "earlier" | "later" | "first";

// A copy of the list with one item moved. The same list when the move changes nothing.
export function moveItem<Item extends { id: number }>(list: Item[], id: number, move: Move): Item[] {
  const from = list.findIndex((item) => item.id === id);
  if (from === -1) return list;
  const to = move === "first" ? 0 : move === "earlier" ? from - 1 : from + 1;
  if (to === from || to < 0 || to >= list.length) return list;
  const next = list.slice();
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

// ---- Quotes ----

const dollars = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

// "$375.00" for a total, and "$75 an hour" for an hourly price.
export function quoteMoney(price: Pick<QuotePrice, "amount" | "unit">): string {
  if (price.unit === "total") return dollars.format(price.amount);
  const amount = Number.isInteger(price.amount) ? `$${price.amount}` : dollars.format(price.amount);
  return `${amount} an hour`;
}

// "Nov 17, 2026, 4:43 AM", in the time zone of the device. A test gives its own time zone.
export function quoteDate(iso: string, timeZone?: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const text = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit", timeZone }).format(date);
  // Some browsers put a narrow space before "AM". A normal space reads the same everywhere.
  return text.replace(/[  ]/g, " ");
}

export function quoteKind(quote: Quote): string {
  if (quote.type === "live") return "Live event";
  if (quote.type === "custom") return "Custom caricature";
  return quote.details.selection === "logo" ? "Logo" : "Illustration";
}

export function quoteCount(fresh: number, total: number): string {
  return `${fresh} new, ${total} in all`;
}

// "18:00" as "6:00 PM". A text that is not a time stays as it is.
function clock(time: string): string {
  const match = /^(\d{1,2}):(\d{2})$/.exec(time);
  if (!match) return time;
  const hour = Number(match[1]);
  return `${hour % 12 === 0 ? 12 : hour % 12}:${match[2]} ${hour % 24 < 12 ? "AM" : "PM"}`;
}

const BACKGROUNDS = { none: "None", simple: "Simple", complex: "Detailed" };

// The parts of the price, for the kinds of quote that have parts.
function priceRows(quote: Quote): [string, string][] {
  const parts = quote.price.breakdown ?? {};
  const rows: [string, string][] = [];
  const money = (label: string, value: number | null | undefined) => {
    if (typeof value === "number") rows.push([label, dollars.format(value)]);
  };
  if (quote.type === "live") {
    if (typeof parts.hours === "number") rows.push(["Hours", String(parts.hours)]);
    money("For the drawing time", parts.eventCost);
    if ("roundTripMiles" in parts) {
      rows.push(["Round trip", typeof parts.roundTripMiles === "number" ? `${parts.roundTripMiles} miles` : "The distance is not known"]);
    }
    money("For the travel", parts.travelCost);
  }
  if (quote.type === "custom") {
    money("Base price", parts.basePrice);
    money("For the people", parts.peoplePrice);
    money("For the background", parts.backgroundPrice);
    money("For the words", parts.textPrice);
  }
  return rows;
}

// Each answer of a quote as a label and a value, in the order the panel shows them.
// The name, the email, the phone, and the price have their own places on the card.
export function quoteRows(quote: Quote): [string, string][] {
  const rows: [string, string][] = [];
  if (quote.type === "live") {
    const { event, headcount, location, date, startTime, endTime } = quote.details;
    rows.push(["Event", event], ["Number of guests", String(headcount)], ["Place", location], ["Date", date], ["Starts", clock(startTime)], ["Ends", clock(endTime)]);
  } else if (quote.type === "custom") {
    const { description, background, personCount, text, textContent } = quote.details;
    rows.push(
      ["What to draw", description],
      ["People in the drawing", String(personCount)],
      ["Background", BACKGROUNDS[background] ?? String(background)],
      ["Words on the drawing", text ? textContent || "Yes" : "None"],
    );
  } else {
    rows.push(["Wants", quote.details.selection === "logo" ? "A logo" : "An illustration"]);
  }
  if (quote.additionalInfo) rows.push(["Anything else", quote.additionalInfo]);
  return [...rows, ...priceRows(quote)];
}

// ---- Prices ----

export const NOT_A_PRICE = "Enter a number of 0 or more.";
const PRICE_PATTERN = /^(\d+\.?\d*|\.\d+)$/;

// Compare what is typed in the price form with the stored values. `values` holds only the
// numbers that changed, and `problems` holds a sentence for each field that is not a number.
export function changedPrices(settings: Setting[], typed: Record<string, string | undefined>) {
  const values: Record<string, number> = {};
  const problems: Record<string, string> = {};
  for (const { key, value } of settings) {
    const text = typed[key]?.trim();
    if (text === undefined) continue;
    const number = Number(text);
    if (!PRICE_PATTERN.test(text) || number > 1000000) problems[key] = NOT_A_PRICE;
    else if (number !== value) values[key] = number;
  }
  return { values, problems };
}
