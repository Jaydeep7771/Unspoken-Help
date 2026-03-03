import { NextRequest, NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { getAuthFromRequest } from "@/lib/auth";

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export function requireRole(req: NextRequest, roles: Role[]) {
  const auth = getAuthFromRequest(req);
  if (!auth) return { error: jsonError("Unauthorized", 401) };
  if (!roles.includes(auth.role)) return { error: jsonError("Forbidden", 403) };
  return { auth };
}
