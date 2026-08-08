export const API_BASE_URL = process.env.BACKEND_API_URL ?? "";


export type ApiResponse<T> = T;
export type ApiEnvelope<T> = {
  statusCode?: number;
  success?: boolean;
  message?: string;
  data: T;
};

export function unwrapApiEnvelope<T>(payload: ApiEnvelope<T> | T): T {
  if (payload && typeof payload === "object" && "data" in payload) {
    const candidate = payload as ApiEnvelope<T>;
    if (candidate && Object.prototype.hasOwnProperty.call(candidate, "data")) {
      return candidate.data;
    }
  }

  return payload as T;
}

function parseJsonBody<T>(text: string): T | null {
  if (!text) return null;

  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

function getErrorMessageFromPayload(payload: unknown): string {
  const candidate = payload as {
    message?: string;
    error?: string;
    errors?: unknown;
    details?: unknown;
  } | null;

  if (!candidate) {
    return "Request failed";
  }

  const formatFieldPath = (path: unknown): string | null => {
    if (typeof path === "string" && path.trim()) {
      return path.trim();
    }

    if (Array.isArray(path)) {
      const parts = path.filter((segment): segment is string => typeof segment === "string" && segment.trim().length > 0);
      if (!parts.length) {
        return null;
      }

      if (parts[0] === "body" && parts.length > 1) {
        return parts.slice(1).join(".");
      }

      return parts.join(".");
    }

    return null;
  };

  const formatErrorObject = (entry: Record<string, unknown>): string | null => {
    const rawMessage =
      typeof entry.message === "string"
        ? entry.message
        : typeof entry.msg === "string"
          ? entry.msg
          : typeof entry.error === "string"
            ? entry.error
            : null;

    if (!rawMessage || !rawMessage.trim()) {
      return null;
    }

    const field =
      formatFieldPath(entry.path) ??
      formatFieldPath(entry.param) ??
      formatFieldPath(entry.field);

    if (field) {
      return `${field}: ${rawMessage.trim()}`;
    }

    return rawMessage.trim();
  };

  if (Array.isArray(candidate.errors)) {
    const entries = candidate.errors
      .map((entry) => {
        if (typeof entry === "string" && entry.trim()) {
          return entry.trim();
        }

        if (entry && typeof entry === "object") {
          return formatErrorObject(entry as Record<string, unknown>);
        }

        return null;
      })
      .filter((entry): entry is string => Boolean(entry));

    if (entries.length) {
      return entries.join("; ");
    }
  }

  if (candidate.errors && typeof candidate.errors === "object") {
    const objectErrors = candidate.errors as Record<string, unknown>;
    const entries = Object.entries(objectErrors)
      .map(([key, value]) => {
        if (typeof value === "string" && value.trim()) {
          return `${key}: ${value.trim()}`;
        }

        if (Array.isArray(value)) {
          const nested = value
            .map((entry) => {
              if (typeof entry === "string" && entry.trim()) {
                return entry.trim();
              }

              if (entry && typeof entry === "object") {
                return formatErrorObject(entry as Record<string, unknown>);
              }

              return null;
            })
            .filter((entry): entry is string => Boolean(entry));

          if (nested.length) {
            return `${key}: ${nested.join(", ")}`;
          }
        }

        if (value && typeof value === "object") {
          const nested = formatErrorObject(value as Record<string, unknown>);
          if (nested) {
            return nested;
          }
        }

        return null;
      })
      .filter((entry): entry is string => Boolean(entry));

    if (entries.length) {
      return entries.join("; ");
    }
  }

  if (typeof candidate.message === "string" && candidate.message.trim()) {
    return candidate.message;
  }

  if (typeof candidate.error === "string" && candidate.error.trim()) {
    return candidate.error;
  }

  if (typeof candidate.errors === "string" && candidate.errors.trim()) {
    return candidate.errors;
  }

  if (typeof candidate.details === "string" && candidate.details.trim()) {
    return candidate.details;
  }

  return "Request failed";
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  token?: string | null,
): Promise<T> {
  console.log("APIREQUEST_V2_ACTIVE →", endpoint);

  const headers = new Headers(options.headers || {});

  if (!(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const isAbsoluteUrl = /^https?:\/\//i.test(endpoint);
  const isInternalApiRoute = endpoint.startsWith("/api/");
  const resolvedEndpoint =
    isAbsoluteUrl || !isInternalApiRoute ? endpoint : endpoint;

  const response = await fetch(
    isInternalApiRoute ? resolvedEndpoint : `${API_BASE_URL}${endpoint}`,
    {
      ...options,
      headers,
      cache: "no-store",
    },
  );

  const text = await response.text();
  const payload = parseJsonBody<T>(text);

  if (!response.ok) {
    throw new Error(getErrorMessageFromPayload(payload));
  }

  return payload as T;
}
