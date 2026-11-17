import { env } from "./env";
import { tokenStorage } from "./tokens";

export const API_BASE_URL = env.apiBaseUrl;

let refreshPromise: Promise<string> | null = null;

export class ApiError extends Error {
  status: number;
  detail?: unknown;

  constructor(message: string, status: number, detail?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.detail = detail;
  }
}

/**
 * Extracts a human-readable error message from a failed Fetch Response.
 */
export async function parseApiError(
  response: Response,
  fallbackMessage = "An unexpected error occurred."
): Promise<ApiError> {
  const errorData = await response.json().catch(() => ({}));
  const detail = errorData?.detail;

  let message = "";

  if (typeof detail === "string" && detail.trim()) {
    message = detail;
  } else if (Array.isArray(detail) && typeof detail[0]?.msg === "string") {
    message = detail[0].msg;
  } else if (typeof errorData?.message === "string" && errorData.message.trim()) {
    message = errorData.message;
  } else if (response.status === 401) {
    message = "Your session has expired. Please sign in again.";
  } else if (response.status === 403) {
    message = "You do not have permission to perform this action.";
  } else {
    message = fallbackMessage;
  }

  return new ApiError(message, response.status, detail);
}

/**
 * Checks if a JWT token is expired (or will expire within the next 15 seconds).
 */
function isTokenExpired(token: string | null): boolean {
  if (!token) return true;
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return true;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const { exp } = JSON.parse(jsonPayload);
    if (!exp) return false;
    // Buffer by 15 seconds to prevent in-flight expiration
    return Date.now() >= exp * 1000 - 15000;
  } catch {
    return false;
  }
}

/**
 * Requests a new access token using the stored refresh token.
 * Deduplicates concurrent refresh calls into a single in-flight request.
 */
async function requestNewToken(): Promise<string> {
  const refreshToken = tokenStorage.getRefreshToken();
  if (!refreshToken) {
    tokenStorage.clearTokens();
    throw new Error("No active session found. Please sign in again.");
  }

  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    try {
      const refreshPath = env.authRefreshPath.startsWith("/")
        ? env.authRefreshPath
        : `/${env.authRefreshPath}`;

      const response = await fetch(`${API_BASE_URL}${refreshPath}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${refreshToken}`,
        },
        body: JSON.stringify({
          refresh_token: refreshToken,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        tokenStorage.clearTokens();
        throw new Error(errData.message || "Your session has expired.");
      }

      const data = await response.json();

      const newAccessToken =
        data.access_token || data.accessToken || data.token || data.data?.access_token;
      const newRefreshToken =
        data.refresh_token || data.refreshToken || data.data?.refresh_token || refreshToken;

      if (!newAccessToken) {
        tokenStorage.clearTokens();
        throw new Error("Invalid token payload received from server.");
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
 * and single-retry 401 token renewal.
 */
export async function apiClient(
  endpoint: string,
  options: ApiClientOptions = {}
): Promise<Response> {
  const { skipAuth = false, headers: customHeaders, ...restOptions } = options;

  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  const headers = new Headers(customHeaders || {});

  // Do not set Content-Type for FormData (the browser adds the multipart boundary)
  if (!headers.has("Content-Type") && !(restOptions.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  let tokenSent: string | null = null;

  if (!skipAuth) {
    let accessToken = tokenStorage.getAccessToken();

    // 1. Proactive refresh before sending an expired token
    if (accessToken && isTokenExpired(accessToken) && tokenStorage.getRefreshToken()) {
      try {
        accessToken = await requestNewToken();
      } catch (err) {
        console.warn("[Auth] Proactive refresh failed, proceeding with current token:", err);
      }
    }

    if (accessToken) {
      tokenSent = accessToken;
      headers.set("Authorization", `Bearer ${accessToken}`);
    }
  }

  let response = await fetch(url, { ...restOptions, headers });

  // 2. Reactive refresh on 401 Unauthorized
  const isAuthEndpoint =
    url.includes(env.authRefreshPath) || url.includes(env.authLoginPath);

  if (response.status === 401 && !skipAuth && !isAuthEndpoint && tokenStorage.getRefreshToken()) {
    try {
      const currentStoredToken = tokenStorage.getAccessToken();

      let freshToken: string;
      if (
        currentStoredToken &&
        currentStoredToken !== tokenSent &&
        !isTokenExpired(currentStoredToken)
      ) {
        freshToken = currentStoredToken;
      } else {
        freshToken = await requestNewToken();
      }

      headers.set("Authorization", `Bearer ${freshToken}`);
      response = await fetch(url, { ...restOptions, headers });
    } catch (error) {
      console.error("[Auth] 401 retry failed:", error);
    }
  }

  return response;
}
