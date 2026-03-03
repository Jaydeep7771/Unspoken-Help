import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/http";

export async function POST(req: NextRequest) {
  const auth = requireRole(req, ["COUNSELLOR"]);
  if (auth.error) return auth.error;
  const { amount } = await req.json();
  const profile = await prisma.counsellorProfile.findUnique({ where: { userId: auth.auth.userId } });
  if (!profile) return NextResponse.json({ error: "Profile missing" }, { status: 404 });
  const wr = await prisma.withdrawalRequest.create({ data: { counsellorId: profile.id, amount } });
  return NextResponse.json(wr);
}
