# Tina Fallah | SKIN CLUB Frontend

Next.js (App Router) frontend for **Tina Fallah | SKIN CLUB**, built with React 19, TypeScript, Tailwind CSS v4, React Hook Form, and Zod.

## Tech Stack

- **Framework:** Next.js 16 (App Router, `output: "standalone"`)
- **UI Library:** React 19
- **Language:** TypeScript 5 (`strict: true`)
- **Styling:** Tailwind CSS v4 (`@tailwindcss/postcss`, custom `brand-*` theme tokens in `src/app/globals.css`)
- **Typography:** `Vazirmatn` + `Cormorant Garamond` via `next/font/google` (`dir="rtl"`)
- **Icons:** Lucide React
- **Forms & Validation:** React Hook Form, `@hookform/resolvers`, Zod
- **Linting:** ESLint 9 (`eslint-config-next`)

## Project Structure

```text
.
├── public/                             # Static assets
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── layout.tsx              # Centered auth layout
│   │   │   └── login/page.tsx          # Sign-in page (/login)
│   │   ├── error.tsx                   # Route error boundary
│   │   ├── globals.css                 # Tailwind v4 @theme brand palette & RTL typography
│   │   ├── layout.tsx                  # Root RTL layout & Google Fonts
│   │   ├── loading.tsx                 # Root loading fallback
│   │   ├── not-found.tsx               # 404 page
│   │   └── page.tsx                    # Tina Fallah | SKIN CLUB landing page (/)
│   ├── components/
│   │   ├── landing/                    # Modular landing page sections
│   │   │   ├── about-section.tsx
│   │   │   ├── announcement-bar.tsx
│   │   │   ├── constants.ts
│   │   │   ├── courses-section.tsx
│   │   │   ├── footer.tsx
│   │   │   ├── hero-section.tsx
│   │   │   ├── instagram-cta.tsx
│   │   │   ├── magazine-coming-soon.tsx
│   │   │   ├── navbar.tsx
│   │   │   ├── shop-coming-soon.tsx
│   │   │   └── value-props.tsx
│   │   └── ui/                         # Reusable UI state primitives
│   │       ├── empty-state.tsx
│   │       ├── error-state.tsx
│   │       └── loading-state.tsx
│   ├── features/
│   │   └── auth/                       # Auth components, Zod schemas, service & types
│   └── lib/
│       ├── api-client.ts               # Fetch wrapper with proactive/reactive JWT refresh
│       ├── env.ts                      # Centralized NEXT_PUBLIC_* config
│       ├── tokens.ts                   # SSR-safe localStorage token storage
│       └── utils.ts                    # Shared helpers
├── .env.example                        # Environment variable template
├── Dockerfile                          # Multi-stage standalone Docker build
├── next.config.ts
└── package.json
```

## Getting Started

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Configure environment variables:**

   ```bash
   cp .env.example .env.local
   ```

3. **Run development server:**

   ```bash
   npm run dev
   ```

4. **Verify & build for production:**

   ```bash
   npm run typecheck
   npm run lint
   npm run build
   npm run start
   ```
