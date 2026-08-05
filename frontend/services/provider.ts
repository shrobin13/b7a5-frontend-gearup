import type { Gear, Rental } from "@/types";

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

export async function getProviderGear() {
  const response = await fetch("/api/provider/gear", {
    method: "GET",
    cache: "no-store",
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(data?.message ?? "Failed to fetch provider gear");
  }

  return unwrapApiEnvelope<Gear[]>(data);
}

export async function getProviderGearById(id: string) {
  const response = await fetch(`/api/provider/gear/${id}`, {
    method: "GET",
    cache: "no-store",
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(data?.message ?? "Failed to fetch provider gear");
  }

  return unwrapApiEnvelope<Gear>(data);
}

export async function getProviderOrders() {
  const response = await fetch("/api/provider/orders", {
    method: "GET",
    cache: "no-store",
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(data?.message ?? "Failed to fetch provider orders");
  }

  return unwrapApiEnvelope<Rental[]>(data);
}

export async function updateProviderOrder(id: string, status: string) {
  const response = await fetch(`/api/provider/orders/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
    cache: "no-store",
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(data?.message ?? "Failed to update provider order");
  }

  return unwrapApiEnvelope<Rental>(data);
}