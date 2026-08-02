import { apiRequest, unwrapApiEnvelope, type ApiEnvelope } from "@/lib/api";
import type { Payment } from "@/types";

export async function createPayment(payload: Record<string, unknown>) {
  const response = await apiRequest<ApiEnvelope<{ clientSecret?: string; paymentId?: string; _id?: string; status?: string; url?: string; checkoutUrl?: string; paymentUrl?: string; redirectUrl?: string; sessionUrl?: string }> | { clientSecret?: string; paymentId?: string; _id?: string; status?: string; url?: string; checkoutUrl?: string; paymentUrl?: string; redirectUrl?: string; sessionUrl?: string }>(
    "/api/payments/create",
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
  return unwrapApiEnvelope(response);
}

export async function getPaymentById(id: string) {
  const response = await apiRequest<ApiEnvelope<Payment> | Payment>(`/api/payments/${id}`, { method: "GET" });
  return unwrapApiEnvelope(response);
}

export async function confirmPayment(payload: Record<string, unknown>) {
  const response = await apiRequest<ApiEnvelope<Payment> | Payment>("/api/payments/confirm", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return unwrapApiEnvelope(response);
}
