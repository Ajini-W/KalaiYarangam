import Link from "next/link";
import { siteConfig } from "@/config/site";

export function CtaBanner() {
  return (
    <section className="relative overflow-hidden border-y border-white/[0.06] bg-zinc-950 py-24 px-4 text-center">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand/10 via-transparent to-transparent pointer-events-none" />
      <p className="relative text-xs font-semibold uppercase tracking-widest text-brand mb-4">
        Need a fast-moving team for your business?
      </p>
      <h2 className="relative text-3xl md:text-4xl font-bold text-white max-w-2xl mx-auto">
        {siteConfig.name} is your best bet.
      </h2>
      <p className="relative mt-4 text-zinc-400 max-w-lg mx-auto text-sm">
        We have designers, engineers and product managers to take your project from 0 to launch.
      </p>
      <div className="relative mt-8 flex items-center justify-center gap-4">
        <Link
          href="/contact"
          className="rounded-md bg-brand px-6 py-3 text-sm font-semibold text-black hover:bg-brand/90 transition-colors"
        >
          Chat with us
        </Link>
        <Link
          href="/pricing"
          className="rounded-md border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
        >
          View Pricing
        </Link>
      </div>
    </section>
  );
}
