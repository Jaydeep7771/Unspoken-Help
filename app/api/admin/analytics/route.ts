import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/http";

export async function GET(req: NextRequest) {
  const auth = requireRole(req, ["ADMIN"]);
  if (auth.error) return auth.error;
  const [users, sessions, tx] = await Promise.all([
    prisma.user.count(),
    prisma.session.count(),
    prisma.transaction.aggregate({ _sum: { amount: true }, where: { type: "SESSION_PAYMENT" } })
  ]);
  return NextResponse.json({ users, sessions, grossRevenue: tx._sum.amount || 0 });
}
