import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signToken, setAuthCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { idToken, role = "USER" } = await req.json();
  const verify = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`);
  if (!verify.ok) return NextResponse.json({ error: "Invalid Google token" }, { status: 401 });
  const data = await verify.json();

  let user = await prisma.user.findUnique({ where: { email: data.email } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name || "Google User",
        role,
        googleId: data.sub,
        emailVerified: true
      }
    });
  }

  const token = signToken({ userId: user.id, role: user.role });
  setAuthCookie(token);
  return NextResponse.json({ userId: user.id, role: user.role });
}
