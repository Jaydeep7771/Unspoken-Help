import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { signupSchema } from "@/lib/validation";

export async function POST(req: NextRequest) {
  const body = signupSchema.parse(await req.json());
  const exists = await prisma.user.findUnique({ where: { email: body.email } });
  if (exists) return NextResponse.json({ error: "Email already exists" }, { status: 409 });

  const user = await prisma.user.create({
    data: {
      name: body.name,
      email: body.email,
      password: await hashPassword(body.password),
      role: body.role,
      counsellorProfile: body.role === "COUNSELLOR" ? {
        create: {
          specialization: "General",
          experienceYears: 0,
          sessionRate: 500,
          bio: "Pending profile completion",
          languages: ["English"],
          availabilitySlots: []
        }
      } : undefined
    }
  });

  return NextResponse.json({ id: user.id, message: "Registered. Please verify email." });
}
