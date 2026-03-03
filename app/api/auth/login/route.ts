import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { comparePassword, setAuthCookie, signToken } from "@/lib/auth";
import { loginSchema } from "@/lib/validation";

export async function POST(req: NextRequest) {
  const body = loginSchema.parse(await req.json());
  const user = await prisma.user.findUnique({ where: { email: body.email } });
  if (!user?.password) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  const ok = await comparePassword(body.password, user.password);
  if (!ok) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  const token = signToken({ userId: user.id, role: user.role });
  setAuthCookie(token);
  return NextResponse.json({ role: user.role, userId: user.id });
}
