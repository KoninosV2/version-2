import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: "/",
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
    // Proxy the form API to a locally-running Worker (`wrangler dev` on :8787)
    // so `bun run dev` exercises the real /api/contact endpoint end-to-end.
    proxy: {
      "/api": "http://localhost:8787",
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    // Force a single React instance so deps (react-hook-form, etc.) don't load
    // a second copy in dev ("Invalid hook call") .
    dedupe: ["react", "react-dom"],
  },
}));
