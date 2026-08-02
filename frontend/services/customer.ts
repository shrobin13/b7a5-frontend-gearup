import { apiRequest, unwrapApiEnvelope, type ApiEnvelope } from "@/lib/api";
import type { Payment, Rental } from "@/types";

export async function getMyRentals() {
  const response = await apiRequest<ApiEnvelope<Rental[]> | Rental[]>("/api/rentals", { method: "GET" });
  return unwrapApiEnvelope(response);
}

export async function getRentalById(id: string) {
  const response = await apiRequest<ApiEnvelope<Rental> | Rental>(`/api/rentals/${id}`, { method: "GET" });
  return unwrapApiEnvelope(response);
}

export async function createRental(payload: Record<string, unknown>) {
  const response = await apiRequest<ApiEnvelope<Rental> | Rental>("/api/rentals", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return unwrapApiEnvelope(response);
}

export async function cancelRental(id: string) {
  const response = await apiRequest<ApiEnvelope<Rental> | Rental>(`/api/rentals/${id}/cancel`, { method: "PATCH" });
  return unwrapApiEnvelope(response);
}

export async function getMyPayments() {
  const response = await apiRequest<ApiEnvelope<Payment[]> | Payment[]>("/api/payments", { method: "GET" });
  return unwrapApiEnvelope(response);
}
