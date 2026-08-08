import type { Gear } from "@/types";

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

export type Category = {
  id?: string;
  name?: string;
  description?: string;
};

export async function getAllCategories() {
  const response = await fetch("/api/categories", {
    method: "GET",
    cache: "no-store",
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(data?.message ?? "Failed to fetch categories");
  }

  return unwrapApiEnvelope<Category[]>(data);
}

export async function getAllGear() {
  const response = await fetch("/api/gear", {
    method: "GET",
    cache: "no-store",
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(data?.message ?? "Failed to fetch gear");
  }

  return unwrapApiEnvelope<Gear[]>(data);
}

export async function getGearById(id: string) {
  const response = await fetch(`/api/gear/${id}`, {
    method: "GET",
    cache: "no-store",
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(data?.message ?? "Failed to fetch gear");
  }

  return unwrapApiEnvelope<Gear>(data);
}

export async function createGear(payload: Partial<Gear>) {
  const response = await fetch("/api/provider/gear", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(data?.message ?? "Failed to create gear");
  }

  return unwrapApiEnvelope<Gear>(data);
}

export async function updateGear(id: string, payload: Partial<Gear>) {
  const response = await fetch(`/api/provider/gear/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(data?.message ?? "Failed to update gear");
  }

  return unwrapApiEnvelope<Gear>(data);
}

export async function deleteGear(id: string) {
  const response = await fetch(`/api/provider/gear/${id}`, {
    method: "DELETE",
    cache: "no-store",
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(data?.message ?? "Failed to delete gear");
  }

  return unwrapApiEnvelope<{ message?: string }>(data);
}