import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/http";

export async function GET(req: NextRequest) {
  const role = requireRole(req, ["USER", "COUNSELLOR", "ADMIN"]);
  if (role.error) return role.error;

  const sessions = await prisma.session.findMany({
    where: role.auth.role === "USER" ? { userId: role.auth.userId } : role.auth.role === "COUNSELLOR" ? { counsellor: { userId: role.auth.userId } } : undefined,
    include: { counsellor: { include: { user: true } }, user: true }
  });

  return NextResponse.json(sessions);
}

export async function POST(req: NextRequest) {
  const role = requireRole(req, ["USER"]);
  if (role.error) return role.error;
  const { counsellorId, scheduledTime } = await req.json();

  const counsellor = await prisma.counsellorProfile.findUnique({ where: { id: counsellorId } });
  if (!counsellor || !counsellor.verified) return NextResponse.json({ error: "Counsellor unavailable" }, { status: 404 });

  const when = new Date(scheduledTime);
  const collision = await prisma.session.findFirst({ where: { counsellorId, scheduledTime: when, status: "BOOKED" } });
  if (collision) return NextResponse.json({ error: "Slot already booked" }, { status: 409 });

  const setting = await prisma.platformSetting.findFirst();
  const commissionPct = setting?.commissionPercentage || 20;
  const amount = Number(counsellor.sessionRate);
  const commission = Number(((amount * commissionPct) / 100).toFixed(2));

  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.findUniqueOrThrow({ where: { id: role.auth.userId } });
    if (Number(user.walletBalance) < amount) throw new Error("Insufficient wallet balance");

    await tx.user.update({ where: { id: role.auth.userId }, data: { walletBalance: { decrement: amount } } });
    await tx.transaction.create({ data: { userId: role.auth.userId, type: "SESSION_PAYMENT", amount, status: "SUCCESS" } });
    return tx.session.create({ data: { userId: role.auth.userId, counsellorId, scheduledTime: when, amount, platformCommission: commission, status: "BOOKED" } });
  });

  return NextResponse.json(result);
}
