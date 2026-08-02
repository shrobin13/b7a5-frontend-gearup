import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_COOKIE_NAMES, getBackendBaseUrl, getTokenFromPayload, getUserFromPayload, setSessionCookies } from "@/lib/auth-server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const backendBase = getBackendBaseUrl();
  const response = await fetch(`${backendBase}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const payloadText = await response.text();
  const payload = payloadText ? JSON.parse(payloadText) : null;

  if (!response.ok) {
    return NextResponse.json(payload ?? { success: false, message: "Login failed" }, { status: response.status });
  }

  const accessToken = getTokenFromPayload(payload, "accessToken") ?? getTokenFromPayload(payload, "token");
  const refreshToken = getTokenFromPayload(payload, "refreshToken");
  const user = getUserFromPayload(payload);
  const role = (user?.role as string | undefined) ?? "CUSTOMER";

  if (!accessToken || !refreshToken) {
    return NextResponse.json({ success: false, message: "Invalid login response" }, { status: 500 });
  }

  const cookieStore = await cookies();
  await setSessionCookies(cookieStore, accessToken, refreshToken, role);

  return NextResponse.json({ success: true, message: payload?.message ?? "Signed in", user }, { status: response.status });
}
