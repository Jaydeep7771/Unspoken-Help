import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { env } from "@/lib/env";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = headers().get("x-razorpay-signature") || "";
  const expected = crypto.createHmac("sha256", env.RAZORPAY_WEBHOOK_SECRET).update(body).digest("hex");
  if (sig !== expected) return NextResponse.json({ error: "Invalid signature" }, { status: 400 });

  const event = JSON.parse(body);
  if (event.event === "payment.captured") {
    const payment = event.payload.payment.entity;
    const amount = Number(payment.amount) / 100;
    const userId = payment.notes?.userId;
    if (userId) {
      await prisma.$transaction([
        prisma.user.update({ where: { id: userId }, data: { walletBalance: { increment: amount } } }),
        prisma.transaction.create({ data: { userId, type: "DEPOSIT", amount, status: "SUCCESS", paymentGatewayId: payment.id } })
      ]);
    }
  }

  return NextResponse.json({ ok: true });
}
