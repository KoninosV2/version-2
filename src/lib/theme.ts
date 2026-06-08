// Central theme store. Single source of truth for light/dark/system, shared
// across every ThemeToggle via useSyncExternalStore.
//
// - "system" (the default) follows the OS `prefers-color-scheme` and tracks it
//   live; choosing "light"/"dark" is an explicit override persisted to
//   localStorage. This must stay in sync with the pre-hydration inline script
//   in index.html, which applies the same resolution before React loads.

export type ThemeChoice = "system" | "light" | "dark";

const STORAGE_KEY = "theme";
const MEDIA_QUERY = "(prefers-color-scheme: dark)";

const listeners = new Set<() => void>();
let choice: ThemeChoice = readStoredChoice();
let initialized = false;

function readStoredChoice(): ThemeChoice {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === "light" || stored === "dark" ? stored : "system";
  } catch {
    return "system";
  }
}

function systemPrefersDark(): boolean {
  return typeof window !== "undefined" && window.matchMedia(MEDIA_QUERY).matches;
}

/** Whether the given choice (default: current) resolves to dark. */
export function resolveIsDark(c: ThemeChoice = choice): boolean {
  return c === "dark" || (c === "system" && systemPrefersDark());
}

/** Current resolved dark state — reactive snapshot for useSyncExternalStore. */
export function getIsDark(): boolean {
  return resolveIsDark(choice);
}

function applyToDocument(): void {
  document.documentElement.classList.toggle("dark", resolveIsDark());
}

function notify(): void {
  listeners.forEach((listener) => listener());
}

export function getThemeChoice(): ThemeChoice {
  return choice;
}

export function setThemeChoice(next: ThemeChoice): void {
  choice = next;
  try {
    if (next === "system") localStorage.removeItem(STORAGE_KEY);
    else localStorage.setItem(STORAGE_KEY, next);
  } catch {
    /* storage unavailable (private mode) — fall back to in-memory only */
  }
  applyToDocument();
  notify();
}

export function subscribe(onChange: () => void): () => void {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

/** Wire up live OS-theme tracking. Call once at app startup. Idempotent. */
export function initThemeListener(): void {
  if (initialized || typeof window === "undefined") return;
  initialized = true;
  // Reconcile the DOM to the resolved theme on startup. The pre-hydration inline
  // script normally does this first (avoiding a flash), but if it ever fails to
  // run (e.g. blocked by CSP), this keeps the <html> class in sync with the store
  // so the page and the toggle icon can't silently disagree.
  applyToDocument();
  window.matchMedia(MEDIA_QUERY).addEventListener("change", () => {
    if (choice === "system") {
      applyToDocument();
      notify();
    }
  });
}
