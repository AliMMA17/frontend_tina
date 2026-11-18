// src/lib/tokens.ts

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

export type JwtRole = "admin" | "customer";

export interface JwtClaims {
  sub: string;
  username: string;
  role: JwtRole;
  type: "access" | "refresh";
  iat: number;
  exp: number;
}

/**
 * Decodes a JWT payload (base64url + UTF-8) safely on the client.
 * Returns null if the token is missing or malformed.
 */
export function decodeJwtPayload<T = JwtClaims>(token: string | null): T | null {
  if (!token) return null;
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    const binary = atob(padded);
    const jsonPayload = decodeURIComponent(
      binary
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload) as T;
  } catch {
    return null;
  }
}

/**
 * Checks whether a JWT token is expired (or will expire within bufferSeconds).
 */
export function isTokenExpired(token: string | null, bufferSeconds = 15): boolean {
  if (!token) return true;
  const payload = decodeJwtPayload<{ exp?: number }>(token);
  if (!payload || typeof payload.exp !== "number") return false;
  return Date.now() >= payload.exp * 1000 - bufferSeconds * 1000;
}

export const tokenStorage = {
  getAccessToken: (): string | null => {
    if (typeof window === "undefined") return null;
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    return token && token !== "undefined" && token !== "null" ? token : null;
  },

  getRefreshToken: (): string | null => {
    if (typeof window === "undefined") return null;
    const token = localStorage.getItem(REFRESH_TOKEN_KEY);
    return token && token !== "undefined" && token !== "null" ? token : null;
  },

  setTokens: (accessToken: string, refreshToken?: string): void => {
    if (typeof window === "undefined") return;
    if (accessToken && accessToken !== "undefined" && accessToken !== "null") {
      localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    }
    if (refreshToken && refreshToken !== "undefined" && refreshToken !== "null") {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
  },

  clearTokens: (): void => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
};
