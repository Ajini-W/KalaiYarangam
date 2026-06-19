import { siteConfig } from "@/config/site";

const stats = [
  { value: "200+", label: "Businesses served" },
  { value: "50K+", label: "Bookings processed" },
  { value: "₹2Cr+", label: "Revenue managed" },
  { value: "99.9%", label: "Uptime guaranteed" },
];

export function StatsSection() {
  return (
    <section className="bg-zinc-950 py-20 px-4 border-y border-white/[0.06]">
      <div className="mx-auto max-w-5xl">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-zinc-600 mb-12">
          Scaling successful businesses
        </p>
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-white tabular-nums">{stat.value}</p>
              <p className="mt-2 text-sm text-zinc-500">{stat.label}</p>
            </div>
          ))}
        </div>
        <p className="mt-12 text-center text-sm text-zinc-500 max-w-lg mx-auto">
          {siteConfig.description}
        </p>
      </div>
    </section>
  );
}
