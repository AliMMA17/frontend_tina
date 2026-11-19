import { apiClient, parseApiError } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/env";
import { tokenStorage } from "@/lib/tokens";
import type {
  ListUsersParams,
  PaginatedUsersResponse,
} from "../types/admin-users.types";

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 200;

/**
 * Fetches paginated users from GET /api/v1/users (Admin only).
 * Automatically relies on apiClient for Bearer injection and 401 token refresh.
 * Does NOT retry on 403 Forbidden.
 */
export async function listAdminUsers({
  offset = 0,
  limit = DEFAULT_LIMIT,
}: ListUsersParams = {}): Promise<PaginatedUsersResponse> {
  const safeOffset = Math.max(0, Math.floor(offset));
  const safeLimit = Math.min(MAX_LIMIT, Math.max(1, Math.floor(limit)));

  const query = new URLSearchParams({
    offset: String(safeOffset),
    limit: String(safeLimit),
  });

  const response = await apiClient(`${API_ENDPOINTS.users}?${query.toString()}`, {
    method: "GET",
  });

  if (!response.ok) {
    if (response.status === 401) {
      tokenStorage.clearTokens();
      if (typeof window !== "undefined" && window.location.pathname !== "/login") {
        window.location.replace("/login");
      }
    }
    throw await parseApiError(response, "خطا در دریافت فهرست کاربران.");
  }

  return response.json();
}
