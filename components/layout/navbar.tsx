import Link from "next/link";

export function Navbar() {
  return (
    <nav className="border-b bg-white/80 backdrop-blur">
      <div className="mx-auto max-w-6xl flex items-center justify-between px-4 py-3">
        <Link href="/" className="font-semibold text-primary">Unspoken Help</Link>
        <div className="flex gap-4 text-sm">
          <Link href="/explore">Explore</Link>
          <Link href="/blogs">Blogs</Link>
          <Link href="/about">About</Link>
          <Link href="/login">Login</Link>
        </div>
      </div>
    </nav>
  );
}
