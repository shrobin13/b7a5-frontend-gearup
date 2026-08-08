# Debugging Analysis: Auth 500s After Render Deployment

## 1. Architecture (as actually implemented)

```
Browser ──> POST /api/auth/login ──> Next.js route handler (app/api/auth/login/route.ts)
                                        │  server-to-server fetch (no cookies, no CORS)
                                        ▼
                                   Express backend /api/auth/login (gearup-igqw.onrender.com)
```

Key facts discovered in code:

- `app/api/auth/register/route.ts` and `app/api/auth/login/route.ts` do **NOT** use
  `proxyToBackend()`. They are dedicated handlers that call `backendFetch(...)` /
  `fetchBackend(...)` (defined in `lib/api.ts`) directly. They set session cookies on the
  **frontend** domain via `setSessionCookies()` (from `lib/auth-server.ts`).
- `proxyToBackend()` is used for authenticated endpoints (e.g. `/me`) and correctly
  returns `401` with no access-token cookie.
- The generic `/api/backend/[...path]` rewrite in `next.config.ts` forwards to the same
  backend base URL.

## 2. Live diagnostic evidence (curl against deployed services)

| Probe | Result |
|---|---|
| `GET https://gearup-igqw.onrender.com/` | `200` — backend healthy |
| `POST .../api/auth/login` bad creds (backend direct) | `401` JSON "Invalid email or password" |
| `POST .../api/auth/register` invalid (backend direct) | `400` JSON validation errors |
| `GET https://b7a5-frontend-gearup-1.onrender.com/api/auth/me` | `401` (expected; matches current code) |
| `GET .../api/categories` (rewrite → backend) | `200` — build-time rewrite target is correct |
| `OPTIONS .../api/auth/login` | `204` with `allow: OPTIONS, POST` and **Next.js** headers |
| `POST .../api/auth/login` bad creds (frontend) | `500` empty body (a fresh first request hung >60 s) |
| `POST .../api/auth/register` invalid (frontend) | `500` empty body |

## 3. Exact root cause

The **500 comes from the frontend route-handler layer, not the backend and not CORS.**

Proof:

1. The backend is healthy and returns proper `401`/`400` responses when called directly.
2. If the current repo's handlers were actually running, invalid login/register would
   simply **forward** the backend's `401`/`400` status — a `500` is impossible with that
   code path unless the server-side `fetch` throws.
3. Server-to-server `fetch` in the route handler is **not** subject to CORS, sameSite, or
   the browser — so the proposed causes #2/#3/#4 (cookie names, SameSite=Lax, CORS
   trailing slash) cannot produce a server-side 500.
4. The first frontend POST hung for over 60 s while the backend responded instantly —
   consistent with the deployed handler attempting a fetch against a dead/stalling
   target before the platform returned `500`.

The most likely concrete triggers (in order):

1. **Backend URL divergence between build time and runtime.** `next.config.ts` embeds
   `process.env.NEXT_PUBLIC_API_URL` at **build** time (rewrites worked), while route
   handlers call `getBackendBaseUrl()` at **runtime** (`NEXT_PUBLIC_API_URL` →
   `BACKEND_API_URL` → fallback). If Render provides the variable in the build
   environment but the service's runtime env has it missing/invalid (or with a trailing
   slash/space), the runtime fetch throws → 500. `getBackendBaseUrl()` had **no
   validation or normalization**, so a bad value was passed straight into `new URL()` /
   `fetch`.
2. **Stale deployed bundle.** Live behavior (500 where current code must return 4xx)
   suggests the deployed build predates the current fixed route handlers — the repo's
   commit history shows multiple "login issue" fixes (`d0cce74`, `00421ad`, `86c6925`,
   `b1e7462`). Re-deploying the current HEAD is required.

Contributing real bugs fixed while investigating:

- `proxyToBackend()` re-read `request.text()` on the 401-retry path, silently dropping
  POST bodies on refresh-then-retry.
- Backend cookie names (`accessToken`, `refreshToken`) did not match the frontend's
  `AUTH_COOKIE_NAMES` (`access-token`, `gearup-refresh-token`).
- Backend `setAuthCookies`/refresh used `sameSite: "lax"` in production, which blocks
  cookies if the browser ever calls the backend origin directly (cross-site).
- `CLIENT_URL` is used in exact-match CORS origin checks, so a trailing slash breaks CORS
  for direct browser→backend calls.

## 4. Why it works locally but fails on Render

- Locally `NEXT_PUBLIC_API_URL=http://localhost:5000` is set identically at build and
  runtime; the deployed runtime env differs or is missing → only the client-side route
  handlers (runtime fetch) break, while build-time rewrites keep working.
- CORS/sameSite/cookie-name issues are invisible locally because the browser only talks
  to the Next.js dev server, never directly to Express.

## 5. Minimal changes applied

### a) Frontend `lib/auth-server.ts`

- `getBackendBaseUrl()` now trims trailing slashes and validates the URL, falling back to
  the hard-coded backend URL on any invalid value — so a bad/missing Render env var can
  never produce a 500.
- `proxyToBackend()` gained an options object (`authRequired`, `authCookieName`) so public
  routes can forward without an access token.
- Request body is read exactly once and reused for the 401 refresh-retry.
- Doc comments clarify cookie strategy: frontend cookies stay `sameSite: "lax"`
  (`secure` in prod) because they're set on the frontend origin; only backend cookies need
  `sameSite: "none"`.

### b) Backend `src/modules/auth/auth.controller.ts`

- Cookies renamed to `access-token` / `gearup-refresh-token` (matches frontend).
- Production cookies now use `sameSite: "none"` + `secure: true` (still `lax` locally).

### c) Backend `src/config/env.ts`

- `CLIENT_URL` trailing slash is stripped after parsing so CORS exact-match never breaks.

## 6. Corrected code (full versions)

### lib/auth-server.ts

```ts
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

export const AUTH_COOKIE_NAMES = {
  access: "access-token",
  refresh: "gearup-refresh-token",
  role: "gearup-role",
} as const;

const fallbackBackendBase = "https://gearup-igqw.onrender.com";

/**
 * The backend URL is resolved at RUNTIME here, but at BUILD time in next.config.ts.
 * If Render injects a trailing slash or an invalid value in one place and not the
 * other, server-side fetches from route handlers can throw (→ 500) while rewrite
 * traffic (/api/categories) still works. Normalize + validate so both layers
 * always converge on a usable URL.
 */
function normalizeBackendBaseUrl(value: string) {
  const trimmed = value.trim().replace(/\/+$/, "");
  return /^https?:\/\/[^\s]+$/i.test(trimmed) ? trimmed : fallbackBackendBase;
}

export function getBackendBaseUrl() {
  const resolved =
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.BACKEND_API_URL ||
    fallbackBackendBase;
  return normalizeBackendBaseUrl(resolved);
}

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
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length < 2) return null;
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
  if (!exp) return 60 * 60 * 24;
  const now = Math.floor(Date.now() / 1000);
  return Math.max(1, exp - now);
}

export async function setSessionCookies(
  cookieStore: Awaited<ReturnType<typeof cookies>>,
  accessToken: string,
  refreshToken?: string | null,
  role?: string | null,
) {
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
  if (!payload || typeof payload !== "object") return null;
  const candidate = payload as Record<string, unknown>;
  const nested = candidate.data && typeof candidate.data === "object" ? (candidate.data as Record<string, unknown>) : null;
  return (nested?.[key] as string | undefined) ?? (candidate[key] as string | undefined) ?? null;
}

export function getUserFromPayload(payload: unknown) {
  if (!payload || typeof payload !== "object") return null;
  const candidate = payload as Record<string, unknown>;
  const nested = candidate.data && typeof candidate.data === "object" ? (candidate.data as Record<string, unknown>) : null;
  return (nested?.user as Record<string, unknown> | null) ?? (candidate.user as Record<string, unknown> | null) ?? null;
}

export async function refreshSession(cookieStore: Awaited<ReturnType<typeof cookies>>) {
  const refreshToken = cookieStore.get(AUTH_COOKIE_NAMES.refresh)?.value;
  if (!refreshToken) return null;

  const backendBase = getBackendBaseUrl();
  const response = await fetch(`${backendBase}/api/auth/refresh-token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
    cache: "no-store",
  });

  if (!response.ok) return null;

  const payloadText = await response.text();
  const payload = payloadText ? JSON.parse(payloadText) : null;
  const accessToken = getTokenFromPayload(payload, "accessToken") ?? getTokenFromPayload(payload, "token");
  const nextRefreshToken = getTokenFromPayload(payload, "refreshToken");
  const user = getUserFromPayload(payload);
  const role = (user?.role as string | undefined) ?? null;

  if (!accessToken) return null;

  await setSessionCookies(cookieStore, accessToken, nextRefreshToken ?? refreshToken, role);
  return accessToken;
}

type ProxyToBackendOptions = {
  authCookieName?: string;
  /** Set to false for public endpoints (e.g. register/login). */
  authRequired?: boolean;
};

export async function proxyToBackend(
  request: NextRequest,
  pathSegments: string[],
  options: ProxyToBackendOptions = {},
) {
  const { authCookieName = AUTH_COOKIE_NAMES.access, authRequired = true } = options;

  const cookieStore = await getCookieStore();
  const accessToken = cookieStore.get(authCookieName)?.value;

  if (authRequired && !accessToken) {
    return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 });
  }

  const backendBase = getBackendBaseUrl();
  const originalUrl = new URL(request.url);
  const targetPath = pathSegments.length ? pathSegments.join("/") : "";
  const targetUrl = new URL(`${backendBase}/api/${targetPath}${originalUrl.search}`);

  const requestBody = ["GET", "HEAD"].includes(request.method) ? undefined : await request.text();

  const headers = new Headers(request.headers);
  if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);
  headers.delete("host");

  const init: RequestInit = {
    method: request.method,
    headers,
    body: requestBody,
    cache: "no-store",
  };

  let response = await fetch(targetUrl, init);

  if (response.status === 401 && accessToken) {
    const refreshedToken = await refreshSession(cookieStore);
    if (!refreshedToken) {
      return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 });
    }

    const retryHeaders = new Headers(request.headers);
    retryHeaders.set("Authorization", `Bearer ${refreshedToken}`);
    retryHeaders.delete("host");

    response = await fetch(targetUrl, { ...init, headers: retryHeaders, body: requestBody });
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
```

### backend/src/modules/auth/auth.controller.ts (cookie part)

```ts
const setAuthCookies = (res: Response, accessToken: string, refreshToken?: string) => {
  const isProduction = process.env.NODE_ENV === "production";

  const cookieOptions = {
    httpOnly: true,
    sameSite: (isProduction ? "none" : "lax") as "none" | "lax",
    secure: isProduction,
  };

  res.cookie("access-token", accessToken, { ...cookieOptions, maxAge: 1000 * 60 * 15 });

  if (refreshToken) {
    res.cookie("gearup-refresh-token", refreshToken, {
      ...cookieOptions,
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });
  }
};

// refreshToken handler:
res.cookie("access-token", result.accessToken, {
  httpOnly: true,
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  secure: process.env.NODE_ENV === "production",
  maxAge: 1000 * 60 * 15,
});
```

### backend/src/config/env.ts

```ts
const parsedEnv = envSchema.parse(process.env);

// Normalize CLIENT_URL so a trailing slash can never break CORS exact-match.
export const env = {
  ...parsedEnv,
  CLIENT_URL: parsedEnv.CLIENT_URL.replace(/\/+$/, ""),
};
```

### Recommended Render env settings

Frontend service env:

```
NEXT_PUBLIC_API_URL=https://gearup-igqw.onrender.com
```

(No trailing slash. Set it in the service environment AND rebuild/redeploy so the
build-time rewrite and runtime handlers agree.)

Backend service env:

```
CLIENT_URL=https://b7a5-frontend-gearup-1.onrender.com
```

(No trailing slash — now auto-normalized in code regardless.)

## 7. Deployment checklist

1. Commit these changes and push.
2. Re-deploy BOTH services (the frontend especially — current live bundle appears stale).
3. Verify:
   - `curl https://b7a5-frontend-gearup-1.onrender.com/api/auth/register` with valid
     data returns `200/201` (not 500).
   - `curl .../api/auth/login` with bad creds returns the backend's `401` JSON.
   - Browser register → login → `/api/auth/me` completes end-to-end.
4. If a 500 still occurs after redeploy, check the frontend service logs for the exact
   exception in the route handler — with URL normalization in place, the only remaining
   cause would be a backend reachability/network issue at runtime.