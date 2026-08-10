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
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(data?.message ?? "Login failed");
  }

  return data as AuthResponse;
}

export async function register(payload: AuthRegisterPayload) {
  const response = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(data?.message ?? "Registration failed");
  }

  return data as AuthResponse;
}

export async function getCurrentUser() {
  const response = await fetch("/api/auth/me", {
    method: "GET",
    cache: "no-store",
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(data?.message ?? "Failed to fetch current user");
  }

  const payload = data as AuthResponse;
  const user =
    payload?.user ??
    payload?.data?.user ??
    (payload?.data as AppUser | undefined) ??
    (data as AppUser);
  return user;
}

export async function logout() {
  const response = await fetch("/api/auth/logout", {
    method: "POST",
    cache: "no-store",
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(data?.message ?? "Logout failed");
  }

  return data as { message?: string };
}