import { create } from "zustand";
import type {
  AuthUser,
  LoginPayload,
  RegisterPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  ChangePasswordPayload,
} from "@/services/auth.service";
import { authService } from "@/services/auth.service";
import { setTokenCookie, removeTokenCookie } from "@/lib/token-cookie";

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isFirstLogin: boolean;

  login: (payload: LoginPayload) => Promise<{ isFirstLogin?: boolean }>;
  register: (payload: RegisterPayload) => Promise<{ isFirstLogin?: boolean }>;
  logout: () => void;
  setUser: (user: AuthUser) => void;
  initialize: () => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  sendVerificationToken: (email: string) => Promise<void>;
  forgotPassword: (payload: ForgotPasswordPayload) => Promise<void>;
  resetPassword: (payload: ResetPasswordPayload) => Promise<void>;
  changePassword: (payload: ChangePasswordPayload) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  isFirstLogin: false,

  login: async (payload) => {
    set({ isLoading: true });
    try {
      const res = await authService.login(payload);
      localStorage.setItem("accessToken", res.accessToken);
      setTokenCookie(res.accessToken);
      if (res.refreshToken) {
        localStorage.setItem("refreshToken", res.refreshToken);
      }
      const isFirstLogin = res.isFirstLogin ?? false;
      set({
        user: res.user,
        accessToken: res.accessToken,
        refreshToken: res.refreshToken,
        isAuthenticated: true,
        isFirstLogin,
        isLoading: false,
      });
      return { isFirstLogin };
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  register: async (payload) => {
    set({ isLoading: true });
    try {
      const res = await authService.register(payload);
      localStorage.setItem("accessToken", res.accessToken);
      setTokenCookie(res.accessToken);
      if (res.refreshToken) {
        localStorage.setItem("refreshToken", res.refreshToken);
      }
      set({
        user: res.user,
        accessToken: res.accessToken,
        refreshToken: res.refreshToken,
        isAuthenticated: true,
        isFirstLogin: true,
        isLoading: false,
      });
      return { isFirstLogin: true };
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    removeTokenCookie();
    set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false, isFirstLogin: false });
  },

  setUser: (user) => set({ user }),

  initialize: async () => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) return;
    setTokenCookie(accessToken);
    set({ isLoading: true });
    try {
      const user = await authService.me();
      set({
        user,
        accessToken,
        refreshToken: localStorage.getItem("refreshToken"),
        isAuthenticated: true,
        isLoading: false,
      });
    } catch {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      removeTokenCookie();
      set({ isLoading: false });
    }
  },

  verifyEmail: async (token) => {
    set({ isLoading: true });
    try {
      await authService.verifyEmail(token);
      set({ isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  sendVerificationToken: async (email) => {
    set({ isLoading: true });
    try {
      await authService.sendVerificationToken(email);
      set({ isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  forgotPassword: async (payload) => {
    set({ isLoading: true });
    try {
      await authService.forgotPassword(payload);
      set({ isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  resetPassword: async (payload) => {
    set({ isLoading: true });
    try {
      await authService.resetPassword(payload);
      set({ isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  changePassword: async (payload) => {
    set({ isLoading: true });
    try {
      await authService.changePassword(payload);
      set({ isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
}));
