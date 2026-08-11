import type { AppUser, Category, Gear, Rental } from "@/types";

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
  const response = await fetch(`/api/admin/gear/${id}`, {
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
  const response = await fetch(`/api/admin/rentals/${id}/cancel`, {
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

/**
 * The backend error envelope is `{ success, message, errors? }`. Validation
 * failures put the human-readable text in `errors[].message`, so surface that
 * first and fall back to `message`/`error`/a default.
 */
function extractErrorMessage(data: unknown, fallback: string): string {
  if (data && typeof data === "object") {
    const record = data as Record<string, unknown>;
    const errors = record.errors;

    if (Array.isArray(errors) && errors.length > 0) {
      const first = errors[0] as Record<string, unknown> | undefined;
      if (first && typeof first.message === "string") {
        return first.message;
      }
    }

    if (typeof record.message === "string" && record.message.trim()) {
      return record.message;
    }

    if (typeof record.error === "string" && record.error.trim()) {
      return record.error;
    }
  }

  return fallback;
}

export async function getAdminCategories() {
  const response = await fetch("/api/categories", {
    method: "GET",
    cache: "no-store",
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(extractErrorMessage(data, "Failed to fetch categories"));
  }

  return unwrapApiEnvelope<Category[]>(data);
}

export async function createAdminCategory(payload: { name: string; description?: string }) {
  const response = await fetch("/api/categories", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(extractErrorMessage(data, "Failed to create category"));
  }

  return unwrapApiEnvelope<Category>(data);
}

export async function updateAdminCategory(id: string, payload: { name?: string; description?: string }) {
  const response = await fetch(`/api/categories/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(extractErrorMessage(data, "Failed to update category"));
  }

  return unwrapApiEnvelope<Category>(data);
}

export async function deleteAdminCategory(id: string) {
  const response = await fetch(`/api/categories/${id}`, {
    method: "DELETE",
    cache: "no-store",
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(extractErrorMessage(data, "Failed to delete category"));
  }

  return unwrapApiEnvelope<{ message?: string }>(data);
}
