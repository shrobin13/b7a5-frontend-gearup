import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_PREFIXES = ["/dashboard", "/provider", "/admin"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("gearup-access-token")?.value;
  const role = request.cookies.get("gearup-role")?.value ?? null;
  // console.log(token,'token/* ');
  // console.log(role,'role'); */

  if (PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix)) && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (pathname.startsWith("/provider") && !["PROVIDER", "ADMIN"].includes(role ?? "")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (pathname.startsWith("/admin") && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/provider/:path*",
    "/admin/:path*",
    "/login",
    "/register",
  ],
};