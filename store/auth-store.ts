import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AppUser } from "@/types";

type AuthState = {
  token: string | null;
  user: AppUser | null;
  role: string | null;
  setAuth: (token: string | null, user?: AppUser | null, role?: string | null) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      role: null,
      setAuth: (token, user = null, role = null) => set({ token, user, role }),
      logout: () => set({ token: null, user: null, role: null }),
    }),
    { name: "gearup-auth" }
  )
);
