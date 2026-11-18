export const env = {
  appName: process.env.NEXT_PUBLIC_APP_NAME || "Tina Fallah | SKIN CLUB",
  appVersion: process.env.NEXT_PUBLIC_APP_VERSION || "0.1.0",
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000",
  authRegisterPath:
    process.env.NEXT_PUBLIC_AUTH_REGISTER_PATH || "/api/v1/auth/register",
  authLoginPath:
    process.env.NEXT_PUBLIC_AUTH_LOGIN_PATH || "/api/v1/auth/login",
  authRefreshPath:
    process.env.NEXT_PUBLIC_AUTH_REFRESH_PATH || "/api/v1/auth/refresh",
  usersPath: process.env.NEXT_PUBLIC_USERS_PATH || "/api/v1/users",
  healthPath: process.env.NEXT_PUBLIC_HEALTH_PATH || "/health",
} as const;
