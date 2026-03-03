import { prisma } from "@/lib/prisma";

export default async function ExplorePage() {
  const counsellors = await prisma.counsellorProfile.findMany({ include: { user: true }, where: { verified: true } });
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Explore Counsellors</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {counsellors.map((c) => (
          <div className="card" key={c.id}>
            <p className="font-medium">{c.user.name}</p>
            <p className="text-sm text-slate-600">{c.specialization} • ₹{c.sessionRate.toString()} / session</p>
            <p className="text-sm">Rating {c.rating.toFixed(1)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
