import { apiRequest, unwrapApiEnvelope, type ApiEnvelope } from "@/lib/api";
import type { Gear, Rental } from "@/types";

export async function getProviderGear() {
  const response = await apiRequest<ApiEnvelope<Gear[]> | Gear[]>('/api/provider/gear', { method: 'GET' });
  return unwrapApiEnvelope(response);
}

export async function getProviderOrders() {
  const response = await apiRequest<ApiEnvelope<Rental[]> | Rental[]>('/api/provider/orders', { method: 'GET' });
  return unwrapApiEnvelope(response);
}

export async function updateProviderOrder(id: string, status: string) {
  const response = await apiRequest<ApiEnvelope<Rental> | Rental>(`/api/provider/orders/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
  return unwrapApiEnvelope(response);
}
