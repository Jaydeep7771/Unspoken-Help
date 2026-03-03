import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/http";
import { decrypt, encrypt } from "@/lib/crypto";
import { journalSchema } from "@/lib/validation";

export async function GET(req: NextRequest) {
  const auth = requireRole(req, ["USER"]);
  if (auth.error) return auth.error;
  const journals = await prisma.journal.findMany({ where: { userId: auth.auth.userId }, orderBy: { createdAt: "desc" } });
  return NextResponse.json(journals.map((j) => ({ ...j, content: decrypt(j.content) })));
}

export async function POST(req: NextRequest) {
  const auth = requireRole(req, ["USER"]);
  if (auth.error) return auth.error;
  const body = journalSchema.parse(await req.json());
  const journal = await prisma.journal.create({ data: { ...body, content: encrypt(body.content), userId: auth.auth.userId } });
  return NextResponse.json(journal);
}
