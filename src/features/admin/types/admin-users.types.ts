import type { AuthUser } from "@/features/auth/types/auth.types";

export interface PaginatedUsersResponse {
  items: AuthUser[];
  total: number;
  offset: number;
  limit: number;
}

export interface ListUsersParams {
  offset?: number;
  limit?: number;
}
