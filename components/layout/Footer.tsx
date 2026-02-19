import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="font-semibold tracking-tight">
          Needspersand
        </Link>

        <nav className="flex items-center gap-6 text-sm text-neutral-700">
          <Link href="/tomatok" className="hover:text-neutral-900">
            Tomatok
          </Link>
          <Link href="/tott" className="hover:text-neutral-900">
            TOTT
          </Link>
          <Link href="/staking" className="hover:text-neutral-900">
            Staking
          </Link>
        </nav>
      </div>
    </header>
  );
}
