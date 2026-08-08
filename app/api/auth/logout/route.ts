import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_COOKIE_NAMES, clearSessionCookies, getBackendBaseUrl } from "@/lib/auth-server";

export async function POST() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(AUTH_COOKIE_NAMES.access)?.value;
  const backendBase = getBackendBaseUrl();

  if (accessToken) {
    await fetch(`${backendBase}/api/auth/logout`, {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    }).catch(() => undefined);
  }

  await clearSessionCookies(cookieStore);
  return NextResponse.json({ success: true, message: "Signed out" });
}
