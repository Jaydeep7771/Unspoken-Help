import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/http";

export async function GET() {
  const blogs = await prisma.blog.findMany({ where: { published: true }, include: { author: true } });
  return NextResponse.json(blogs);
}

export async function POST(req: NextRequest) {
  const auth = requireRole(req, ["ADMIN"]);
  if (auth.error) return auth.error;
  const body = await req.json();
  const blog = await prisma.blog.create({ data: { title: body.title, content: body.content, published: !!body.published, authorId: auth.auth.userId } });
  return NextResponse.json(blog);
}
