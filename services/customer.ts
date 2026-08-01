import { apiRequest } from "@/lib/api";
import type { Payment, Rental } from "@/types";

export async function getMyRentals(token: string) {
  return apiRequest<Rental[]>("/api/rentals", { method: "GET" }, token);
}

export async function createRental(payload: Record<string, unknown>, token: string) {
  return apiRequest<Rental>("/api/rentals", {
    method: "POST",
    body: JSON.stringify(payload),
  }, token);
}

export async function cancelRental(id: string, token: string) {
  return apiRequest<Rental>(`/api/rentals/${id}/cancel`, { method: "PATCH" }, token);
}

export async function getMyPayments(token: string) {
  return apiRequest<Payment[]>("/api/payments", { method: "GET" }, token);
}
