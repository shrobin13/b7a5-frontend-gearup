import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

export const AUTH_COOKIE_NAMES = {
  access: "access-token",
  refresh: "gearup-refresh-token",
  role: "gearup-role",
} as const;

const fallbackBackendBase = "https://gearup-igqw.onrender.com";

export function getBackendBaseUrl() {
  return process.env.NEXT_PUBLIC_API_URL ?? process.env.BACKEND_API_URL ?? fallbackBackendBase;
}
console.log(process.env.BACKEND_API_URL);

function getCookieFlags(maxAge: number, httpOnly = true) {
  const secure = process.env.NODE_ENV === "production";
  return {
    httpOnly,
    secure,
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
}

export async function getCookieStore() {
  return cookies();
}

function decodeJwtExpiration(token: string | null | undefined) {
  if (!token) {
    return null;
  }

  const parts = token.split(".");
  if (parts.length < 2) {
    return null;
  }

  try {
    const payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const normalized = payload.padEnd(Math.ceil(payload.length / 4) * 4, "=");
    const decoded = Buffer.from(normalized, "base64").toString("utf8");
    const parsed = JSON.parse(decoded) as { exp?: number };
    return typeof parsed.exp === "number" ? parsed.exp : null;
  } catch {
    return null;
  }
}

export function getTokenMaxAge(token: string | null | undefined) {
  const exp = decodeJwtExpiration(token);
  if (!exp) {
    return 60 * 60 * 24;
  }

  const now = Math.floor(Date.now() / 1000);
  return Math.max(1, exp - now);
}

export async function setSessionCookies(cookieStore: Awaited<ReturnType<typeof cookies>>, accessToken: string, refreshToken?: string | null, role?: string | null) {
  const accessMaxAge = getTokenMaxAge(accessToken);
  const refreshMaxAge = refreshToken ? getTokenMaxAge(refreshToken) : accessMaxAge * 2;
  const roleValue = role?.trim() || "CUSTOMER";

  cookieStore.set(AUTH_COOKIE_NAMES.access, accessToken, getCookieFlags(accessMaxAge, true));
  if (refreshToken) {
    cookieStore.set(AUTH_COOKIE_NAMES.refresh, refreshToken, getCookieFlags(refreshMaxAge, true));
  }
  cookieStore.set(AUTH_COOKIE_NAMES.role, roleValue, getCookieFlags(Math.max(60 * 60 * 24 * 7, accessMaxAge), false));
}

export async function clearSessionCookies(cookieStore: Awaited<ReturnType<typeof cookies>>) {
  const isProduction = process.env.NODE_ENV === "production";

  // Explicitly expire each cookie with matching attributes so browsers honour the deletion
  for (const name of [AUTH_COOKIE_NAMES.access, AUTH_COOKIE_NAMES.refresh]) {
    cookieStore.set(name, "", {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
      maxAge: 0,
      expires: new Date(0),
    });
  }

  cookieStore.set(AUTH_COOKIE_NAMES.role, "", {
    httpOnly: false,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });
}

export function getTokenFromPayload(payload: unknown, key: "accessToken" | "refreshToken" | "token") {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const candidate = payload as Record<string, unknown>;
  const nested = candidate.data && typeof candidate.data === "object" ? (candidate.data as Record<string, unknown>) : null;

  return (nested?.[key] as string | undefined) ?? (candidate[key] as string | undefined) ?? null;
}

export function getUserFromPayload(payload: unknown) {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const candidate = payload as Record<string, unknown>;
  const nested = candidate.data && typeof candidate.data === "object" ? (candidate.data as Record<string, unknown>) : null;
  return (nested?.user as Record<string, unknown> | null) ?? (candidate.user as Record<string, unknown> | null) ?? null;
}

export async function refreshSession(cookieStore: Awaited<ReturnType<typeof cookies>>) {
  const refreshToken = cookieStore.get(AUTH_COOKIE_NAMES.refresh)?.value;
  if (!refreshToken) {
    return null;
  }

  const backendBase = getBackendBaseUrl();
  const response = await fetch(`${backendBase}/api/auth/refresh-token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  const payloadText = await response.text();
  const payload = payloadText ? JSON.parse(payloadText) : null;
  const accessToken = getTokenFromPayload(payload, "accessToken") ?? getTokenFromPayload(payload, "token");
  const nextRefreshToken = getTokenFromPayload(payload, "refreshToken");
  const user = getUserFromPayload(payload);
  const role = (user?.role as string | undefined) ?? null;

  if (!accessToken) {
    return null;
  }

  await setSessionCookies(cookieStore, accessToken, nextRefreshToken ?? refreshToken, role);
  return accessToken;
}

export async function proxyToBackend(request: NextRequest, pathSegments: string[], authCookieName = AUTH_COOKIE_NAMES.access) {
  const cookieStore = await getCookieStore();
  const accessToken = cookieStore.get(authCookieName)?.value;

  if (!accessToken) {
    return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 });
  }

  const backendBase = getBackendBaseUrl();
  const originalUrl = new URL(request.url);
  const targetPath = pathSegments.length ? pathSegments.join("/") : "";
  const targetUrl = new URL(`${backendBase}/api/${targetPath}${originalUrl.search}`);

  const headers = new Headers(request.headers);
  headers.set("Authorization", `Bearer ${accessToken}`);
  headers.delete("host");

  const body = ["GET", "HEAD"].includes(request.method) ? undefined : await request.text();
  const init: RequestInit = {
    method: request.method,
    headers,
    body,
    cache: "no-store",
  };

  let response = await fetch(targetUrl, init);

  if (response.status === 401) {
    const refreshedToken = await refreshSession(cookieStore);
    if (!refreshedToken) {
      return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 });
    }

    const retryHeaders = new Headers(request.headers);
    retryHeaders.set("Authorization", `Bearer ${refreshedToken}`);
    retryHeaders.delete("host");

    const retryBody = ["GET", "HEAD"].includes(request.method) ? undefined : await request.text();
    response = await fetch(targetUrl, {
      ...init,
      headers: retryHeaders,
      body: retryBody,
    });
  }

  const responseText = await response.text();
  const contentType = response.headers.get("content-type") ?? "application/json";

  if (contentType.includes("application/json") && responseText) {
    try {
      const payload = JSON.parse(responseText);
      return NextResponse.json(payload, { status: response.status });
    } catch {
      return new NextResponse(responseText, { status: response.status, headers: { "content-type": contentType } });
    }
  }

  return new NextResponse(responseText, { status: response.status, headers: { "content-type": contentType } });
}
