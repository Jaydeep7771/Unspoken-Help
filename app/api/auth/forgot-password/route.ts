import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({ message: "Password reset flow initialized. Integrate token mailer in production SMTP." });
}
