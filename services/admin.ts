import { apiRequest } from "@/lib/api";
import type { AppUser, Gear } from "@/types";

export async function getAdminUsers(token: string) {
  return apiRequest<AppUser[]>("/api/admin/users", { method: "GET" }, token);
}

export async function updateUserRole(id: string, payload: Record<string, unknown>, token: string) {
  return apiRequest<AppUser>(`/api/admin/users/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  }, token);
}

export async function getAdminGear(token: string) {
  return apiRequest<Gear[]>("/api/admin/gear", { method: "GET" }, token);
}

export async function getAdminRentals(token: string) {
  return apiRequest<any[]>("/api/admin/rentals", { method: "GET" }, token);
}
