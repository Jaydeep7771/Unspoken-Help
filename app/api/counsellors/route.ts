import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const specialization = searchParams.get("specialization") || undefined;
  const minRating = Number(searchParams.get("minRating") || 0);
  const maxPrice = Number(searchParams.get("maxPrice") || 1000000);

  const data = await prisma.counsellorProfile.findMany({
    where: {
      verified: true,
      specialization: specialization ? { contains: specialization, mode: "insensitive" } : undefined,
      rating: { gte: minRating },
      sessionRate: { lte: maxPrice }
    },
    include: { user: { select: { name: true, email: true } } }
  });

  return NextResponse.json(data);
}
