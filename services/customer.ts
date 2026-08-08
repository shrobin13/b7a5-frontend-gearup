import type { Payment, Rental } from "@/types";

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

export async function getMyRentals() {
  const response = await fetch("/api/rentals", {
    method: "GET",
    cache: "no-store",
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(data?.message ?? "Failed to fetch rentals");
  }

  return unwrapApiEnvelope<Rental[]>(data);
}

export async function getRentalById(id: string) {
  const response = await fetch(`/api/rentals/${id}`, {
    method: "GET",
    cache: "no-store",
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(data?.message ?? "Failed to fetch rental");
  }

  return unwrapApiEnvelope<Rental>(data);
}

export async function createRental(payload: Record<string, unknown>) {
  const response = await fetch("/api/rentals", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(data?.message ?? "Failed to create rental");
  }

  return unwrapApiEnvelope<Rental>(data);
}

export async function cancelRental(id: string) {
  const response = await fetch(`/api/rentals/${id}/cancel`, {
    method: "PATCH",
    cache: "no-store",
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(data?.message ?? "Failed to cancel rental");
  }

  return unwrapApiEnvelope<Rental>(data);
}

export async function getMyPayments() {
  const response = await fetch("/api/payments", {
    method: "GET",
    cache: "no-store",
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(data?.message ?? "Failed to fetch payments");
  }

  return unwrapApiEnvelope<Payment[]>(data);
}