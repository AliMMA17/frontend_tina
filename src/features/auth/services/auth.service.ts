import { apiClient, parseApiError } from "@/lib/api-client";
import { env } from "@/lib/env";
import { tokenStorage } from "@/lib/tokens";
import type {
  AuthTokensResponse,
  AuthUser,
  LoginPayload,
} from "../types/auth.types";

/**
 * Authenticates a user and persists received tokens.
 */
export async function login(payload: LoginPayload): Promise<AuthTokensResponse> {
  const response = await apiClient(env.authLoginPath, {
    method: "POST",
    skipAuth: true,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw await parseApiError(response, "Invalid credentials. Please try again.");
  }

  const data: AuthTokensResponse = await response.json();
  if (data.access_token) {
    tokenStorage.setTokens(data.access_token, data.refresh_token);
  }

  return data;
}

/**
 * Fetches the currently authenticated user profile.
 */
export async function getCurrentUser(): Promise<AuthUser> {
  const response = await apiClient(env.authMePath, {
    method: "GET",
  });

  if (!response.ok) {
    throw await parseApiError(response, "Unable to verify current session.");
  }

  return response.json();
}

/**
 * Clears stored authentication tokens.
 */
export function logout(): void {
  tokenStorage.clearTokens();
}
