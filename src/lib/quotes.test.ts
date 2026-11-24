import { describe, expect, it } from "vitest";
import { FADE_TIME, nextQuote, stayTime } from "./quotes";

describe("stayTime", () => {
  // R26 of docs/specs/phone-first-screen.md: 2 seconds plus 40 milliseconds for each character.
  it("gives 6.36 seconds to a testimonial of 109 characters", () => {
    expect(stayTime("a".repeat(109))).toBe(6360);
  });

  it("gives 13.84 seconds to a testimonial of 296 characters", () => {
    expect(stayTime("a".repeat(296))).toBe(13840);
  });

  it("gives 2 seconds to an empty text", () => {
    expect(stayTime("")).toBe(2000);
  });

  it("counts a character outside the basic plane one time", () => {
    expect(stayTime("😀")).toBe(2040);
  });
});

describe("nextQuote", () => {
  // R25: after the last testimonial, the first shows again.
  it("goes to the next testimonial", () => {
    expect(nextQuote(0, 7)).toBe(1);
  });

  it("goes from the last testimonial to the first", () => {
    expect(nextQuote(6, 7)).toBe(0);
  });

  it("stays on the first when there is one testimonial or none", () => {
    expect(nextQuote(0, 1)).toBe(0);
    expect(nextQuote(0, 0)).toBe(0);
  });
});

describe("FADE_TIME", () => {
  // R27: the old text goes out in 200 milliseconds, then the new text comes in in 200.
  it("is 200 milliseconds", () => {
    expect(FADE_TIME).toBe(200);
  });
});
