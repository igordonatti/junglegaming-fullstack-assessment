import { create } from "zustand";
import {
  getTokens,
  setTokens,
  clearTokens,
  getCurrentUserId,
} from "../lib/auth-helpers";
import { disconnectSocket, initSocket } from "@/lib/socket";

type AuthState = {
  access_token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  setAuth: (tokens: { access_token: string; refreshToken: string }) => void;
  clearAuth: () => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  access_token: getTokens().access_token,
  refreshToken: getTokens().refreshToken,
  isAuthenticated: Boolean(getTokens().access_token),
  setAuth: ({ access_token, refreshToken }) => {
    const userId = getCurrentUserId();
    if (userId) {
      initSocket(userId);
    }
    setTokens({ access_token, refreshToken });
    set({ access_token, refreshToken, isAuthenticated: true });
  },
  clearAuth: () => {
    clearTokens();
    set({ access_token: null, refreshToken: null, isAuthenticated: false });
  },
  logout: () => {
    // Desconecta o socket ao fazer logout
    disconnectSocket();
    set({
      access_token: null,
      refreshToken: null,
      isAuthenticated: false,
    });
    // Limpar tokens do localStorage também
    localStorage.removeItem("access_token");
    localStorage.removeItem("refreshToken");
  },
}));
