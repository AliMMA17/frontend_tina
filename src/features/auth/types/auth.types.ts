export interface AuthUser {
  id: string;
  email: string;
  name?: string | null;
  roles?: string[];
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthTokensResponse {
  access_token: string;
  refresh_token?: string;
  token_type?: string;
  user?: AuthUser;
}
