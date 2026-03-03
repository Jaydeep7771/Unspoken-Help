import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/http";

export async function POST(req: NextRequest) {
  const auth = requireRole(req, ["USER"]);
  if (auth.error) return auth.error;
  const { sessionId, rating, comment } = await req.json();

  const session = await prisma.session.findUnique({ where: { id: sessionId } });
  if (!session || session.userId !== auth.auth.userId || session.status !== "COMPLETED") return NextResponse.json({ error: "Invalid session" }, { status: 400 });

  const review = await prisma.review.create({ data: { sessionId, rating, comment } });
  const aggregate = await prisma.review.aggregate({ _avg: { rating: true }, where: { session: { counsellorId: session.counsellorId } } });
  await prisma.counsellorProfile.update({ where: { id: session.counsellorId }, data: { rating: aggregate._avg.rating || 0 } });
  return NextResponse.json(review);
}
