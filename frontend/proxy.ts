import { NextRequest, NextResponse } from "next/server";

const AUTH_ROUTES = ["/login", "/register"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get("access-token")?.value;
  const role = request.cookies.get("gearup-role")?.value;

  const isAuthenticated = !!accessToken;

  // Redirect guests away from protected routes
  if (
    (pathname.startsWith("/dashboard") ||
      pathname.startsWith("/provider") ||
      pathname.startsWith("/admin")) &&
    !isAuthenticated
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Prevent logged in users from visiting login/register
  if (AUTH_ROUTES.includes(pathname) && isAuthenticated) {
    switch (role) {
      case "ADMIN":
        return NextResponse.redirect(new URL("/admin", request.url));

      case "PROVIDER":
        return NextResponse.redirect(new URL("/provider", request.url));

      default:
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // Provider routes
  if (
    pathname.startsWith("/provider") &&
    role !== "PROVIDER" &&
    role !== "ADMIN"
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Admin routes
  if (pathname.startsWith("/admin") && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/register",
    "/dashboard/:path*",
    "/provider/:path*",
    "/admin/:path*",
  ],
};