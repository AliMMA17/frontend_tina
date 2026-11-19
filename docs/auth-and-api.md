# Frontend Auth, API Client & Environment Config

## Environment Configuration (`src/lib/env.ts`)

Only the main API base URL and app name come from environment variables:

- `NEXT_PUBLIC_API_BASE_URL` (default: `http://localhost:8000`; trailing slashes are stripped)
- `NEXT_PUBLIC_APP_NAME` (default: `"Tina Fallah | SKIN CLUB"`)

All backend paths are centralized as constants in `API_ENDPOINTS`:

```ts
export const API_ENDPOINTS = {
  authRegister: "/api/v1/auth/register",
  authLogin: "/api/v1/auth/login",
  authRefresh: "/api/v1/auth/refresh",
  users: "/api/v1/users",
  blogs: "/api/v1/blogs",
  uploadImage: "/api/v1/uploads/images",
  health: "/api/v1/health",
} as const;
```

In production behind Nginx (`gateway/default.conf`), `NEXT_PUBLIC_API_BASE_URL` points to the gateway origin (e.g. `http://46.249.107.230`), and Nginx proxies `/api/*` to the FastAPI `backend:8000` container.

## Request Lifecycle (`src/lib/api-client.ts`)

1. **URL resolution:** Prepends `API_BASE_URL` unless the passed endpoint is already a full `http...` URL.
2. **Auth injection (`!skipAuth`):**
   - Reads `access_token` from `tokenStorage` (`localStorage` keys `tina_access_token` / `tina_refresh_token` in `src/lib/tokens.ts`).
   - If the access token is expired (within a 15s buffer) and a refresh token exists, proactively calls `requestNewAccessToken()` before sending the request.
3. **401 retry:**
   - If a non-auth endpoint returns `401` and a refresh token exists, refreshes once (deduplicating concurrent refresh calls via `refreshPromise`) and retries the request.
   - If refresh returns `401` or invalid tokens, clears tokens and redirects to `/login`.
4. **Error parsing (`parseApiError`):**
   - Extracts `detail` string or FastAPI Pydantic validation arrays (`detail: [{ loc, msg, type }]`) into `ApiError.message` and `ApiError.fieldErrors`.

## Route Protection (`AuthGuard`)

`src/features/auth/components/auth-guard.tsx`:
- Calls `ensureValidSession()` (decodes JWT claims `sub`, `username`, `role`, `exp`; refreshes if expired).
- Redirects unauthenticated users to `/login`.
- When `requiredRole="admin"` is set (as in `src/app/admin/layout.tsx`), compares `session.role === "admin"` and renders an access-restricted card if a non-admin user is signed in.
- Note: Backend routes (`GET /api/v1/users`, `POST/PATCH/DELETE /api/v1/blogs`, `GET /api/v1/blogs/admin`) still independently enforce `AdminUser` server-side from PostgreSQL.
