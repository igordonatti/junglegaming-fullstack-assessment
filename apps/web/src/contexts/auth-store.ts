import { create } from "zustand";
import { getTokens, setTokens, clearTokens } from "../lib/auth-helpers";

type AuthState = {
  access_token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  setAuth: (tokens: { access_token: string; refreshToken: string }) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  access_token: getTokens().access_token,
  refreshToken: getTokens().refreshToken,
  isAuthenticated: Boolean(getTokens().access_token),
  setAuth: ({ access_token, refreshToken }) => {
    setTokens({ access_token, refreshToken });
    set({ access_token, refreshToken, isAuthenticated: true });
  },
  clearAuth: () => {
    clearTokens();
    set({ access_token: null, refreshToken: null, isAuthenticated: false });
  },
}));
