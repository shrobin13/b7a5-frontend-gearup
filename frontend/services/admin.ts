import { apiRequest, unwrapApiEnvelope, type ApiEnvelope } from "@/lib/api";
import type { AppUser, Gear, Rental } from "@/types";

export async function getAdminUsers() {
  const response = await apiRequest<ApiEnvelope<AppUser[]> | AppUser[]>("/api/admin/users", { method: "GET" });
  return unwrapApiEnvelope(response);
}

export async function updateUserRole(id: string, payload: Record<string, unknown>) {
  const response = await apiRequest<ApiEnvelope<AppUser> | AppUser>(`/api/admin/users/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  return unwrapApiEnvelope(response);
}

export async function getAdminGear() {
  const response = await apiRequest<ApiEnvelope<Gear[]> | Gear[]>("/api/admin/gear", { method: "GET" });
  return unwrapApiEnvelope(response);
}

export async function getAdminRentals() {
  const response = await apiRequest<ApiEnvelope<Rental[]> | Rental[]>("/api/admin/rentals", { method: "GET" });
  return unwrapApiEnvelope(response);
}
