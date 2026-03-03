import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/http";

export async function GET(req: NextRequest) {
  const auth = requireRole(req, ["ADMIN"]);
  if (auth.error) return auth.error;
  return NextResponse.json(await prisma.counsellorProfile.findMany({ include: { user: true } }));
}

export async function PATCH(req: NextRequest) {
  const auth = requireRole(req, ["ADMIN"]);
  if (auth.error) return auth.error;
  const { counsellorId, verified } = await req.json();
  const c = await prisma.counsellorProfile.update({ where: { id: counsellorId }, data: { verified } });
  return NextResponse.json(c);
}
