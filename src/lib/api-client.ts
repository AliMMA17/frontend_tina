import { API_ENDPOINTS, env } from "./env";
import { isTokenExpired, tokenStorage } from "./tokens";

export const API_BASE_URL = env.apiBaseUrl;

let refreshPromise: Promise<string> | null = null;

export interface FastApiValidationItem {
  loc?: Array<string | number>;
  msg?: string;
  type?: string;
}

export class ApiError extends Error {
  status: number;
  detail?: unknown;
  fieldErrors?: Record<string, string>;

  constructor(
    message: string,
    status: number,
    detail?: unknown,
    fieldErrors?: Record<string, string>
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.detail = detail;
    this.fieldErrors = fieldErrors;
  }
}

function normalizePath(path: string): string {
  return path.startsWith("/") ? path : `/${path}`;
}

function redirectToLogin(): void {
  if (typeof window !== "undefined" && window.location.pathname !== "/login") {
    window.location.replace("/login");
  }
}

/**
 * Extracts human-readable error details and maps FastAPI 422 Pydantic
 * validation errors (`detail: [{ loc, msg, type }]`) to form field names.
 */
export async function parseApiError(
  response: Response,
  fallbackMessage = "خطای غیرمنتظره‌ای رخ داد. لطفاً دوباره تلاش کنید."
): Promise<ApiError> {
  const errorData = await response.json().catch(() => ({}));
  const detail = errorData?.detail;

  let message = "";
  let fieldErrors: Record<string, string> | undefined;

  if (typeof detail === "string" && detail.trim()) {
    message = detail.trim();
  } else if (Array.isArray(detail) && detail.length > 0) {
    const mapped: Record<string, string> = {};
    const messages: string[] = [];

    for (const item of detail as FastApiValidationItem[]) {
      const msg = typeof item?.msg === "string" ? item.msg.trim() : "";
      if (!msg) continue;

      messages.push(msg);

      if (Array.isArray(item.loc) && item.loc.length > 0) {
        const stringParts = item.loc
          .map((part) => String(part))
          .filter((part) => part !== "body" && part !== "query" && part !== "path");
        const fieldName = stringParts[stringParts.length - 1];
        if (fieldName && !mapped[fieldName]) {
          mapped[fieldName] = msg;
        }
      }
    }

    if (Object.keys(mapped).length > 0) {
      fieldErrors = mapped;
    }
    message = messages[0] || fallbackMessage;
  } else if (typeof errorData?.message === "string" && errorData.message.trim()) {
    message = errorData.message.trim();
  } else if (response.status === 401) {
    message = "نشست کاربری شما معتبر نیست یا منقضی شده است.";
  } else if (response.status === 403) {
    message = "شما دسترسی لازم برای انجام این عملیات را ندارید.";
  } else {
    message = fallbackMessage;
  }

  return new ApiError(message, response.status, detail, fieldErrors);
}

/**
 * Requests a new token pair using the stored refresh token.
 * Deduplicates concurrent refresh calls into a single in-flight request.
 * Clears tokens and redirects to /login if refresh fails with 401.
 */
export async function requestNewAccessToken(): Promise<string> {
  const refreshToken = tokenStorage.getRefreshToken();
  if (!refreshToken) {
    tokenStorage.clearTokens();
    throw new ApiError("نشست کاربری یافت نشد. لطفاً مجدداً وارد شوید.", 401);
  }

  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    try {
      const refreshPath = normalizePath(API_ENDPOINTS.authRefresh);

      const response = await fetch(`${API_BASE_URL}${refreshPath}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refresh_token: refreshToken,
        }),
      });

      if (!response.ok) {
        const apiError = await parseApiError(
          response,
          "نشست کاربری شما منقضی شده است."
        );
        if (response.status === 401) {
          tokenStorage.clearTokens();
          redirectToLogin();
        }
        throw apiError;
      }

      const data = await response.json();
      const newAccessToken: string | undefined = data.access_token;
      const newRefreshToken: string | undefined = data.refresh_token;

      if (!newAccessToken || !newRefreshToken) {
        tokenStorage.clearTokens();
        redirectToLogin();
        throw new ApiError("ساختار توکن دریافتی از سرور معتبر نیست.", 500);
      }

      tokenStorage.setTokens(newAccessToken, newRefreshToken);
      return newAccessToken;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

export interface ApiClientOptions extends RequestInit {
  skipAuth?: boolean;
}

/**
 * Fetch wrapper with automatic Bearer token injection, proactive JWT refresh,
 * and single-retry 401 token renewal via POST /api/v1/auth/refresh.
 */
export async function apiClient(
  endpoint: string,
  options: ApiClientOptions = {}
): Promise<Response> {
  const { skipAuth = false, headers: customHeaders, ...restOptions } = options;

  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE_URL}${normalizePath(endpoint)}`;

  const headers = new Headers(customHeaders || {});

  if (!headers.has("Content-Type") && !(restOptions.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  let tokenSent: string | null = null;

  if (!skipAuth) {
    let accessToken = tokenStorage.getAccessToken();

    // 1. Proactive refresh if access token is expired and refresh token exists
    if (accessToken && isTokenExpired(accessToken) && tokenStorage.getRefreshToken()) {
      try {
        accessToken = await requestNewAccessToken();
      } catch {
        accessToken = tokenStorage.getAccessToken();
      }
    }

    if (accessToken) {
      tokenSent = accessToken;
      headers.set("Authorization", `Bearer ${accessToken}`);
    }
  }

  let response = await fetch(url, { ...restOptions, headers });

  // 2. Reactive refresh on 401 Unauthorized from protected endpoints
  const isAuthEndpoint =
    url.includes(normalizePath(API_ENDPOINTS.authRefresh)) ||
    url.includes(normalizePath(API_ENDPOINTS.authLogin)) ||
    url.includes(normalizePath(API_ENDPOINTS.authRegister));

  if (
    response.status === 401 &&
    !skipAuth &&
    !isAuthEndpoint &&
    tokenStorage.getRefreshToken()
  ) {
    try {
      const currentStoredToken = tokenStorage.getAccessToken();
      const freshToken =
        currentStoredToken &&
        currentStoredToken !== tokenSent &&
        !isTokenExpired(currentStoredToken)
          ? currentStoredToken
          : await requestNewAccessToken();

      headers.set("Authorization", `Bearer ${freshToken}`);
      response = await fetch(url, { ...restOptions, headers });
    } catch {
      // requestNewAccessToken already clears tokens & redirects on 401
    }
  }

  return response;
}
