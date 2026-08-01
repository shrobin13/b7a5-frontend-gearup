export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export type ApiResponse<T> = T;

function parseJsonBody<T>(text: string): T | null {
  if (!text) return null;

  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

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
  const payload = parseJsonBody<T>(text);

  if (!response.ok) {
    throw new Error(
      (payload as { message?: string; error?: string } | null)?.message ||
        (payload as { message?: string; error?: string } | null)?.error ||
        "Request failed"
    );
  }

  return payload as T;
}
