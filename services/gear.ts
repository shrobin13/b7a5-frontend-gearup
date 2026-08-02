import { apiRequest, unwrapApiEnvelope, type ApiEnvelope } from "@/lib/api";
import type { Gear } from "@/types";

export async function getAllGear() {
  const response = await apiRequest<ApiEnvelope<Gear[]> | Gear[]>("/api/gear", { method: "GET" });
  return unwrapApiEnvelope(response);
}

export async function getGearById(id: string) {
  const response = await apiRequest<ApiEnvelope<Gear> | Gear>(`/api/gear/${id}`, { method: "GET" });
  return unwrapApiEnvelope(response);
}

export async function createGear(payload: Partial<Gear>) {
  const response = await apiRequest<ApiEnvelope<Gear> | Gear>("/api/provider/gear", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return unwrapApiEnvelope(response);
}

export async function updateGear(id: string, payload: Partial<Gear>) {
  const response = await apiRequest<ApiEnvelope<Gear> | Gear>(`/api/provider/gear/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  return unwrapApiEnvelope(response);
}

export async function deleteGear(id: string) {
  const response = await apiRequest<ApiEnvelope<{ message?: string }> | { message?: string }>(`/api/provider/gear/${id}`, { method: "DELETE" });
  return unwrapApiEnvelope(response);
}
