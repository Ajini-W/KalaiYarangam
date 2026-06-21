import http from "./http";

export interface LoginPayload {
  type: "email" | "phone";
  email?: string;
  phone?: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface AuthUser {
  id: string;
  tenantId: string;
  branchId: string | null;
  email: string;
  name: string;
  role: string;
  emailVerified: boolean;
}

export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
  rememberMe?: boolean;
}

export const authService = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const { data } = await http.post("/auth/login", payload);
    return data.data;
  },

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const { data } = await http.post("/auth/register", payload);
    return data.data;
  },

  async me(): Promise<AuthUser> {
    const { data } = await http.get("/auth/me");
    return data.data;
  },
};
