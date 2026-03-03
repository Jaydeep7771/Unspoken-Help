import Link from "next/link";

export default function HomePage() {
  return (
    <section className="grid gap-6 md:grid-cols-2 items-center">
      <div>
        <h1 className="text-4xl font-bold text-slate-900">Feel heard, even in silence.</h1>
        <p className="mt-4 text-slate-600">Book verified counsellors, manage your wellness journal, and get structured support in one calm platform.</p>
        <div className="mt-6 flex gap-3">
          <Link className="rounded-xl bg-primary px-5 py-2 text-white" href="/signup">Get started</Link>
          <Link className="rounded-xl bg-secondary px-5 py-2" href="/explore">Explore counsellors</Link>
        </div>
      </div>
      <div className="card bg-gradient-to-br from-violet-50 to-cyan-50">
        <h2 className="font-semibold">Platform highlights</h2>
        <ul className="mt-4 space-y-2 text-sm text-slate-700 list-disc pl-5">
          <li>Wallet based secure booking</li>
          <li>Razorpay + Stripe integration</li>
          <li>Encrypted private journaling</li>
          <li>Role-based dashboards</li>
        </ul>
      </div>
    </section>
  );
}
