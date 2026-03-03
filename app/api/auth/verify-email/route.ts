import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({ message: "Email verification endpoint ready. Integrate signed token links." });
}
