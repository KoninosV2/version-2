// Generates public/sitemap.xml from the canonical URL list.
// Runs automatically before `npm run build` via the "prebuild" script, so the
// sitemap is refreshed on every publish (GitHub Pages deploy runs `npm run build`).
import { execSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const SITE_ORIGIN = "https://version2.gr";

// Canonical, indexable URLs only. This is a single-page app, so on-page anchors
// (#services, #about, #process, #contact) are NOT separate URLs and must not be
// listed here. Add an entry only when a real standalone route ships.
const ROUTES = [{ path: "/", changefreq: "monthly", priority: "1.0" }];

/**
 * Last content-change date as YYYY-MM-DD. Uses the most recent commit date so
 * <lastmod> reflects real changes and does not churn on no-op rebuilds; falls
 * back to the current date when git history is unavailable.
 * @returns {string}
 */
function getLastModified() {
  try {
    return execSync("git log -1 --format=%cs", { encoding: "utf8" }).trim();
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
}

/**
 * @param {string} lastmod
 * @returns {string}
 */
function buildSitemap(lastmod) {
  const urls = ROUTES.map(({ path, changefreq, priority }) =>
    [
      "  <url>",
      `    <loc>${SITE_ORIGIN}${path}</loc>`,
      `    <lastmod>${lastmod}</lastmod>`,
      `    <changefreq>${changefreq}</changefreq>`,
      `    <priority>${priority}</priority>`,
      "  </url>",
    ].join("\n"),
  ).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

const outPath = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "public",
  "sitemap.xml",
);

writeFileSync(outPath, buildSitemap(getLastModified()), "utf8");
console.log(`Generated ${outPath}`);
