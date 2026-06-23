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
  isFirstLogin?: boolean;
}

export interface VerifyEmailResponse {
  emailVerified: boolean;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  password: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface UserProfileData {
  id: string;
  tenantId: string | null;
  email: string;
  name: string;
  phone: string | null;
  role: string;
  status: string;
  avatarUrl: string | null;
  lastLoginAt: string | null;
  createdAt: string;
  profile: {
    dateOfBirth: string | null;
    gender: string | null;
    addressLine1: string | null;
    addressLine2: string | null;
    city: string | null;
    state: string | null;
    pincode: string | null;
    emergencyName: string | null;
    emergencyPhone: string | null;
    bio: string | null;
  } | null;
}

export interface UpdateProfilePayload {
  name?: string;
  phone?: string;
  avatarUrl?: string;
  dateOfBirth?: string;
  gender?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  pincode?: string;
  emergencyName?: string;
  emergencyPhone?: string;
  bio?: string;
}

export interface AuthErrorLogPayload {
  errorCode: string;
  errorMessage: string;
  provider?: string;
  userId?: string;
  metadata?: Record<string, unknown>;
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

  async verifyEmail(token: string): Promise<VerifyEmailResponse> {
    const { data } = await http.post("/auth/verify-email", { token });
    return data.data;
  },

  async sendVerificationToken(email: string): Promise<void> {
    await http.post("/auth/send-verification-token", { email });
  },

  async forgotPassword(payload: ForgotPasswordPayload): Promise<void> {
    await http.post("/auth/forgot-password", payload);
  },

  async resetPassword(payload: ResetPasswordPayload): Promise<void> {
    await http.post("/auth/reset-password", payload);
  },

  async changePassword(payload: ChangePasswordPayload): Promise<void> {
    await http.post("/auth/change-password", payload);
  },

  async getProfile(): Promise<UserProfileData> {
    const { data } = await http.get("/auth/profile");
    return data.data;
  },

  async updateProfile(payload: UpdateProfilePayload): Promise<UserProfileData> {
    const { data } = await http.put("/auth/profile", payload);
    return data.data;
  },

  async logout(refreshToken: string): Promise<void> {
    await http.post("/auth/logout", { refreshToken });
  },

  async logAuthError(payload: AuthErrorLogPayload): Promise<void> {
    await http.post("/auth/error-log", payload);
  },
};

export function getOnboardingRedirect(role: string, status: string): string | null {
  if (status === "NEW_USER" || status === "REGISTERED" || status === "PROFILE_COMPLETED") {
    return "/onboarding";
  }
  if (status === "ACCESS_REQUESTED" || status === "PENDING_APPROVAL") {
    return "/dashboard";
  }
  return null;
}
