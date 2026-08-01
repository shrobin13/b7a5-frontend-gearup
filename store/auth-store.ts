import { create } from "zustand";
import type { AppUser } from "@/types";

const STORAGE_KEY = "gearup-auth-state";

type AuthState = {
  token: string | null;
  user: AppUser | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user?: AppUser | null) => void;
  clearAuth: () => void;
  hydrate: () => void;
};

const readInitialState = () => {
  if (typeof window === "undefined") {
    return { token: null, user: null, isAuthenticated: false };
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { token: null, user: null, isAuthenticated: false };
    }

    const saved = JSON.parse(raw) as { token?: string | null; user?: AppUser | null };
    return {
      token: saved.token ?? null,
      user: saved.user ?? null,
      isAuthenticated: Boolean(saved.token),
    };
  } catch {
    return { token: null, user: null, isAuthenticated: false };
  }
};

export const useAuthStore = create<AuthState>((set) => ({
  ...readInitialState(),
  setAuth: (token, user = null) => {
    const nextState = { token, user, isAuthenticated: Boolean(token) };
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
    }
    set(nextState);
  },
  clearAuth: () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
    }
    set({ token: null, user: null, isAuthenticated: false });
  },
  hydrate: () => {
    set(readInitialState());
  },
}));
