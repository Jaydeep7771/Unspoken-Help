import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

const bucket = new Map<string, { count: number; resetAt: number }>();

function rateLimit(ip: string, max = 120, windowMs = 60000) {
  const current = bucket.get(ip);
  const now = Date.now();
  if (!current || now > current.resetAt) {
    bucket.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (current.count >= max) return false;
  current.count += 1;
  return true;
}

export function middleware(req: NextRequest) {
  const ip = req.ip || "127.0.0.1";
  if (!rateLimit(ip)) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  if (req.nextUrl.pathname.startsWith("/dashboard")) {
    const token = req.cookies.get("auth_token")?.value;
    if (!token) return NextResponse.redirect(new URL("/login", req.url));
    try {
      verifyToken(token);
    } catch {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*"]
};
