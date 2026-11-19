# Frontend Agent Guide (`app/frontend`)

Next.js 16 (App Router) + React 19 + TypeScript (`strict: true`) + Tailwind CSS v4 frontend for **Tina Fallah | SKIN CLUB** (`lang="fa"`, `dir="rtl"`).

## Quick Orientation

- **Routing:** Next.js App Router under `src/app/` (`output: "standalone"` in `next.config.ts`)
- **Styling:** Tailwind CSS v4 (`src/app/globals.css`) with custom `brand-*` colors (`brand-green`, `brand-greenLight`, `brand-navy`, `brand-gold`, `brand-goldDark`, `brand-cream`, `brand-iceBlue`, `brand-iceLight`, `brand-muted`) and fonts (`Vazirmatn` + `Cormorant Garamond` via `.font-brand-en`).
- **Forms:** `react-hook-form` + `@hookform/resolvers/zod` + `zod` v4.
- **Icons:** `lucide-react`.

## Documentation Index

- **[docs/structure.md](docs/structure.md)** — Complete folder map, App Router pages, feature modules, and UI conventions.
- **[docs/auth-and-api.md](docs/auth-and-api.md)** — Environment config (`NEXT_PUBLIC_API_BASE_URL`), `API_ENDPOINTS`, `apiClient` JWT lifecycle, and `AuthGuard` usage.

## Important Project Conventions

- **Single base URL in env:** Only `NEXT_PUBLIC_API_BASE_URL` (and `NEXT_PUBLIC_APP_NAME`) should be set in `.env` / build args. All API endpoint paths live in `API_ENDPOINTS` inside `src/lib/env.ts`—do **not** add per-endpoint `NEXT_PUBLIC_*_PATH` env vars.
- **Build-time Next.js env baking:** `NEXT_PUBLIC_API_BASE_URL` is inlined at `npm run build` time (configured in `Dockerfile` and `app/docker-compose/frontend.yml`). Any change to `.env` or `NEXT_PUBLIC_*` requires rebuilding the `frontend` container.
- **All API calls go through `apiClient` (`src/lib/api-client.ts`):**
  - Pass `skipAuth: true` for public endpoints (`/api/v1/blogs`, `/api/v1/auth/login`, `/api/v1/auth/register`).
  - Protected endpoints automatically receive `Authorization: Bearer <access_token>`, proactive refresh before expiry, and single-retry 401 token refresh.
- **Standalone dynamic routes:** Dynamic routes like `/blogs/[slug]` fetch client-side in view components so newly published content works immediately without rebuilding the standalone Next.js bundle.
- **RTL & Persian formatting:** Root layout sets `lang="fa"` and `dir="rtl"`. Use `formatDate(..., "fa-IR")` and `formatNumber(..., "fa-IR")` from `src/lib/utils.ts`; use `dir="ltr"` for usernames, slugs, URLs, and phone numbers.

## Common Commands

```bash
npm install
npm run dev          # Local dev server on :3000
npm run typecheck    # tsc --noEmit
npm run lint         # eslint
npm run build        # Production standalone build
```
