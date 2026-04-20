import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { flushSync } from "react-dom";

const EASE_OUT: [number, number, number, number] = [0.25, 1, 0.5, 1];

declare global {
  interface Document {
    startViewTransition?: (cb: () => void) => { finished: Promise<void> };
  }
}

const ThemeToggle = ({ id }: { id?: string } = {}) => {
  const [isDark, setIsDark] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Sync with whatever the inline script applied before React hydrated
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const btn = btnRef.current;
    if (!btn) return;

    const { left, top, width, height } = btn.getBoundingClientRect();
    document.documentElement.style.setProperty("--vt-x", `${left + width / 2}px`);
    document.documentElement.style.setProperty("--vt-y", `${top + height / 2}px`);

    const next = !isDark;

    const apply = () => {
      flushSync(() => setIsDark(next));
      document.documentElement.classList.toggle("dark", next);
      localStorage.setItem("theme", next ? "dark" : "light");
    };

    if (!document.startViewTransition) {
      apply();
      return;
    }

    document.startViewTransition(apply);
  };

  return (
    <button
      ref={btnRef}
      id={id}
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={[
        "w-9 h-9 rounded-full",
        "border border-border",
        "flex items-center justify-center",
        "text-muted-foreground hover:text-primary hover:border-primary/50",
        "transition-colors duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      ].join(" ")}
    >
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
    </button>
  );
};

export default ThemeToggle;
