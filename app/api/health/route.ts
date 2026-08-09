import { NextResponse } from "next/server";

/**
 * Lightweight health check for the frontend.
 * Used by keep-alive pings so the free Render instance stays warm
 * without generating any real traffic or backend calls.
 */
export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "gearup-frontend",
    timestamp: new Date().toISOString(),
  });
}
