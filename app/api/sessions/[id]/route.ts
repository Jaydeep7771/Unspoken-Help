import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/http";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireRole(req, ["USER", "COUNSELLOR"]);
  if (auth.error) return auth.error;
  const { action } = await req.json();
  const session = await prisma.session.findUnique({ where: { id: params.id }, include: { counsellor: true } });
  if (!session) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (action === "cancel" && auth.auth.role === "USER") {
    if (session.userId !== auth.auth.userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const result = await prisma.$transaction([
      prisma.session.update({ where: { id: session.id }, data: { status: "CANCELLED" } }),
      prisma.user.update({ where: { id: session.userId }, data: { walletBalance: { increment: session.amount } } }),
      prisma.transaction.create({ data: { userId: session.userId, type: "REFUND", amount: session.amount, status: "SUCCESS" } })
    ]);
    return NextResponse.json(result[0]);
  }

  if ((action === "accept" || action === "decline" || action === "complete") && auth.auth.role === "COUNSELLOR") {
    if (session.counsellor.userId !== auth.auth.userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    if (action === "decline") {
      const result = await prisma.$transaction([
        prisma.session.update({ where: { id: session.id }, data: { status: "CANCELLED" } }),
        prisma.user.update({ where: { id: session.userId }, data: { walletBalance: { increment: session.amount } } }),
        prisma.transaction.create({ data: { userId: session.userId, type: "REFUND", amount: session.amount, status: "SUCCESS" } })
      ]);
      return NextResponse.json(result[0]);
    }
    if (action === "accept") return NextResponse.json(await prisma.session.update({ where: { id: session.id }, data: { status: "BOOKED" } }));

    const counsellorShare = Number(session.amount) - Number(session.platformCommission);
    const result = await prisma.$transaction([
      prisma.session.update({ where: { id: session.id }, data: { status: "COMPLETED" } }),
      prisma.user.update({ where: { id: session.counsellor.userId }, data: { walletBalance: { increment: counsellorShare } } }),
      prisma.transaction.create({ data: { userId: session.counsellor.userId, type: "DEPOSIT", amount: counsellorShare, status: "SUCCESS" } }),
      prisma.counsellorProfile.update({ where: { id: session.counsellorId }, data: { totalSessions: { increment: 1 } } })
    ]);
    return NextResponse.json(result[0]);
  }

  return NextResponse.json({ error: "Unsupported action" }, { status: 400 });
}
