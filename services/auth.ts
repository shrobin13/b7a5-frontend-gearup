import { apiRequest } from "@/lib/api";
import type { AppUser } from "@/types";

export type AuthLoginPayload = {
  email: string;
  password: string;
};

export type AuthRegisterPayload = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
  address?: string;
};

export type AuthResponse = {
  success?: boolean;
  statusCode?: number;
  message?: string;
  data?: {
    accessToken?: string;
    refreshToken?: string;
    user?: AppUser;
  };
  accessToken?: string;
  refreshToken?: string;
  token?: string;
  user?: AppUser;
};

export async function login(payload: AuthLoginPayload) {
  return apiRequest<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function register(payload: AuthRegisterPayload) {
  return apiRequest<AuthResponse>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getCurrentUser() {
  return apiRequest<AppUser>("/api/auth/me", { method: "GET" });
}

export async function logout() {
  return apiRequest<{ message?: string }> ("/api/auth/logout", { method: "POST" });
}
