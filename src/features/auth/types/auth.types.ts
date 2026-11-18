import type { JwtClaims, JwtRole } from "@/lib/tokens";

export type UserRole = JwtRole;
export type { JwtClaims };

export interface AuthUser {
  id: string;
  username: string;
  full_name: string;
  phone_number: string;
  full_address: string;
  job: string;
  work_page: string | null;
  income: string | null;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface RegisterPayload {
  username: string;
  password: string;
  full_name: string;
  phone_number: string;
  full_address: string;
  job: string;
  work_page?: string | null;
  income?: string | number | null;
}

export interface RegisterResponse {
  user: AuthUser;
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface TokenPairResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface HealthResponse {
  status: string;
}
