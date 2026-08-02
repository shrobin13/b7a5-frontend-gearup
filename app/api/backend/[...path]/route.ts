import { NextResponse } from "next/server";
import { proxyToBackend } from "@/lib/auth-server";

export async function GET(request: Request, { params }: { params: Promise<{ path?: string[] }> }) {
  const resolvedParams = await params;
  return proxyToBackend(request as any, resolvedParams.path ?? []);
}

export async function POST(request: Request, { params }: { params: Promise<{ path?: string[] }> }) {
  const resolvedParams = await params;
  return proxyToBackend(request as any, resolvedParams.path ?? []);
}

export async function PUT(request: Request, { params }: { params: Promise<{ path?: string[] }> }) {
  const resolvedParams = await params;
  return proxyToBackend(request as any, resolvedParams.path ?? []);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ path?: string[] }> }) {
  const resolvedParams = await params;
  return proxyToBackend(request as any, resolvedParams.path ?? []);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ path?: string[] }> }) {
  const resolvedParams = await params;
  return proxyToBackend(request as any, resolvedParams.path ?? []);
}
