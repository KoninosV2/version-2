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
| Package manager | [Bun](https://bun.sh) |
| Hosting | Cloudflare Workers (static assets) |

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
│   │   └── ui/                 # The 5 shadcn/ui primitives in use
│   │       └── button · toast · toaster · sonner · tooltip
│   ├── pages/
│   │   ├── Index.tsx           # the page (assembles the sections)
│   │   └── NotFound.tsx        # 404
│   ├── hooks/use-toast.ts
│   ├── lib/utils.ts            # `cn()` class-name helper
│   ├── test/                   # Vitest setup + tests
│   ├── App.tsx                 # providers (React Query, Tooltip, toasters) + router
│   ├── main.tsx                # entry point
│   └── index.css               # design tokens (warm off-white / amber) + custom utilities
├── index.html                  # includes an inline theme script (prevents theme flash)
├── wrangler.jsonc              # Cloudflare Workers static-assets config
└── tailwind / postcss / tsconfig / eslint / vitest config
```

## The page

`src/pages/Index.tsx` stacks the sections in order:

> **Navigation → Hero → Services → About → Process → Contact → Footer**

Each section has its own `id` for smooth-scroll anchor navigation from the nav bar.

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

Hosted on **Cloudflare Workers** (static assets) at [version2.gr](https://version2.gr), configured in [`wrangler.jsonc`](./wrangler.jsonc). A push to `main` triggers a Cloudflare build (`bun run build`) and deploy (`npx wrangler deploy`).

The build pipeline also:

- **regenerates `sitemap.xml`** (with a git-derived `<lastmod>`), referenced from `robots.txt`;
- **emits a `_headers` file** with a strict Content-Security-Policy and other security headers (HSTS, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`), plus long-lived caching for content-hashed assets.
