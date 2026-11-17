import { describe, expect, it } from "vitest";
import {
  changedPrices,
  checkPicture,
  createAdminApi,
  FAILED,
  moveItem,
  PICTURE_LIMIT,
  quoteCount,
  quoteDate,
  quoteKind,
  quoteMoney,
  quoteRows,
  thumbnail,
  uploadSummary,
  type Quote,
} from "./admin-api";

const BASE = "https://api.test";

interface Call {
  url: string;
  init: RequestInit;
}

// A fake `fetch` that records each call and gives the answers in order.
function fake(...answers: (Response | Error)[]) {
  const calls: Call[] = [];
  let loggedOut = 0;
  const fetchFake = async (url: string, init: RequestInit = {}) => {
    calls.push({ url, init });
    const answer = answers.shift() ?? new Response(null, { status: 204 });
    if (answer instanceof Error) throw answer;
    return answer;
  };
  const api = createAdminApi({ fetch: fetchFake, base: BASE, onLoggedOut: () => loggedOut++ });
  return { api, calls, loggedOutCount: () => loggedOut };
}

const json = (status: number, body: unknown) => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
const empty = (status: number) => new Response(null, { status });
const headersOf = (call: Call) => new Headers(call.init.headers);
const bodyOf = (call: Call): unknown => JSON.parse(String(call.init.body));

const QUOTE: Quote = {
  id: 7,
  createdAt: "2026-11-17T04:43:00.000Z",
  type: "custom",
  firstName: "Ann",
  lastName: "Lee",
  email: "ann@example.com",
  phone: null,
  details: { description: "Two friends", background: "simple", personCount: 2, text: true, textContent: "Happy birthday" },
  additionalInfo: "",
  price: { amount: 375, unit: "total", breakdown: { basePrice: 150, peoplePrice: 150, backgroundPrice: 50, textPrice: 25 } },
  artistEmail: "sent",
  customerEmail: "sent",
  handled: false,
};

describe("each request", () => {
  it("sends the cookie: credentials is 'include' on every call", async () => {
    const { api, calls } = fake();
    const file = new File(["abc"], "a.png", { type: "image/png" });
    await api.login("secret");
    await api.logout();
    await api.session();
    await api.changePassword("old", "new");
    await api.settings();
    await api.saveSettings({ live_hourly_rate: 160 });
    await api.testimonials();
    await api.addTestimonial({ text: "Great", name: "A." });
    await api.editTestimonial(1, { text: "Great", name: "A." });
    await api.removeTestimonial(1);
    await api.orderTestimonials([1]);
    await api.quotes(50, 0);
    await api.quote(1);
    await api.setHandled(1, true);
    await api.gallery("party");
    await api.uploadPicture("party", file);
    await api.setCaption(1, "A caption");
    await api.removePicture(1);
    await api.orderGallery("party", [1]);
    expect(calls).toHaveLength(19);
    for (const call of calls) {
      expect(call.init.credentials, call.url).toBe("include");
      expect(call.url.startsWith(`${BASE}/api/admin/`), call.url).toBe(true);
    }
  });

  it("sends a JSON body with the JSON content type", async () => {
    const { api, calls } = fake(json(200, { settings: [] }));
    await api.saveSettings({ live_hourly_rate: 160 });
    expect(calls[0].url).toBe(`${BASE}/api/admin/settings`);
    expect(calls[0].init.method).toBe("PUT");
    expect(headersOf(calls[0]).get("Content-Type")).toBe("application/json");
    expect(bodyOf(calls[0])).toEqual({ values: { live_hourly_rate: 160 } });
  });
});

describe("login", () => {
  it("is a success for 204", async () => {
    const { api, calls } = fake(empty(204));
    expect(await api.login("the right one")).toEqual({ ok: true });
    expect(calls[0].url).toBe(`${BASE}/api/admin/login`);
    expect(calls[0].init.method).toBe("POST");
    expect(bodyOf(calls[0])).toEqual({ password: "the right one" });
  });

  it("gives the server's sentence for 401", async () => {
    const { api, loggedOutCount } = fake(json(401, { error: "invalid_login", message: "That password is not correct." }));
    expect(await api.login("wrong")).toEqual({ ok: false, problem: "That password is not correct." });
    // A wrong password is not an ended session.
    expect(loggedOutCount()).toBe(0);
  });

  it("gives the server's sentence for 429 with JSON", async () => {
    const { api } = fake(json(429, { error: "too_many_attempts", retryAfterSeconds: 30, message: "Too many failed logins. Try again in 30 seconds." }));
    expect(await api.login("x")).toEqual({ ok: false, problem: "Too many failed logins. Try again in 30 seconds." });
  });

  it("gives a fixed sentence for 429 with no JSON, from the web server", async () => {
    const { api } = fake(new Response("<html>Too Many Requests</html>", { status: 429 }));
    expect(await api.login("x")).toEqual({ ok: false, problem: "Too many tries. Wait a minute, then try again." });
  });

  it("says where to open the page for 403", async () => {
    const { api } = fake(json(403, { error: "forbidden_origin", message: "This request did not come from the site." }));
    expect(await api.login("x")).toEqual({ ok: false, problem: "This page must be opened at speedydoodle.com." });
  });

  it("gives the general sentence when the request fails or the server breaks", async () => {
    expect(await fake(new TypeError("Failed to fetch")).api.login("x")).toEqual({ ok: false, problem: FAILED });
    expect(await fake(empty(500)).api.login("x")).toEqual({ ok: false, problem: FAILED });
  });
});

describe("an answer that is not a success", () => {
  it("is 'logged out' for 401 no_session, and tells the page", async () => {
    const { api, loggedOutCount } = fake(json(401, { error: "no_session", message: "Log in to continue." }));
    expect(await api.saveSettings({ live_hourly_rate: 1 })).toEqual({ ok: false, kind: "logged-out" });
    expect(loggedOutCount()).toBe(1);
  });

  it("is 'logged out' for the first session check too, but does not tell the page", async () => {
    const { api, loggedOutCount } = fake(json(401, { error: "no_session" }));
    expect(await api.session()).toEqual({ ok: false, kind: "logged-out" });
    expect(loggedOutCount()).toBe(0);
  });

  it("is a field problem for 400 with a field", async () => {
    const { api, loggedOutCount } = fake(json(400, { error: "invalid_field", field: "live_hourly_rate", message: "Enter a number of 0 or more." }));
    expect(await api.saveSettings({ live_hourly_rate: -1 })).toEqual({ ok: false, kind: "field", field: "live_hourly_rate", message: "Enter a number of 0 or more." });
    expect(loggedOutCount()).toBe(0);
  });

  it("is a failure with the status and the server's sentence for 502", async () => {
    const { api } = fake(json(502, { error: "remove_failed", message: "The picture was not removed. Try again in a minute." }));
    expect(await api.removePicture(3)).toEqual({ ok: false, kind: "failed", status: 502, message: "The picture was not removed. Try again in a minute." });
  });

  it("is a failure with status 0 when the request does not arrive", async () => {
    const { api } = fake(new TypeError("Failed to fetch"));
    expect(await api.testimonials()).toEqual({ ok: false, kind: "failed", status: 0 });
  });

  it("is a failure when a success has a body that is not JSON", async () => {
    const { api } = fake(new Response("<html>", { status: 200 }));
    expect(await api.settings()).toEqual({ ok: false, kind: "failed", status: 200 });
  });
});

describe("the answers", () => {
  it("gives the user name of the session", async () => {
    const { api } = fake(json(200, { username: "admin" }));
    expect(await api.session()).toEqual({ ok: true, data: { username: "admin" } });
  });

  it("gives the list inside each answer", async () => {
    const setting = { key: "live_hourly_rate", label: "Hourly rate", group: "Live events", type: "number", value: 150 };
    const testimonial = { id: 1, text: "Great", name: "A." };
    const item = { id: 4, category: "party", file_id: "f", url: "https://ik.test/a.jpg", width: 800, height: 1000, caption: "" };
    const { api } = fake(json(200, { settings: [setting] }), json(200, { testimonials: [testimonial] }), json(200, { items: [item] }), json(200, { total: 1, quotes: [QUOTE] }));
    expect(await api.settings()).toEqual({ ok: true, data: [setting] });
    expect(await api.testimonials()).toEqual({ ok: true, data: [testimonial] });
    expect(await api.gallery("party")).toEqual({ ok: true, data: [item] });
    expect(await api.quotes(50, 0)).toEqual({ ok: true, data: { total: 1, quotes: [QUOTE] } });
  });

  it("is a failure when a success has no body, or has no list, where one must be", async () => {
    const { api } = fake(empty(204), json(200, { other: 1 }), empty(204));
    expect(await api.addTestimonial({ text: "Great", name: "A." })).toEqual({ ok: false, kind: "failed", status: 204 });
    expect(await api.testimonials()).toEqual({ ok: false, kind: "failed", status: 200 });
    expect(await api.removeTestimonial(1)).toEqual({ ok: true, data: undefined });
  });

  it("asks for a page of quotes with limit and offset", async () => {
    const { api, calls } = fake(json(200, { total: 0, quotes: [] }));
    await api.quotes(50, 100);
    expect(calls[0].url).toBe(`${BASE}/api/admin/quotes?limit=50&offset=100`);
  });

  it("marks a quote with true or false", async () => {
    const { api, calls } = fake(json(200, { ...QUOTE, handled: true }));
    const result = await api.setHandled(7, true);
    expect(calls[0].url).toBe(`${BASE}/api/admin/quotes/7/handled`);
    expect(bodyOf(calls[0])).toEqual({ handled: true });
    expect(result.ok && result.data.handled).toBe(true);
  });

  it("sends both passwords", async () => {
    const { api, calls } = fake(empty(204));
    expect(await api.changePassword("the old one", "four words in a row")).toEqual({ ok: true, data: undefined });
    expect(calls[0].init.method).toBe("PUT");
    expect(bodyOf(calls[0])).toEqual({ currentPassword: "the old one", newPassword: "four words in a row" });
  });
});

describe("an upload", () => {
  it("sends the raw file with its type, and the gallery and the file name in the address", async () => {
    const item = { id: 9, category: "custom", file_id: "f", url: "https://ik.test/a.png", width: 10, height: 20, caption: "" };
    const { api, calls } = fake(json(201, item));
    const file = new File(["picture bytes"], "Smith Wedding & more.png", { type: "image/png" });
    expect(await api.uploadPicture("custom", file)).toEqual({ ok: true, data: item });
    expect(calls[0].url).toBe(`${BASE}/api/admin/gallery?category=custom&name=Smith%20Wedding%20%26%20more.png`);
    expect(calls[0].init.method).toBe("POST");
    expect(calls[0].init.body).toBe(file);
    expect(headersOf(calls[0]).get("Content-Type")).toBe("image/png");
  });
});

describe("the order calls", () => {
  it("send every id of the testimonials", async () => {
    const { api, calls } = fake(json(200, { testimonials: [] }));
    await api.orderTestimonials([3, 1, 2]);
    expect(calls[0].url).toBe(`${BASE}/api/admin/testimonials/order`);
    expect(calls[0].init.method).toBe("PUT");
    expect(bodyOf(calls[0])).toEqual({ ids: [3, 1, 2] });
  });

  it("send the gallery and every id of its pictures", async () => {
    const { api, calls } = fake(json(200, { items: [] }));
    await api.orderGallery("logos", [5, 4, 6, 1]);
    expect(calls[0].url).toBe(`${BASE}/api/admin/gallery/order`);
    expect(bodyOf(calls[0])).toEqual({ category: "logos", ids: [5, 4, 6, 1] });
  });
});

describe("the check of a picture before it is sent", () => {
  it("accepts the four picture types, up to 25 MB", () => {
    for (const type of ["image/jpeg", "image/png", "image/webp", "image/gif"]) {
      expect(checkPicture({ name: "a", size: PICTURE_LIMIT, type })).toBeNull();
    }
  });

  it("refuses 25 MB plus 1 byte, and names the file", () => {
    expect(checkPicture({ name: "big.png", size: 25 * 1024 * 1024 + 1, type: "image/png" })).toBe("big.png is larger than 25 MB.");
  });

  it("refuses a text file, and names the file", () => {
    expect(checkPicture({ name: "notes.txt", size: 12, type: "text/plain" })).toBe("notes.txt is not a JPEG, PNG, WebP, or GIF picture.");
  });
});

describe("the summary of an upload", () => {
  it("counts the uploads", () => {
    expect(uploadSummary(5, [])).toBe("5 uploaded.");
  });
  it("names each failure", () => {
    expect(uploadSummary(4, ["big.png is larger than 25 MB."])).toBe("4 uploaded. 1 failed: big.png is larger than 25 MB.");
    expect(uploadSummary(0, ["a.txt is not a JPEG, PNG, WebP, or GIF picture.", "big.png is larger than 25 MB."])).toBe(
      "0 uploaded. 2 failed: a.txt is not a JPEG, PNG, WebP, or GIF picture. big.png is larger than 25 MB.",
    );
  });
});

describe("a move in a list", () => {
  const list = [{ id: 1 }, { id: 2 }, { id: 3 }];
  const ids = (items: { id: number }[]) => items.map((item) => item.id);

  it("moves an item one place earlier", () => {
    expect(ids(moveItem(list, 3, "earlier"))).toEqual([1, 3, 2]);
  });
  it("moves an item one place later", () => {
    expect(ids(moveItem(list, 1, "later"))).toEqual([2, 1, 3]);
  });
  it("moves an item to the first place", () => {
    expect(ids(moveItem(list, 3, "first"))).toEqual([3, 1, 2]);
  });
  it("gives the same list when the item is at the end already, or is not in the list", () => {
    expect(moveItem(list, 1, "earlier")).toBe(list);
    expect(moveItem(list, 1, "first")).toBe(list);
    expect(moveItem(list, 3, "later")).toBe(list);
    expect(moveItem(list, 9, "later")).toBe(list);
  });
  it("does not change the list it gets", () => {
    moveItem(list, 2, "first");
    expect(ids(list)).toEqual([1, 2, 3]);
  });
});

describe("the text of a quote", () => {
  it("shows a total with cents", () => {
    expect(quoteMoney({ amount: 375, unit: "total" })).toBe("$375.00");
    expect(quoteMoney({ amount: 1455.48, unit: "total" })).toBe("$1,455.48");
  });
  it("shows an hourly price in words", () => {
    expect(quoteMoney({ amount: 75, unit: "hour" })).toBe("$75 an hour");
    expect(quoteMoney({ amount: 82.5, unit: "hour" })).toBe("$82.50 an hour");
  });
  it("shows the date and the time it arrived", () => {
    expect(quoteDate("2026-11-17T04:43:00.000Z", "UTC")).toBe("Nov 17, 2026, 4:43 AM");
    expect(quoteDate("2026-11-17T04:43:00.000Z", "America/New_York")).toBe("Nov 16, 2026, 11:43 PM");
  });
  it("shows nothing for a date that cannot be read", () => {
    expect(quoteDate("not a date", "UTC")).toBe("");
  });
  it("names the kind of quote in plain words", () => {
    expect(quoteKind(QUOTE)).toBe("Custom caricature");
    expect(quoteKind({ ...QUOTE, type: "live", details: { event: "Wedding", headcount: 80, location: "Camden, NJ", date: "12/05/2026", startTime: "18:00", endTime: "21:00" } })).toBe("Live event");
    expect(quoteKind({ ...QUOTE, type: "lni", details: { selection: "logo" } })).toBe("Logo");
    expect(quoteKind({ ...QUOTE, type: "lni", details: { selection: "illustration" } })).toBe("Illustration");
  });
  it("counts the new quotes and all of them", () => {
    expect(quoteCount(3, 12)).toBe("3 new, 12 in all");
    expect(quoteCount(0, 1)).toBe("0 new, 1 in all");
  });
});

describe("the details of a quote", () => {
  it("lists each answer of a custom caricature with a plain label", () => {
    expect(quoteRows(QUOTE)).toEqual([
      ["What to draw", "Two friends"],
      ["People in the drawing", "2"],
      ["Background", "Simple"],
      ["Words on the drawing", "Happy birthday"],
      ["Base price", "$150.00"],
      ["For the people", "$150.00"],
      ["For the background", "$50.00"],
      ["For the words", "$25.00"],
    ]);
  });

  it("lists each answer of a live event, with the times as a clock shows them", () => {
    const rows = quoteRows({
      ...QUOTE,
      type: "live",
      details: { event: "Wedding", headcount: 80, location: "Camden, NJ", date: "12/05/2026", startTime: "18:00", endTime: "00:30" },
      additionalInfo: "Park at the back.",
      price: { amount: 455.48, unit: "total", breakdown: { hours: 3, eventCost: 450, roundTripMiles: 40, travelCost: 5.48 } },
    });
    expect(rows).toEqual([
      ["Event", "Wedding"],
      ["Number of guests", "80"],
      ["Place", "Camden, NJ"],
      ["Date", "12/05/2026"],
      ["Starts", "6:00 PM"],
      ["Ends", "12:30 AM"],
      ["Anything else", "Park at the back."],
      ["Hours", "3"],
      ["For the drawing time", "$450.00"],
      ["Round trip", "40 miles"],
      ["For the travel", "$5.48"],
    ]);
  });

  it("says when the distance is not known, and when there are no words", () => {
    const live = quoteRows({
      ...QUOTE,
      type: "live",
      details: { event: "Party", headcount: 20, location: "Somewhere", date: "01/02/2027", startTime: "09:05", endTime: "12:00" },
      price: { amount: 450, unit: "total", breakdown: { hours: 3, eventCost: 450, roundTripMiles: null, travelCost: 0 } },
    });
    expect(live).toContainEqual(["Round trip", "The distance is not known"]);
    expect(live).toContainEqual(["Starts", "9:05 AM"]);
    const custom = quoteRows({ ...QUOTE, details: { description: "A dog", background: "complex", personCount: 1, text: false } });
    expect(custom).toContainEqual(["Words on the drawing", "None"]);
    expect(custom).toContainEqual(["Background", "Detailed"]);
  });

  it("names the choice of a logo or an illustration", () => {
    expect(quoteRows({ ...QUOTE, type: "lni", details: { selection: "logo" }, price: { amount: 75, unit: "hour", breakdown: {} } })).toEqual([["Wants", "A logo"]]);
  });
});

describe("the changed prices", () => {
  const settings = [
    { key: "live_hourly_rate", label: "Hourly rate", group: "Live events", type: "number" as const, value: 150 },
    { key: "price_per_gallon", label: "Gas", group: "Live events", type: "number" as const, value: 3.7 },
  ];

  it("holds only the values that changed", () => {
    expect(changedPrices(settings, { live_hourly_rate: "160", price_per_gallon: "3.70" })).toEqual({ values: { live_hourly_rate: 160 }, problems: {} });
  });
  it("is empty when nothing changed", () => {
    expect(changedPrices(settings, { live_hourly_rate: " 150 ", price_per_gallon: "3.7" })).toEqual({ values: {}, problems: {} });
    expect(changedPrices(settings, {})).toEqual({ values: {}, problems: {} });
  });
  it("names a field that is empty or is not a number", () => {
    expect(changedPrices(settings, { live_hourly_rate: "", price_per_gallon: "cheap" })).toEqual({
      values: {},
      problems: { live_hourly_rate: "Enter a number of 0 or more.", price_per_gallon: "Enter a number of 0 or more." },
    });
    expect(changedPrices(settings, { live_hourly_rate: "-5" }).problems).toEqual({ live_hourly_rate: "Enter a number of 0 or more." });
  });
});

describe("the address of a small copy of a picture", () => {
  it("asks the picture host for a width of 400", () => {
    expect(thumbnail("https://ik.test/party/a.jpg")).toBe("https://ik.test/party/a.jpg?tr=w-400");
  });
});
