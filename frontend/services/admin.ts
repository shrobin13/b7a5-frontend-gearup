import type { AppUser, Gear, Rental } from "@/types";

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

export async function getAdminUsers() {
  const response = await fetch("/api/admin/users", {
    method: "GET",
    cache: "no-store",
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(data?.message ?? "Failed to fetch users");
  }

  return unwrapApiEnvelope<AppUser[]>(data);
}

export async function updateUserRole(id: string, payload: Record<string, unknown>) {
  const response = await fetch(`/api/admin/users/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(data?.message ?? "Failed to update user");
  }

  return unwrapApiEnvelope<AppUser>(data);
}

export async function getAdminGear() {
  const response = await fetch("/api/admin/gear", {
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

export async function getAdminRentals() {
  const response = await fetch("/api/admin/rentals", {
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

export async function deleteAdminGear(id: string) {
  const response = await fetch(`/api/gear/${id}`, {
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

export async function cancelAdminRental(id: string) {
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
