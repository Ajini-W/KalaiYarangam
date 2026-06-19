import type { Metadata } from "next";
import Link from "next/link";
import { CtaBanner } from "@/components/shared/cta-banner";

export const metadata: Metadata = { title: "Event Organizers" };

const eventFeatures = [
  "Online ticket sales & QR codes",
  "Venue capacity management",
  "Staff coordination & scheduling",
  "Attendee check-in system",
  "Automated event reminders",
  "Post-event analytics",
];

export default function EventsPage() {
  return (
    <>
      <section className="bg-black pt-32 pb-20 px-4">
        <div className="mx-auto max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand mb-4">Industry</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">🎉 Event Organizers</h1>
          <p className="text-zinc-400 text-lg leading-relaxed max-w-2xl">
            Sell tickets, manage venue capacity, coordinate staff, and send automated event
            reminders — all from one dashboard.
          </p>
          <div className="mt-8 flex gap-4">
            <Link href="/auth/sign-up" className="rounded-md bg-brand px-6 py-3 text-sm font-semibold text-black hover:bg-brand/90 transition-colors">
              Start Free Trial
            </Link>
            <Link href="/pricing" className="rounded-md border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors">
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-zinc-950 py-20 px-4">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold text-white mb-8">Built for event organizers</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {eventFeatures.map((f) => (
              <div key={f} className="flex items-center gap-3 rounded-lg border border-white/[0.06] bg-white/[0.02] p-4">
                <span className="text-brand">✓</span>
                <span className="text-sm text-zinc-300">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
