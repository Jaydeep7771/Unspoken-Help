import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/payments";
import { requireRole } from "@/lib/http";

export async function POST(req: NextRequest) {
  const auth = requireRole(req, ["USER"]);
  if (auth.error) return auth.error;
  if (!stripe) return NextResponse.json({ error: "Stripe disabled" }, { status: 400 });
  const { amount } = await req.json();
  const intent = await stripe.paymentIntents.create({ amount: Math.round(Number(amount) * 100), currency: "inr", metadata: { userId: auth.auth.userId } });
  return NextResponse.json({ clientSecret: intent.client_secret });
}
