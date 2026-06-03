import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { initThemeListener } from "./lib/theme";
import "./index.css";

initThemeListener();
createRoot(document.getElementById("root")!).render(<App />);
