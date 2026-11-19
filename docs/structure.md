# Frontend Folder Structure & Routes

## Directory Map

```text
app/frontend/
├── Agent.md                            # Quick guide for AI coding agents
├── docs/                               # Detailed frontend documentation
├── Dockerfile                          # Multi-stage Node 20-alpine standalone build (receives NEXT_PUBLIC_API_BASE_URL)
├── next.config.ts                      # output: "standalone", injects NEXT_PUBLIC_APP_VERSION
├── package.json
├── .env / .env.example                 # NEXT_PUBLIC_APP_NAME, NEXT_PUBLIC_API_BASE_URL
├── public/                             # Static SVG/media assets
└── src/
    ├── app/                            # Next.js App Router pages & layouts
    │   ├── layout.tsx                  # Root RTL Persian layout + Google Fonts (Vazirmatn, Cormorant Garamond)
    │   ├── globals.css                 # Tailwind v4 @theme brand tokens & helper classes
    │   ├── page.tsx                    # Landing page (/)
    │   ├── loading.tsx / error.tsx / not-found.tsx
    │   ├── (auth)/
    │   │   ├── layout.tsx              # Centered auth card layout (shows app version)
    │   │   ├── login/page.tsx          # /login
    │   │   └── register/page.tsx       # /register
    │   ├── blogs/
    │   │   ├── page.tsx                # Public blog listing (/blogs)
    │   │   └── [slug]/page.tsx         # Public article reader (/blogs/[slug])
    │   └── admin/
    │       ├── layout.tsx              # Wraps /admin in <AuthGuard requiredRole="admin">
    │       └── page.tsx                # Admin dashboard (/admin)
    ├── components/
    │   ├── landing/                    # Homepage & shared navigation/footer components
    │   │   ├── announcement-bar.tsx
    │   │   ├── navbar.tsx              # Sticky top nav (session-aware, links to /blogs and /admin for admins)
    │   │   ├── hero-section.tsx
    │   │   ├── value-props.tsx
    │   │   ├── courses-section.tsx
    │   │   ├── shop-coming-soon.tsx
    │   │   ├── magazine-coming-soon.tsx
    │   │   ├── about-section.tsx
    │   │   ├── instagram-cta.tsx
    │   │   ├── footer.tsx
    │   │   └── constants.ts            # NAV_LINKS, BRAND_INSTAGRAM_*, HERO_PACK_ITEMS
    │   └── ui/                         # Reusable UI state primitives
    │       ├── empty-state.tsx
    │       ├── error-state.tsx
    │       └── loading-state.tsx
    ├── features/                       # Feature-sliced domain modules
    │   ├── auth/
    │   │   ├── components/             # AuthGuard, LoginForm, RegisterForm
    │   │   ├── schemas/auth.schema.ts  # Zod login & register schemas
    │   │   ├── services/auth.service.ts# registerUser, login, refreshTokens, checkHealth, getSessionClaims, ensureValidSession, logout
    │   │   ├── types/auth.types.ts
    │   │   └── utils/form-errors.ts    # Maps FastAPI 422 field errors into react-hook-form
    │   ├── admin/
    │   │   ├── components/
    │   │   │   ├── admin-dashboard-view.tsx  # Shared admin header + Users / Blogs tab switcher
    │   │   │   ├── admin-users-view.tsx      # AdminUsersSection table, pagination & detail modal trigger
    │   │   │   ├── user-detail-modal.tsx
    │   │   │   ├── admin-blogs-section.tsx   # Admin blog list, filter (all/published/draft), publish toggle, delete
    │   │   │   ├── blog-editor-modal.tsx     # Create/edit blog modal with cover upload
    │   │   │   └── rich-text-editor.tsx      # Interactive WYSIWYG editor (bold/headings/lists/links/inline images)
    │   │   ├── hooks/use-admin-users.ts
    │   │   ├── services/admin-users.service.ts
    │   │   └── types/admin-users.types.ts
    │   └── blogs/
    │       ├── components/
    │       │   ├── blog-cover.tsx            # Cover image with graceful brand-gradient fallback
    │       │   ├── blogs-list-view.tsx       # Public paginated /blogs grid
    │       │   └── blog-detail-view.tsx      # Public /blogs/[slug] article view
    │       ├── hooks/use-blogs.ts            # usePublishedBlogs, usePublishedBlog, useAdminBlogs
    │       ├── schemas/blog.schema.ts        # Zod blog form schema
    │       ├── services/blogs.service.ts     # Public & admin /api/v1/blogs calls + uploadBlogImage
    │       ├── types/blog.types.ts
    │       └── utils/rich-content.ts         # Allowlist HTML sanitizer, legacy text converter & plain-text extractor
    └── lib/                            # Core utilities & infrastructure
        ├── env.ts                      # env.apiBaseUrl + API_ENDPOINTS constants
        ├── api-client.ts               # Fetch wrapper, token injection/refresh, FastAPI 422 error parser
        ├── tokens.ts                   # localStorage token storage & JWT decode/expiry helpers
        └── utils.ts                    # cn(), formatNumber(), formatDate()
```

## App Router Pages Summary

| Route | Access | Purpose |
|---|---|---|
| `/` | Public | Marketing landing page |
| `/login` | Public | Username + password sign-in |
| `/register` | Public | Customer registration |
| `/blogs` | Public | Published blog posts list |
| `/blogs/[slug]` | Public | Single published blog post |
| `/admin` | Admin (`role === "admin"`) | Users table + Blog management |

## Adding a New Feature Module

1. Create `src/features/<feature>/{types,schemas,services,hooks,components}/`.
2. Add any new backend prefix to `API_ENDPOINTS` in `src/lib/env.ts` (keep only `NEXT_PUBLIC_API_BASE_URL` in `.env`).
3. Call backend endpoints via `apiClient` and parse failures with `parseApiError`.
4. Reuse `LoadingState`, `ErrorState`, and `EmptyState` from `src/components/ui/`.
5. Wire pages under `src/app/<route>/page.tsx` (wrap admin-only routes in `<AuthGuard requiredRole="admin">` inside a `layout.tsx`).
