import { apiRequest } from "@/lib/api";
import type { Gear, Rental } from "@/types";

export async function getProviderGear(token: string) {
  return apiRequest<Gear[]>("/api/provider/gear", { method: "GET" }, token);
}

export async function getProviderOrders(token: string) {
  return apiRequest<Rental[]>("/api/provider/orders", { method: "GET" }, token);
}

export async function updateProviderOrder(id: string, status: string, token: string) {
  return apiRequest<Rental>(`/api/provider/orders/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  }, token);
}
