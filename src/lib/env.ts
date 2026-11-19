const rawApiBaseUrl = (
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"
).replace(/\/+$/, "");

export const env = {
  appName: process.env.NEXT_PUBLIC_APP_NAME || "Tina Fallah | SKIN CLUB",
  appVersion: process.env.NEXT_PUBLIC_APP_VERSION || "0.1.0",
  apiBaseUrl: rawApiBaseUrl,
} as const;

export const API_ENDPOINTS = {
  authRegister: "/api/v1/auth/register",
  authLogin: "/api/v1/auth/login",
  authRefresh: "/api/v1/auth/refresh",
  users: "/api/v1/users",
  blogs: "/api/v1/blogs",
  uploadImage: "/api/v1/uploads/images",
  health: "/api/v1/health",
} as const;

export function resolveMediaUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  if (trimmed.startsWith("/uploads/")) {
    return `${env.apiBaseUrl}${trimmed}`;
  }
  return trimmed;
}
