import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_COOKIE_NAMES, getBackendBaseUrl } from "@/lib/auth-server";

export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(AUTH_COOKIE_NAMES.access)?.value;

  if (!accessToken) {
    return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 });
  }

  const backendBase = getBackendBaseUrl();
  const response = await fetch(`${backendBase}/api/auth/me`, {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });

  const payloadText = await response.text();
  const payload = payloadText ? JSON.parse(payloadText) : null;

  if (!response.ok) {
    return NextResponse.json(payload ?? { success: false, message: "Authentication required" }, { status: response.status });
  }

  return NextResponse.json(payload ?? { success: true, user: null });
}
