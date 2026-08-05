import type { Payment } from "@/types";

type ApiEnvelope<T> = {
  statusCode?: number;
  success?: boolean;
  message?: string;
  data: T;
};

function unwrapApiEnvelope<T>(payload: ApiEnvelope<T> | T): T {
  if (payload && typeof payload === "object" && "data" in payload) {
    const candidate = payload as ApiEnvelope<T>;
    if (candidate && Object.prototype.hasOwnProperty.call(candidate, "data")) {
      return candidate.data;
    }
  }

  return payload as T;
}

type CreatePaymentResult = {
  clientSecret?: string;
  paymentId?: string;
  _id?: string;
  status?: string;
  url?: string;
  checkoutUrl?: string;
  paymentUrl?: string;
  redirectUrl?: string;
  sessionUrl?: string;
};

export async function createPayment(payload: Record<string, unknown>) {
  const response = await fetch("/api/payments/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(data?.message ?? "Failed to create payment");
  }

  return unwrapApiEnvelope<CreatePaymentResult>(data);
}

export async function getPaymentById(id: string) {
  const response = await fetch(`/api/payments/${id}`, {
    method: "GET",
    cache: "no-store",
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(data?.message ?? "Failed to fetch payment");
  }

  return unwrapApiEnvelope<Payment>(data);
}

export async function confirmPayment(payload: Record<string, unknown>) {
  const response = await fetch("/api/payments/confirm", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(data?.message ?? "Failed to confirm payment");
  }

  return unwrapApiEnvelope<Payment>(data);
}