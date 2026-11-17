import { describe, expect, it } from "vitest";
import {
  buildRequestBody,
  EMPTY_ANSWERS,
  estimateFor,
  fieldFromServer,
  findProblems,
  firstProblem,
  longDate,
  parseMiles,
  TIME_OPTIONS,
  type QuoteAnswers,
} from "./quote";

// Each expected value comes from the contract of POST /api/quotes, not from the code under test.
const person = { firstName: "Ana", lastName: "O'Neil-Smith", email: "ana@example.com" };

const live: QuoteAnswers = {
  ...EMPTY_ANSWERS,
  ...person,
  event: "A wedding",
  headcount: "80",
  location: "12 Main St, Camden, NJ, USA",
  date: "2027-06-20",
  startTime: "18:00",
  endTime: "21:00",
};

const custom: QuoteAnswers = {
  ...EMPTY_ANSWERS,
  ...person,
  people: 2,
  background: "simple",
  words: "yes",
  textContent: "Happy 40th, Sam!",
  description: "Sam and Alex on a boat.",
};

const lni: QuoteAnswers = {
  ...EMPTY_ANSWERS,
  ...person,
  selection: "logo",
  lniDescription: "A logo for a bakery, with a whisk.",
};

describe("the request body", () => {
  it("of a live event has the date as MM/DD/YYYY and no phone or details when they are empty", () => {
    expect(buildRequestBody("live", live)).toStrictEqual({
      type: "live",
      firstName: "Ana",
      lastName: "O'Neil-Smith",
      email: "ana@example.com",
      event: "A wedding",
      headcount: 80,
      location: "12 Main St, Camden, NJ, USA",
      date: "06/20/2027",
      startTime: "18:00",
      endTime: "21:00",
    });
  });

  it("keeps a phone number and the notes when they are filled, without the spaces around them", () => {
    const body = buildRequestBody("live", { ...live, firstName: "  Ana ", phone: " (856) 555-0142 ", notes: " Outdoors, under a tent.\n" });
    expect(body).toStrictEqual({
      type: "live",
      firstName: "Ana",
      lastName: "O'Neil-Smith",
      email: "ana@example.com",
      phone: "(856) 555-0142",
      event: "A wedding",
      headcount: 80,
      location: "12 Main St, Camden, NJ, USA",
      date: "06/20/2027",
      startTime: "18:00",
      endTime: "21:00",
      additionalInfo: "Outdoors, under a tent.",
    });
  });

  it("of a custom caricature with words has the words", () => {
    expect(buildRequestBody("custom", custom)).toStrictEqual({
      type: "custom",
      firstName: "Ana",
      lastName: "O'Neil-Smith",
      email: "ana@example.com",
      description: "Sam and Alex on a boat.",
      background: "simple",
      personCount: 2,
      includeText: true,
      textContent: "Happy 40th, Sam!",
    });
  });

  it("of a custom caricature with no words sends no textContent, even if some was typed before", () => {
    expect(buildRequestBody("custom", { ...custom, words: "no", background: "none", people: 1 })).toStrictEqual({
      type: "custom",
      firstName: "Ana",
      lastName: "O'Neil-Smith",
      email: "ana@example.com",
      description: "Sam and Alex on a boat.",
      background: "none",
      personCount: 1,
      includeText: false,
    });
  });

  it("of a logo sends the description as additionalInfo", () => {
    expect(buildRequestBody("lni", lni)).toStrictEqual({
      type: "lni",
      firstName: "Ana",
      lastName: "O'Neil-Smith",
      email: "ana@example.com",
      selection: "logo",
      additionalInfo: "A logo for a bakery, with a whisk.",
    });
  });

  it("of an illustration puts the notes after the description and a blank line", () => {
    expect(buildRequestBody("lni", { ...lni, selection: "illustration", notes: "I need it by March." })).toStrictEqual({
      type: "lni",
      firstName: "Ana",
      lastName: "O'Neil-Smith",
      email: "ana@example.com",
      selection: "illustration",
      additionalInfo: "A logo for a bakery, with a whisk.\n\nI need it by March.",
    });
  });

  it("does not send the answers of a different type", () => {
    const mixed = { ...live, selection: "logo" as const, lniDescription: "A logo", description: "A drawing" };
    expect(Object.keys(buildRequestBody("live", mixed)).sort()).toStrictEqual(
      ["date", "email", "endTime", "event", "firstName", "headcount", "lastName", "location", "startTime", "type"],
    );
  });
});

describe("the rules", () => {
  it("find no problem in a complete form of each type", () => {
    expect(findProblems("live", live)).toStrictEqual({});
    expect(findProblems("custom", custom)).toStrictEqual({});
    expect(findProblems("lni", lni)).toStrictEqual({});
  });

  it("never need the notes or the phone number", () => {
    for (const [type, answers] of [["live", live], ["custom", custom], ["lni", lni]] as const) {
      const problems = findProblems(type, { ...answers, notes: "", phone: "" });
      expect(problems.notes).toBeUndefined();
      expect(problems.phone).toBeUndefined();
    }
  });

  it.each(["firstName", "lastName", "email", "event", "headcount", "location", "date", "startTime", "endTime"] as const)(
    "find a problem when %s of a live event is empty",
    (key) => {
      expect(Object.keys(findProblems("live", { ...live, [key]: "  " }))).toStrictEqual([key]);
    },
  );

  it.each(["firstName", "lastName", "email", "background", "words", "textContent", "description"] as const)(
    "find a problem when %s of a custom caricature is empty",
    (key) => {
      expect(Object.keys(findProblems("custom", { ...custom, [key]: "" }))).toStrictEqual([key]);
    },
  );

  it.each(["firstName", "lastName", "email", "selection", "lniDescription"] as const)(
    "find a problem when %s of a logo or illustration is empty",
    (key) => {
      expect(Object.keys(findProblems("lni", { ...lni, [key]: "" }))).toStrictEqual([key]);
    },
  );

  it("do not need the words when the answer is no words", () => {
    expect(findProblems("custom", { ...custom, words: "no", textContent: "" })).toStrictEqual({});
  });

  it("ask only the questions of the chosen type", () => {
    expect(findProblems("lni", { ...lni, event: "", background: "" })).toStrictEqual({});
  });

  it("say the problem as the sentence of the study", () => {
    expect(findProblems("live", { ...live, firstName: "" }).firstName).toBe("Type your first name.");
    expect(findProblems("live", { ...live, headcount: "" }).headcount).toBe("Type a number of guests, for example 80.");
  });

  it.each(["ana", "ana@example", "ana @example.com", "ana@exam,ple.com", "@example.com"])("refuse the email %s", (email) => {
    expect(findProblems("live", { ...live, email }).email).toBe("Type an email address, for example name@example.com.");
  });

  it.each(["Ana3", "<b>", "-Ana"])("refuse the name %s", (firstName) => {
    expect(findProblems("live", { ...live, firstName }).firstName).toBeDefined();
  });

  it.each(["José", "Mary Ann", "D'Arcy", "St. John", "Zoë-Lee"])("accept the name %s", (lastName) => {
    expect(findProblems("live", { ...live, lastName })).toStrictEqual({});
  });

  it.each([
    ["letters", "call me maybe"],
    ["letters with digits", "856-555-0142 ext"],
    ["5 digits", "55501"],
    ["7 characters but 5 digits", "(555) 01"],
    ["26 characters", "1 2 3 4 5 6 7 8 9 0 1 2 3 "+"4"],
  ])("refuse a phone number with %s", (_what, phone) => {
    expect(findProblems("custom", { ...custom, phone }).phone).toBeDefined();
  });

  it.each(["8565550142", "(856) 555-0142", "+1 856.555.0142", "5550142"])("accept the phone number %s", (phone) => {
    expect(findProblems("custom", { ...custom, phone })).toStrictEqual({});
  });

  it.each(["0", "abc", "12.5", "-4", "100001", "8o"])("refuse the number of guests %s", (headcount) => {
    expect(findProblems("live", { ...live, headcount }).headcount).toBe("Type a number of guests, for example 80.");
  });

  it.each(["1", "80", "100000"])("accept the number of guests %s", (headcount) => {
    expect(findProblems("live", { ...live, headcount })).toStrictEqual({});
  });

  it("allow an end time after midnight", () => {
    expect(findProblems("live", { ...live, startTime: "22:00", endTime: "01:30" })).toStrictEqual({});
  });

  // The server counts an end equal to the start as 0 hours, which gives a price of $0.
  it("refuse an end time equal to the start time", () => {
    expect(findProblems("live", { ...live, startTime: "18:00", endTime: "18:00" })).toStrictEqual({
      endTime: "Pick an end time that's later than the start time.",
    });
  });

  it("refuse a day that is not a date", () => {
    expect(findProblems("live", { ...live, date: "next week" }).date).toBe("Choose the day of the event.");
  });

  it("refuse a logo request that is longer than the server's 2000 characters with its notes", () => {
    const answers = { ...lni, lniDescription: "a".repeat(1500), notes: "b".repeat(499) };
    expect(Object.keys(findProblems("lni", answers))).toStrictEqual(["notes"]);
    expect(findProblems("lni", { ...answers, notes: "b".repeat(498) })).toStrictEqual({});
  });

  it("name the first problem in the order of the screen", () => {
    const problems = findProblems("live", { ...live, endTime: "", email: "", event: "" });
    expect(firstProblem(problems)).toBe("email");
    expect(firstProblem({})).toBeNull();
  });
});

describe("a field name from the server", () => {
  it("is the field of the form with the same answer", () => {
    expect(fieldFromServer("live", "headcount")).toBe("headcount");
    expect(fieldFromServer("custom", "personCount")).toBe("people");
    expect(fieldFromServer("custom", "includeText")).toBe("words");
    expect(fieldFromServer("custom", "description")).toBe("description");
    expect(fieldFromServer("live", "additionalInfo")).toBe("notes");
    expect(fieldFromServer("lni", "phone")).toBe("phone");
  });

  it("is nothing for a field the form does not show", () => {
    expect(fieldFromServer("live", "type")).toBeNull();
    expect(fieldFromServer("live", "description")).toBeNull();
    expect(fieldFromServer("lni", "toString")).toBeNull();
    expect(fieldFromServer("lni", undefined)).toBeNull();
  });
});

describe("the distance from the server", () => {
  it("is a number of miles", () => {
    expect(parseMiles("20.0 mi")).toBe(20);
    expect(parseMiles("1,234 mi")).toBe(1234);
    expect(parseMiles("0.3 mi")).toBe(0.3);
  });

  it("is unknown for a different unit or a different shape", () => {
    expect(parseMiles("500 ft")).toBeNull();
    expect(parseMiles("32 km")).toBeNull();
    expect(parseMiles(" mi")).toBeNull();
    expect(parseMiles(20)).toBeNull();
    expect(parseMiles(undefined)).toBeNull();
  });
});

describe("the list of times", () => {
  it("has one entry for each 30 minutes and starts at noon, as in the study", () => {
    expect(TIME_OPTIONS).toHaveLength(48);
    expect(TIME_OPTIONS[0]).toStrictEqual({ value: "12:00", label: "12:00 PM" });
    expect(TIME_OPTIONS[1]).toStrictEqual({ value: "12:30", label: "12:30 PM" });
    expect(TIME_OPTIONS[23]).toStrictEqual({ value: "23:30", label: "11:30 PM" });
    expect(TIME_OPTIONS[24]).toStrictEqual({ value: "00:00", label: "12:00 AM" });
    expect(TIME_OPTIONS[47]).toStrictEqual({ value: "11:30", label: "11:30 AM" });
  });
});

describe("the day in words", () => {
  it("is the month, the day, and the year", () => {
    expect(longDate("2027-06-20")).toBe("June 20, 2027");
    expect(longDate("2026-12-01")).toBe("December 1, 2026");
  });
});

describe("the estimate on the bar", () => {
  it("of a live event waits for the two times", () => {
    expect(estimateFor("live", { ...live, endTime: "" }, null)).toStrictEqual({ text: "—", note: "Pick the two times to see it." });
  });
  it("of a live event says that travel comes later while the distance is unknown: 3 hours at 150", () => {
    expect(estimateFor("live", live, null)).toStrictEqual({ text: "$450.00", note: "3 hours. Travel is added once Mike has the address." });
  });
  it("of a live event includes travel when the distance is known: 450 plus 40 miles / 27 * 3.7", () => {
    expect(estimateFor("live", live, 20)).toStrictEqual({ text: "$455.48", note: "3 hours. Includes travel." });
  });
  it("of a live event of one hour says 1 hour", () => {
    expect(estimateFor("live", { ...live, endTime: "19:00" }, null).note).toBe("1 hour. Travel is added once Mike has the address.");
  });
  it("of a custom caricature is 375 for 2 people, a simple background, and words", () => {
    expect(estimateFor("custom", custom, null)).toStrictEqual({ text: "$375.00", note: "" });
  });
  it("of a custom caricature starts at 225 before any choice", () => {
    expect(estimateFor("custom", EMPTY_ANSWERS, null)).toStrictEqual({ text: "$225.00", note: "" });
  });
  it("of a logo is for each hour, and of an illustration is one amount", () => {
    expect(estimateFor("lni", lni, null)).toStrictEqual({ text: "$75 an hour", note: "" });
    expect(estimateFor("lni", { ...lni, selection: "illustration" }, null)).toStrictEqual({ text: "$500.00", note: "" });
    expect(estimateFor("lni", EMPTY_ANSWERS, null)).toStrictEqual({ text: "—", note: "Choose one to see it." });
  });
});
