import { apiRequest } from "@/lib/api";
import type { Payment } from "@/types";

export async function createPayment(payload: Record<string, unknown>, token: string) {
  return apiRequest<{ clientSecret?: string; paymentId?: string; _id?: string; status?: string }>(
    "/api/payments/create",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
    token
  );
}

export async function confirmPayment(payload: Record<string, unknown>, token: string) {
  return apiRequest<Payment>("/api/payments/confirm", {
    method: "POST",
    body: JSON.stringify(payload),
  }, token);
}
