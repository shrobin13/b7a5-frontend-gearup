export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "https://gearup-igqw.onrender.com";

export type ApiResponse<T> = T;

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  token?: string | null
): Promise<T> {
  const headers = new Headers(options.headers || {});

  if (!(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
    cache: "no-store",
  });

  const text = await response.text();
  const payload = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(payload?.message || payload?.error || "Request failed");
  }

  return payload as T;
}
