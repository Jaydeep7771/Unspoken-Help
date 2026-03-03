import { NextRequest, NextResponse } from "next/server";
import { razorpay } from "@/lib/payments";
import { requireRole } from "@/lib/http";

export async function POST(req: NextRequest) {
  const auth = requireRole(req, ["USER"]);
  if (auth.error) return auth.error;
  const { amount } = await req.json();
  const order = await razorpay.orders.create({ amount: Math.round(Number(amount) * 100), currency: "INR", notes: { userId: auth.auth.userId } });
  return NextResponse.json(order);
}
