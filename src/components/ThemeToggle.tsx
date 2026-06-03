import { useRef, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Monitor, Moon, Sun } from "lucide-react";
import {
  type ThemeChoice,
  getThemeChoice,
  setThemeChoice,
  subscribe,
} from "@/lib/theme";

const EASE_OUT: [number, number, number, number] = [0.25, 1, 0.5, 1];

// Cycle: System → Light → Dark → System.
const NEXT: Record<ThemeChoice, ThemeChoice> = {
  system: "light",
  light: "dark",
  dark: "system",
};
const ICON: Record<ThemeChoice, typeof Sun> = { system: Monitor, light: Sun, dark: Moon };
const LABEL: Record<ThemeChoice, string> = { system: "System", light: "Light", dark: "Dark" };

declare global {
  interface Document {
    startViewTransition?: (cb: () => void) => { finished: Promise<void> };
  }
}

const ThemeToggle = ({ id }: { id?: string } = {}) => {
  const choice = useSyncExternalStore(
    subscribe,
    getThemeChoice,
    () => "system" as ThemeChoice,
  );
  const btnRef = useRef<HTMLButtonElement>(null);
  const Icon = ICON[choice];

  const cycle = () => {
    const next = NEXT[choice];

    const btn = btnRef.current;
    if (btn) {
      const { left, top, width, height } = btn.getBoundingClientRect();
      document.documentElement.style.setProperty("--vt-x", `${left + width / 2}px`);
      document.documentElement.style.setProperty("--vt-y", `${top + height / 2}px`);
    }

    const apply = () => setThemeChoice(next);
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
      onClick={cycle}
      aria-label={`Theme: ${LABEL[choice]}. Activate to switch to ${LABEL[NEXT[choice]]}.`}
      title={`Theme: ${LABEL[choice]}`}
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
          key={choice}
          initial={{ scale: 0.4, rotate: -60, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          exit={{ scale: 0.4, rotate: 60, opacity: 0 }}
          transition={{ duration: 0.2, ease: EASE_OUT }}
        >
          <Icon size={18} strokeWidth={2} />
        </motion.div>
      </AnimatePresence>
    </button>
  );
};

export default ThemeToggle;
