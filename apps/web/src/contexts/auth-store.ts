import { create } from "zustand";
import { getTokens, setTokens, clearTokens } from "../lib/auth-helpers";

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  setAuth: (tokens: { accessToken: string; refreshToken: string }) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: getTokens().accessToken,
  refreshToken: getTokens().refreshToken,
  isAuthenticated: Boolean(getTokens().accessToken),
  setAuth: ({ accessToken, refreshToken }) => {
    setTokens({ accessToken, refreshToken });
    set({ accessToken, refreshToken, isAuthenticated: true });
  },
  clearAuth: () => {
    clearTokens();
    set({ accessToken: null, refreshToken: null, isAuthenticated: false });
  },
}));
