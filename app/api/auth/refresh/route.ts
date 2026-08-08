import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { refreshSession } from "@/lib/auth-server";

export async function POST() {
  const cookieStore = await cookies();
  const refreshed = await refreshSession(cookieStore);

  if (!refreshed) {
    return NextResponse.json({ success: false, message: "Unable to refresh session" }, { status: 401 });
  }

  return NextResponse.json({ success: true, message: "Session refreshed" });
}
