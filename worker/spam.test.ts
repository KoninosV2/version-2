import { describe, it, expect } from "vitest";
import { isHoneypotFilled, isTimingSuspicious, MIN_SUBMIT_MS, MAX_AGE_MS } from "./spam";

describe("isHoneypotFilled", () => {
  it("is false for empty / whitespace / missing values", () => {
    expect(isHoneypotFilled("")).toBe(false);
    expect(isHoneypotFilled("   ")).toBe(false);
    expect(isHoneypotFilled(undefined)).toBe(false);
    expect(isHoneypotFilled(null)).toBe(false);
  });

  it("is true when a bot typed something", () => {
    expect(isHoneypotFilled("http://spam.example")).toBe(true);
  });
});

describe("isTimingSuspicious", () => {
  const now = 1_000_000_000_000;

  it("flags a missing or non-numeric timestamp", () => {
    expect(isTimingSuspicious(undefined, now)).toBe(true);
    expect(isTimingSuspicious("123", now)).toBe(true);
    expect(isTimingSuspicious(NaN, now)).toBe(true);
  });

  it("flags an instant (too fast) submit", () => {
    expect(isTimingSuspicious(now - (MIN_SUBMIT_MS - 1), now)).toBe(true);
  });

  it("flags a stale submit", () => {
    expect(isTimingSuspicious(now - (MAX_AGE_MS + 1), now)).toBe(true);
  });

  it("accepts a plausible human timing", () => {
    expect(isTimingSuspicious(now - 8_000, now)).toBe(false);
  });
});
