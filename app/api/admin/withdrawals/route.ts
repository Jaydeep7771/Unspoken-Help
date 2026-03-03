import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/http";

export async function GET(req: NextRequest) {
  const auth = requireRole(req, ["ADMIN"]);
  if (auth.error) return auth.error;
  return NextResponse.json(await prisma.withdrawalRequest.findMany({ include: { counsellor: { include: { user: true } } } }));
}

export async function PATCH(req: NextRequest) {
  const auth = requireRole(req, ["ADMIN"]);
  if (auth.error) return auth.error;
  const { requestId, status } = await req.json();
  const updated = await prisma.withdrawalRequest.update({ where: { id: requestId }, data: { status } });
  return NextResponse.json(updated);
}
