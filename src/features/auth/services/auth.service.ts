import { apiClient, parseApiError } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/env";
import { decodeJwtPayload, isTokenExpired, tokenStorage } from "@/lib/tokens";
import { toEnglishDigits } from "@/lib/utils";
import type {
  HealthResponse,
  JwtClaims,
  LoginPayload,
  RegisterPayload,
  RegisterResponse,
  TokenPairResponse,
} from "../types/auth.types";

/**
 * Registers a new customer account via POST /api/v1/auth/register
 * and persists the returned access and refresh tokens.
 */
export async function registerUser(
  payload: RegisterPayload
): Promise<RegisterResponse> {
  const normalizedPayload: RegisterPayload = {
    username: payload.username.trim(),
    password: payload.password,
    full_name: payload.full_name.trim(),
    phone_number: toEnglishDigits(payload.phone_number).replace(/\s+/g, ""),
    full_address: payload.full_address.trim(),
    job: payload.job.trim(),
    work_page:
      typeof payload.work_page === "string" && payload.work_page.trim()
        ? payload.work_page.trim()
        : null,
    income:
      payload.income === undefined ||
      payload.income === null ||
      String(payload.income).trim() === ""
        ? null
        : String(payload.income).trim(),
  };

  const response = await apiClient(API_ENDPOINTS.authRegister, {
    method: "POST",
    skipAuth: true,
    body: JSON.stringify(normalizedPayload),
  });

  if (!response.ok) {
    throw await parseApiError(
      response,
      "ثبت‌نام انجام نشد. لطفاً اطلاعات را بررسی کنید."
    );
  }

  const data: RegisterResponse = await response.json();
  if (data.access_token) {
    tokenStorage.setTokens(data.access_token, data.refresh_token);
  }

  return data;
}

/**
 * Authenticates a user via POST /api/v1/auth/login
 * and persists the returned access and refresh tokens.
 */
export async function login(payload: LoginPayload): Promise<TokenPairResponse> {
  const response = await apiClient(API_ENDPOINTS.authLogin, {
    method: "POST",
    skipAuth: true,
    body: JSON.stringify({
      username: payload.username.trim(),
      password: payload.password,
    }),
  });

  if (!response.ok) {
    throw await parseApiError(
      response,
      "نام کاربری یا رمز عبور نادرست است."
    );
  }

  const data: TokenPairResponse = await response.json();
  if (data.access_token) {
    tokenStorage.setTokens(data.access_token, data.refresh_token);
  }

  return data;
}

/**
 * Refreshes tokens explicitly via POST /api/v1/auth/refresh.
 */
export async function refreshTokens(): Promise<TokenPairResponse> {
  const refreshToken = tokenStorage.getRefreshToken();
  if (!refreshToken) {
    tokenStorage.clearTokens();
    throw new Error("توکن بازیابی نشست یافت نشد.");
  }

  const response = await apiClient(API_ENDPOINTS.authRefresh, {
    method: "POST",
    skipAuth: true,
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  if (!response.ok) {
    if (response.status === 401) {
      tokenStorage.clearTokens();
    }
    throw await parseApiError(response, "نشست کاربری منقضی شده است.");
  }

  const data: TokenPairResponse = await response.json();
  if (data.access_token) {
    tokenStorage.setTokens(data.access_token, data.refresh_token);
  }

  return data;
}

/**
 * Checks service availability via GET /api/v1/health.
 */
export async function checkHealth(): Promise<HealthResponse> {
  const response = await apiClient(API_ENDPOINTS.health, {
    method: "GET",
    skipAuth: true,
  });

  if (!response.ok) {
    throw await parseApiError(response, "سرویس در دسترس نیست.");
  }

  return response.json();
}

/**
 * Decodes claims (sub, username, role, exp) from the stored access_token JWT.
 */
export function getSessionClaims(): JwtClaims | null {
  const accessToken = tokenStorage.getAccessToken();
  if (!accessToken) return null;
  return decodeJwtPayload<JwtClaims>(accessToken);
}

/**
 * Ensures an active session exists, refreshing if the access_token is expired.
 */
export async function ensureValidSession(): Promise<JwtClaims | null> {
  const accessToken = tokenStorage.getAccessToken();
  const refreshToken = tokenStorage.getRefreshToken();

  if (!accessToken && !refreshToken) {
    return null;
  }

  if (accessToken && !isTokenExpired(accessToken)) {
    return decodeJwtPayload<JwtClaims>(accessToken);
  }

  if (refreshToken) {
    const pair = await refreshTokens();
    return decodeJwtPayload<JwtClaims>(pair.access_token);
  }

  tokenStorage.clearTokens();
  return null;
}

/**
 * Clears stored authentication tokens.
 */
export function logout(): void {
  tokenStorage.clearTokens();
}
