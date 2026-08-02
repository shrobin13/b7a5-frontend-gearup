import { create } from "zustand";
import type { AppUser } from "@/types";

type AuthState = {
  user: AppUser | null;
  isAuthenticated: boolean;
  hasHydrated: boolean;
  setAuth: (user?: AppUser | null) => void;
  clearAuth: () => void;
  hydrate: () => Promise<void>;
};

const createEmptyState = () => ({
  user: null,
  isAuthenticated: false,
  hasHydrated: false,
});

export const useAuthStore = create<AuthState>((set) => ({
  ...createEmptyState(),
  setAuth: (user = null) => {
    set({ user, isAuthenticated: Boolean(user), hasHydrated: true });
  },
  clearAuth: () => {
    set({ user: null, isAuthenticated: false, hasHydrated: true });
  },
  hydrate: async () => {
    try {
      const response = await fetch("/api/auth/me", { cache: "no-store" });
      if (!response.ok) {
        set({ user: null, isAuthenticated: false, hasHydrated: true });
        return;
      }

      const payload = await response.json();
      const user = payload?.user ?? payload ?? null;
      set({ user, isAuthenticated: Boolean(user), hasHydrated: true });
    } catch {
      set({ user: null, isAuthenticated: false, hasHydrated: true });
    }
  },
}));
