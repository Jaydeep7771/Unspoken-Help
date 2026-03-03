import { prisma } from "@/lib/prisma";

export default async function BlogsPage() {
  const blogs = await prisma.blog.findMany({ where: { published: true }, include: { author: true } });
  return <div className="space-y-3">{blogs.map((b) => <article className="card" key={b.id}><h2 className="font-semibold">{b.title}</h2><p className="text-xs">By {b.author.name}</p><p className="mt-2 text-sm whitespace-pre-wrap">{b.content}</p></article>)}</div>;
}
