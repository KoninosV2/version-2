/**
 * Pure spam-heuristic helpers, kept free of Worker globals so they are unit
 * testable. The Worker composes these with the platform rate-limit binding.
 */

/** Reject submissions that arrive faster than a human could plausibly fill the form. */
export const MIN_SUBMIT_MS = 3_000;

/** Reject submissions whose render timestamp is implausibly old (stale/replayed). */
export const MAX_AGE_MS = 2 * 60 * 60 * 1000; // 2 hours

/**
 * A hidden field real users never see. Any non-empty value means a bot filled it.
 */
export function isHoneypotFilled(value: unknown): boolean {
  return typeof value === "string" && value.trim() !== "";
}

/**
 * True when the render-to-submit timing looks bot-like: a missing/non-numeric
 * timestamp, an instant submit (< MIN_SUBMIT_MS), or a stale one (> MAX_AGE_MS).
 */
export function isTimingSuspicious(ts: unknown, now: number): boolean {
  if (typeof ts !== "number" || !Number.isFinite(ts)) return true;
  const age = now - ts;
  if (age < MIN_SUBMIT_MS) return true;
  if (age > MAX_AGE_MS) return true;
  return false;
}
