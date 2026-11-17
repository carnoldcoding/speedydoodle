import { describe, expect, it } from "vitest";
import { estimateCustom, estimateLive, estimateOther, eventHours, formatMoney } from "./estimate";

// Each expected value is the amount the server calculates for the same answers.
describe("the estimate of a custom caricature", () => {
  it("is 225 for 1 person, no background, no words: base 150 plus 75", () => {
    expect(estimateCustom({ people: 1, background: "none", words: false })).toBe(225);
  });
  it("is 375 for 2 people, a simple background, and words: 150 + 150 + 50 + 25", () => {
    expect(estimateCustom({ people: 2, background: "simple", words: true })).toBe(375);
  });
  it("is 415 for 3 people and a detailed background: 150 + 190 + 75", () => {
    expect(estimateCustom({ people: 3, background: "complex", words: false })).toBe(415);
  });
  it("is 440 for 5 people: 150, plus 190 for three, plus 50 for each of the other two", () => {
    expect(estimateCustom({ people: 5, background: "none", words: false })).toBe(440);
  });
});

describe("the estimate of a live event", () => {
  it("counts 3 hours from 18:00 to 21:00", () => {
    expect(eventHours("18:00", "21:00")).toBe(3);
  });
  it("counts 3.5 hours for an event that ends after midnight", () => {
    expect(eventHours("22:00", "01:30")).toBe(3.5);
  });
  it("is 455.48 for 3 hours and 20 miles one way: 450, plus 40 miles / 27 * 3.7 = 5.48", () => {
    expect(estimateLive({ startTime: "18:00", endTime: "21:00", oneWayMiles: 20 })).toBe(455.48);
  });
  it("is 450 for 3 hours when the distance is not known", () => {
    expect(estimateLive({ startTime: "18:00", endTime: "21:00", oneWayMiles: null })).toBe(450);
  });
  it("is 164.25 for 1 hour and 52 miles one way, as the first live quote on the site", () => {
    expect(estimateLive({ startTime: "21:00", endTime: "22:00", oneWayMiles: 52 })).toBe(164.25);
  });
});

describe("the estimate of a logo or an illustration", () => {
  it("is 75 an hour for a logo and 500 for an illustration", () => {
    expect(estimateOther("logo")).toEqual({ amount: 75, perHour: true });
    expect(estimateOther("illustration")).toEqual({ amount: 500, perHour: false });
  });
});

describe("money as text", () => {
  it("shows dollars and cents", () => {
    expect(formatMoney(375)).toBe("$375.00");
    expect(formatMoney(455.48)).toBe("$455.48");
  });
});
