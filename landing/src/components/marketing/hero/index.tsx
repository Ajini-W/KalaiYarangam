import Link from "next/link";
import { siteConfig } from "@/config/site";

const logos = [
  "Zoho", "Razorpay", "Google", "AWS", "Stripe", "Freshworks",
  "Juspay", "Cashfree", "Shiprocket", "Delhivery", "Meesho", "Zepto",
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-black pt-32 pb-20 px-4">
      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,#4ade8020,transparent)] pointer-events-none" />

      <div className="relative mx-auto max-w-4xl text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-4 py-1.5 text-xs font-medium text-brand mb-8">
          <span className="h-1.5 w-1.5 rounded-full bg-brand animate-pulse" />
          Now supporting Training, Rental & Events
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1]">
          The best booking &amp;{" "}
          <span className="text-brand">management platform</span>{" "}
          for your business.
        </h1>

        <p className="mt-6 text-zinc-400 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
          {siteConfig.description}
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/auth/sign-up"
            className="rounded-md bg-brand px-8 py-3.5 text-sm font-semibold text-black hover:bg-brand/90 transition-colors shadow-lg shadow-brand/20"
          >
            Get Started Free
          </Link>
          <Link
            href="/features"
            className="rounded-md border border-white/10 bg-white/5 px-8 py-3.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
          >
            View Features
          </Link>
        </div>

        {/* Social proof */}
        <p className="mt-8 text-xs text-zinc-600">
          Trusted by 200+ businesses across India
        </p>
      </div>

      {/* Trusted logos marquee */}
      <div className="relative mx-auto mt-20 max-w-5xl overflow-hidden">
        <p className="mb-6 text-center text-xs font-semibold uppercase tracking-widest text-zinc-600">
          Trusted by fast-growing businesses
        </p>
        <div className="flex w-max animate-marquee gap-12">
          {[...logos, ...logos].map((logo, i) => (
            <span
              key={i}
              className="whitespace-nowrap text-sm font-semibold text-zinc-600 hover:text-zinc-400 transition-colors"
            >
              {logo}
            </span>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-black to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-black to-transparent" />
      </div>
    </section>
  );
}
