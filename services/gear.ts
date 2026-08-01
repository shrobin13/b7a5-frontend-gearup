import { apiRequest } from "@/lib/api";
import type { Gear } from "@/types";

export async function getAllGear(token?: string | null) {
  return apiRequest<Gear[]>("/api/gear", { method: "GET" }, token);
}

export async function getGearById(id: string, token?: string | null) {
  return apiRequest<Gear>(`/api/gear/${id}`, { method: "GET" }, token);
}

export async function createGear(payload: Partial<Gear>, token: string) {
  return apiRequest<Gear>("/api/provider/gear", {
    method: "POST",
    body: JSON.stringify(payload),
  }, token);
}

export async function updateGear(id: string, payload: Partial<Gear>, token: string) {
  return apiRequest<Gear>(`/api/provider/gear/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  }, token);
}

export async function deleteGear(id: string, token: string) {
  return apiRequest<{ message?: string }>(`/api/provider/gear/${id}`, { method: "DELETE" }, token);
}
