import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getBackendBaseUrl, getTokenFromPayload, setSessionCookies } from "@/lib/auth-server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const backendBase = getBackendBaseUrl();

  const loginResponse = await fetch(`${backendBase}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const loginText = await loginResponse.text();
  const loginPayload = loginText ? JSON.parse(loginText) : null;

  if (!loginResponse.ok) {
    return NextResponse.json(loginPayload ?? { success: false, message: "Login failed" }, { status: loginResponse.status });
  }

  const accessToken = getTokenFromPayload(loginPayload, "accessToken") ?? getTokenFromPayload(loginPayload, "token");
  const refreshToken = getTokenFromPayload(loginPayload, "refreshToken");

  if (!accessToken || !refreshToken) {
    return NextResponse.json({ success: false, message: "Invalid login response" }, { status: 500 });
  }

  // The login endpoint only guarantees tokens (see Postman tests) — it may not
  // include the full user object. Fetch it explicitly so we get the real role.
  let user: Record<string, unknown> | null = null;
  try {
    const meResponse = await fetch(`${backendBase}/api/auth/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });
    const meText = await meResponse.text();
    const mePayload = meText ? JSON.parse(meText) : null;
    user = (mePayload?.data as Record<string, unknown>) ?? (mePayload?.user as Record<string, unknown>) ?? mePayload ?? null;
  } catch {
    user = null;
  }

  const role = (user?.role as string | undefined) ?? "CUSTOMER";

  const cookieStore = await cookies();
  await setSessionCookies(cookieStore, accessToken, refreshToken, role);

  return NextResponse.json({
    success: true,
    message: loginPayload?.message ?? "Signed in",
    user,
  });
}