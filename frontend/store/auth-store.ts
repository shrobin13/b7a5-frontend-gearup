import { create } from "zustand";
import { getCurrentUser } from "@/services/auth";
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
      const user = await getCurrentUser();
      set({ user, isAuthenticated: Boolean(user), hasHydrated: true });
    } catch {
      set({ user: null, isAuthenticated: false, hasHydrated: true });
    }
  },
}));
