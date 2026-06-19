import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Tutorials" };

const tutorials = [
  { href: "/tutorials/getting-started", title: "Getting Started", desc: "Set up your account and configure your first booking flow in under 30 minutes.", time: "30 min" },
  { href: "/tutorials/training-management", title: "Training Management", desc: "Create batches, enroll students, track attendance, and manage fees.", time: "45 min" },
  { href: "/tutorials/rental-management", title: "Rental Management", desc: "Set up your fleet, configure availability, and accept rental bookings.", time: "40 min" },
  { href: "/tutorials/event-management", title: "Event Management", desc: "Create events, sell tickets, manage venue capacity.", time: "35 min" },
  { href: "/tutorials/subscriptions", title: "Subscriptions & Billing", desc: "Set up recurring memberships and manage subscription billing.", time: "20 min" },
];

export default function TutorialsPage() {
  return (
    <section className="bg-black min-h-screen pt-32 pb-20 px-4">
      <div className="mx-auto max-w-4xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand mb-4">Tutorials</p>
        <h1 className="text-4xl font-bold text-white mb-12">Learn Kalai Arangam</h1>
        <div className="space-y-3">
          {tutorials.map((t) => (
            <Link key={t.href} href={t.href} className="group flex items-start justify-between rounded-xl border border-white/[0.06] bg-zinc-950 p-5 hover:border-brand/30 transition-all">
              <div>
                <h2 className="font-semibold text-white group-hover:text-brand transition-colors mb-1">{t.title}</h2>
                <p className="text-sm text-zinc-500">{t.desc}</p>
              </div>
              <span className="shrink-0 ml-4 mt-0.5 text-xs text-zinc-600">{t.time}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
