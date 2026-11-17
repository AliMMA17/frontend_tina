// src/lib/tokens.ts

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

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