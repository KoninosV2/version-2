import { useRef, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { getIsDark, setThemeChoice, subscribe } from "@/lib/theme";

const EASE_OUT: [number, number, number, number] = [0.25, 1, 0.5, 1];

declare global {
  interface Document {
    startViewTransition?: (cb: () => void) => { finished: Promise<void> };
  }
}

const ThemeToggle = ({ id, label }: { id?: string; label?: string } = {}) => {
  // Reactive resolved theme: starts on the system preference and tracks it live
  // until the user picks a side, after which the explicit choice persists.
  const isDark = useSyncExternalStore(subscribe, getIsDark, () => false);
  const btnRef = useRef<HTMLButtonElement>(null);

  const toggle = () => {
    const btn = btnRef.current;
    if (btn) {
      const { left, top, width, height } = btn.getBoundingClientRect();
      document.documentElement.style.setProperty("--vt-x", `${left + width / 2}px`);
      document.documentElement.style.setProperty("--vt-y", `${top + height / 2}px`);
    }

    // Flip to the explicit opposite of the current resolved theme.
    const apply = () => setThemeChoice(isDark ? "light" : "dark");
    if (!document.startViewTransition) {
      apply();
      return;
    }
    document.startViewTransition(apply);
  };

  const ariaLabel = isDark ? "Switch to light mode" : "Switch to dark mode";

  const icon = (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={isDark ? "sun" : "moon"}
        initial={{ scale: 0.4, rotate: -60, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        exit={{ scale: 0.4, rotate: 60, opacity: 0 }}
        transition={{ duration: 0.2, ease: EASE_OUT }}
      >
        {isDark ? <Sun size={18} strokeWidth={2} /> : <Moon size={18} strokeWidth={2} />}
      </motion.div>
    </AnimatePresence>
  );

  // Labeled variant: a single full-width button (icon + text) for the mobile
  // menu. The icon and text share ONE activation target — never wrap this in a
  // <label htmlFor>, which forwards a second synthetic click to the button and
  // makes the toggle fire twice (appearing not to switch at all).
  if (label) {
    return (
      <button
        ref={btnRef}
        id={id}
        onClick={toggle}
        aria-label={ariaLabel}
        className={[
          "w-full flex items-center gap-2 py-2",
          "text-sm font-medium text-muted-foreground hover:text-foreground",
          "transition-colors duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:rounded-sm",
        ].join(" ")}
      >
        <span className="flex w-9 h-9 items-center justify-center rounded-full border border-border">
          {icon}
        </span>
        <span>{label}</span>
      </button>
    );
  }

  return (
    <button
      ref={btnRef}
      id={id}
      onClick={toggle}
      aria-label={ariaLabel}
      className={[
        "w-9 h-9 rounded-full",
        "border border-border",
        "flex items-center justify-center",
        "text-muted-foreground hover:text-primary hover:border-primary/50",
        "transition-colors duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      ].join(" ")}
    >
      {icon}
    </button>
  );
};

export default ThemeToggle;
