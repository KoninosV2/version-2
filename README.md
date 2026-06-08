# version2.gr

Marketing website for **version2** — a consultancy that helps businesses upgrade to *their next version* through custom CRM implementations, Salesforce solutions, and tailored software development.

🌐 **Live:** [version2.gr](https://version2.gr)

## Overview

A single-page marketing site: one route (`/`) composes the whole page from stacked section components, rendered client-side and served as static assets from Cloudflare's edge.

## Tech stack

| Area | Choice |
|------|--------|
| Build tool | [Vite](https://vitejs.dev) |
| Language | TypeScript |
| UI | React 18 |
| Styling | Tailwind CSS + a small set of [shadcn/ui](https://ui.shadcn.com) components |
| Animation | Framer Motion |
| Theming | `next-themes` (light / dark, warm-amber palette) |
| Forms | React Hook Form + Zod (shared client/server schema) |
| Package manager | [Bun](https://bun.sh) |
| Hosting | Cloudflare Workers (Worker + static assets) |
| Email | Cloudflare Email Routing `send_email` binding |

## Project structure

```
.
├── public/                     # Copied verbatim into the build output
│   ├── favicon.svg
│   ├── robots.txt              # references the sitemap
│   └── sitemap.xml             # generated at build time
├── scripts/
│   ├── generate-sitemap.mjs    # writes public/sitemap.xml before each build
│   └── generate-headers.mjs    # writes dist/_headers (security + caching) after each build
├── src/
│   ├── components/             # Page sections + UI
│   │   ├── Navigation.tsx  Hero.tsx  Services.tsx  About.tsx
│   │   ├── Process.tsx  Contact.tsx  Footer.tsx  ThemeToggle.tsx
│   │   ├── ContactForm.tsx     # lead-capture form (lazy-loaded)
│   │   └── ui/                 # shadcn/ui primitives in use
│   │       └── button · toast · toaster · sonner · tooltip · input · textarea · label
│   ├── pages/
│   │   ├── Index.tsx           # the page (assembles the sections)
│   │   └── NotFound.tsx        # 404
│   ├── hooks/use-toast.ts
│   ├── lib/
│   │   ├── utils.ts            # `cn()` class-name helper
│   │   └── contact-schema.ts   # Zod schema shared by the form and the Worker
│   ├── test/                   # Vitest setup + tests
│   ├── App.tsx                 # providers (React Query, Tooltip, toasters) + router
│   ├── main.tsx                # entry point
│   └── index.css               # design tokens (warm off-white / amber) + custom utilities
├── worker/                     # Cloudflare Worker: serves assets + POST /api/contact
│   ├── index.ts                # fetch handler (routing, validation, spam, email)
│   ├── spam.ts                 # honeypot + timing heuristics
│   └── email.ts                # builds the notification email (mimetext)
├── index.html                  # includes an inline theme script (prevents theme flash)
├── wrangler.jsonc              # Worker + static-assets + email/rate-limit bindings
└── tailwind / postcss / tsconfig / eslint / vitest config
```

## The page

`src/pages/Index.tsx` stacks the sections in order:

> **Navigation → Hero → Services → About → Process → Contact → Footer**

Each section has its own `id` for smooth-scroll anchor navigation from the nav bar.

## Contact form (lead capture)

The **Contact** section has a form (`src/components/ContactForm.tsx`) that posts to a
same-origin Worker endpoint, **`POST /api/contact`** (`worker/index.ts`). The Worker:

1. re-validates the payload against the **same Zod schema** the form uses (`src/lib/contact-schema.ts`);
2. applies three spam layers — a hidden honeypot field, a render-to-submit timing check, and a per-IP rate limit (5 / 60s, native Workers Rate Limiting binding);
3. emails the submission via the **Cloudflare Email Routing `send_email` binding** (no API key), with `Reply-To` set to the prospect so a reply goes straight back to them.

Because the endpoint is same-origin, the strict CSP needs no changes.

### Configuration

| Variable | Where | Notes |
|----------|-------|-------|
| `LEAD_FROM` | `wrangler.jsonc` (`vars`) | No-reply sender identity on the zone, e.g. `form@version2.gr` |
| `LEAD_TO` | `.dev.vars` (local) · Cloudflare dashboard var (prod) | Recipient. **Not committed** (public repo). Must be a **verified Email Routing destination address**. |

`LEAD_EMAIL` (`send_email`) and `RATE_LIMITER` (`ratelimit`) are bindings declared in `wrangler.jsonc`.

### Local development

`vite dev` alone can't run the Worker, so run both — Vite proxies `/api` to the Worker:

```sh
bun run dev          # Vite on :8080 (proxies /api → :8787)
bunx wrangler dev    # Worker on :8787 (reads .dev.vars)
```

Create a local `.dev.vars` (gitignored):

```
LEAD_TO="you@example.com"
```

## Getting started

Requires [Bun](https://bun.sh).

```sh
bun install      # install dependencies
bun run dev      # start the dev server (Vite HMR)
```

Other commands:

| Command | Does |
|---------|------|
| `bun run build` | Generate the sitemap, build to `dist/`, then generate `dist/_headers` |
| `bun run preview` | Preview the production build locally |
| `bun run test` | Run tests once (Vitest) |
| `bun run lint` | Lint (ESLint) |

## Deployment

Hosted on **Cloudflare Workers** at [version2.gr](https://version2.gr), configured in [`wrangler.jsonc`](./wrangler.jsonc): a Worker serves the static assets (SPA fallback) and handles `POST /api/contact`. A push to `main` triggers a Cloudflare build (`bun run build`) and deploy (`npx wrangler deploy`).

> **Contact-form prerequisites** (one-time, in the Cloudflare dashboard): set the `LEAD_TO` Worker variable, and ensure that address is a **verified Email Routing destination** on the zone. Without it, `send_email` will fail.

The build pipeline also:

- **regenerates `sitemap.xml`** (with a git-derived `<lastmod>`), referenced from `robots.txt`;
- **emits a `_headers` file** with a strict Content-Security-Policy and other security headers (HSTS, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`), plus long-lived caching for content-hashed assets.
