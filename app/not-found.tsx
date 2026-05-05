import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-void px-6 text-center text-white">
      <span className="mb-6 text-[10px] uppercase tracking-[0.4em] text-matcha-light">
        404
      </span>
      <h1 className="text-5xl font-semibold leading-[0.95] tracking-tight text-white/90 md:text-7xl">
        Out of frame.
      </h1>
      <p className="mt-6 max-w-md text-sm leading-relaxed text-white/55 md:text-base">
        This page is somewhere between phases. Find your way back to the
        ritual.
      </p>
      <Link
        href="/"
        className="mt-10 inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/[0.03] px-8 py-3 text-[11px] uppercase tracking-[0.3em] text-white/90 transition-all duration-300 hover:border-white/50 hover:bg-white/10"
      >
        <span>Return home</span>
        <span aria-hidden="true">→</span>
      </Link>
    </main>
  );
}
