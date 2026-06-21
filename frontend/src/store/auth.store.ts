import { create } from "zustand";
import type { AuthUser, LoginPayload, RegisterPayload } from "@/services/auth.service";
import { authService } from "@/services/auth.service";

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
  setUser: (user: AuthUser) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (payload) => {
    set({ isLoading: true });
    try {
      const res = await authService.login(payload);
      localStorage.setItem("accessToken", res.accessToken);
      if (res.refreshToken) {
        localStorage.setItem("refreshToken", res.refreshToken);
      }
      set({
        user: res.user,
        accessToken: res.accessToken,
        refreshToken: res.refreshToken,
        isAuthenticated: true,
        isLoading: false,
      });
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
      if (res.refreshToken) {
        localStorage.setItem("refreshToken", res.refreshToken);
      }
      set({
        user: res.user,
        accessToken: res.accessToken,
        refreshToken: res.refreshToken,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
  },

  setUser: (user) => set({ user }),
}));
