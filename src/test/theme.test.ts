import { beforeEach, describe, expect, it, vi } from "vitest";

// Controllable matchMedia mock: lets a test set the OS preference and fire
// `change` events to listeners registered via addEventListener.
function installMatchMedia(initial: boolean) {
  let matches = initial;
  const handlers = new Set<(e: { matches: boolean }) => void>();
  const mql = {
    get matches() {
      return matches;
    },
    media: "(prefers-color-scheme: dark)",
    onchange: null,
    addEventListener: (_: string, h: (e: { matches: boolean }) => void) => handlers.add(h),
    removeEventListener: (_: string, h: (e: { matches: boolean }) => void) => handlers.delete(h),
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  };
  window.matchMedia = (() => mql) as unknown as typeof window.matchMedia;
  return {
    setMatches: (v: boolean) => {
      matches = v;
      handlers.forEach((h) => h({ matches }));
    },
  };
}

// Fresh module per test (module holds singleton state).
async function loadTheme() {
  vi.resetModules();
  return import("@/lib/theme");
}

const hasDark = () => document.documentElement.classList.contains("dark");

beforeEach(() => {
  localStorage.clear();
  document.documentElement.classList.remove("dark");
});

describe("theme store", () => {
  it("applies an explicit dark choice and persists it", async () => {
    installMatchMedia(false);
    const t = await loadTheme();
    t.setThemeChoice("dark");
    expect(hasDark()).toBe(true);
    expect(localStorage.getItem("theme")).toBe("dark");
    expect(t.resolveIsDark()).toBe(true);
  });

  it("applies an explicit light choice even when the OS is dark", async () => {
    installMatchMedia(true);
    const t = await loadTheme();
    t.setThemeChoice("light");
    expect(hasDark()).toBe(false);
    expect(localStorage.getItem("theme")).toBe("light");
  });

  it("'system' follows the OS preference and clears the stored choice", async () => {
    installMatchMedia(true); // OS = dark
    const t = await loadTheme();
    t.setThemeChoice("light");
    expect(localStorage.getItem("theme")).toBe("light");
    t.setThemeChoice("system");
    expect(localStorage.getItem("theme")).toBeNull();
    expect(hasDark()).toBe(true);
  });

  it("reacts live to OS changes while in system mode", async () => {
    const mql = installMatchMedia(false); // OS = light
    const t = await loadTheme();
    t.initThemeListener();
    t.setThemeChoice("system");
    expect(hasDark()).toBe(false);
    mql.setMatches(true); // OS flips to dark
    expect(hasDark()).toBe(true);
  });

  it("ignores OS changes when an explicit choice is set", async () => {
    const mql = installMatchMedia(false);
    const t = await loadTheme();
    t.initThemeListener();
    t.setThemeChoice("light");
    mql.setMatches(true); // OS dark, but user chose light
    expect(hasDark()).toBe(false);
  });

  it("notifies subscribers on change", async () => {
    installMatchMedia(false);
    const t = await loadTheme();
    const cb = vi.fn();
    const unsub = t.subscribe(cb);
    t.setThemeChoice("dark");
    expect(cb).toHaveBeenCalledTimes(1);
    unsub();
    t.setThemeChoice("light");
    expect(cb).toHaveBeenCalledTimes(1); // not called after unsubscribe
  });

  it("reads a stored explicit choice on init", async () => {
    installMatchMedia(false);
    localStorage.setItem("theme", "dark");
    const t = await loadTheme();
    expect(t.getThemeChoice()).toBe("dark");
  });

  it("defaults to 'system' when nothing is stored", async () => {
    installMatchMedia(false);
    const t = await loadTheme();
    expect(t.getThemeChoice()).toBe("system");
  });
});
