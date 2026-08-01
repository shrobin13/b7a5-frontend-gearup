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
  token?: string;
  accessToken?: string;
  refreshToken?: string;
  user?: AppUser;
  message?: string;
};

export async function login(payload: AuthLoginPayload, token?: string | null) {
  return apiRequest<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  }, token);
}

export async function register(payload: AuthRegisterPayload, token?: string | null) {
  return apiRequest<AuthResponse>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  }, token);
}

export async function getCurrentUser(token: string) {
  return apiRequest<AppUser>("/api/auth/me", { method: "GET" }, token);
}

export async function logout(token?: string | null) {
  return apiRequest<{ message?: string }>("/api/auth/logout", { method: "POST" }, token);
}
