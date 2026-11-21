# KUSHONIYON SMART MARKET — Frontend

The web frontend for **Kushoniyon Smart Market**, a B2B SaaS marketplace for
Kushoniyon Market in Dushanbe, Tajikistan. It lets customers browse shops,
products, prices and an interactive market map, and gives sellers and
administrators dashboards to manage the marketplace.

Built with **Next.js (App Router)** and talks to the separate backend REST API
(repository **`Smart-Kushoniyon-Back`**) at `/api/v1`.

> **Trilingual:** the entire interface is available in **Tajik (default),
> Russian and English**.

---

## Tech stack

- **Next.js 16** (App Router, React 19, TypeScript)
- **Tailwind CSS v4** design tokens + small UI component library
- **next-intl** — i18n with locale-prefixed routes (`/tj`, `/ru`, `/en`)
- **TanStack Query** — server data fetching/caching
- **Zustand** — auth state (access token kept in memory)
- **React Hook Form + Zod** — forms & validation
- **MapLibre GL** — interactive market map
- **PWA** — installable, with an offline fallback

## Requirements

- Node.js 20+ (developed on Node 24)
- The backend running locally (see `Smart-Kushoniyon-Back`) on `http://localhost:4000`

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env.local
#   NEXT_PUBLIC_API_URL should point to the backend, e.g.
#   http://localhost:4000/api/v1

# 3. Run the dev server
npm run dev
#   open http://localhost:3000  (redirects to /tj)
```

Demo logins (seeded by the backend, password `Demo1234!`):

| Role | Email |
|------|-------|
| Seller | `seller@kushoniyon.local` |
| Admin | `admin@kushoniyon.local` |
| Customer | `customer@kushoniyon.local` |

## Scripts

| Command | What it does |
|---------|--------------|
| `npm run dev` | Start the dev server (http://localhost:3000) |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run typecheck` | TypeScript check (no emit) |
| `npm run test` | Run unit tests (Vitest) |
| `npm run lint` | ESLint |

## Project structure

```
src/
├── app/[locale]/        # Pages (public + seller + admin), grouped by locale
│   ├── page.tsx         # Homepage
│   ├── shops/ products/ map/ login/ register/
│   ├── seller/          # Seller dashboard (guarded)
│   └── admin/           # Admin dashboard (guarded)
├── components/          # UI, layout, home, shops, products, map, dashboard…
├── features/            # Data access + React Query hooks per domain
├── stores/              # Zustand auth store
├── lib/                 # api-client, utils, query helpers, roles
├── i18n/                # next-intl routing + navigation
├── messages/            # tj / ru / en dictionaries
└── types/               # Shared domain types
```

## How it talks to the backend

- One API client (`src/lib/api-client.ts`) prepends `NEXT_PUBLIC_API_URL`,
  attaches the Bearer access token, and silently refreshes it on a 401 using the
  HttpOnly refresh cookie.
- Public list endpoints take `?locale=` and return localized content.
- Dashboard routes are guarded in the browser (`RequireAuth`) **and** enforced
  by the backend — the browser guard is for UX only, never the security boundary.

## Internationalization

All interface text lives in `src/messages/{tj,ru,en}.json` — nothing is
hardcoded in components. The language switcher (globe icon) swaps the locale
prefix while keeping the user on the same page.

## PWA

The app is installable (`public/manifest.webmanifest`) and registers a service
worker (`public/sw.js`) in production. The worker caches static assets and shows
`public/offline.html` when offline. It **never** caches API, auth, or
seller/admin responses, so private data is not stored in a shared cache.

## Deployment (manual)

The project owner configures GitHub, hosting, domain and server. In short:

1. Set `NEXT_PUBLIC_API_URL` to the production backend URL.
2. `npm run build` then `npm run start` (or deploy to a Node host / Vercel).
3. Serve over HTTPS (required for the PWA and secure cookies).

See the backend repo's `docs/deployment.md` for the API side.

## License

Proprietary — © Kushoniyon Smart Market.
