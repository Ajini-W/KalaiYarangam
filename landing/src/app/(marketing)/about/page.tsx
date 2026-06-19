import type { Metadata } from "next";
import { CtaBanner } from "@/components/shared/cta-banner";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <>
      <section className="bg-black pt-32 pb-20 px-4">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand mb-4">About Us</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            We build platforms that make businesses run themselves.
          </h1>
          <p className="text-zinc-400 text-lg leading-relaxed">
            Kalai Arangam was founded with a single mission — to give local businesses the same
            digital infrastructure that enterprise companies take for granted. We believe every
            training center, rental shop, and event organizer deserves a world-class booking system.
          </p>
        </div>
      </section>

      <section className="bg-zinc-950 py-20 px-4">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 md:p-12">
            <h2 className="text-2xl font-bold text-white mb-6">The Founder&apos;s Desk</h2>
            <p className="text-zinc-400 leading-relaxed mb-4">
              Hi, I&apos;m Abishek. I&apos;ve been building web applications for over 6 years. I started Kalai
              Arangam after watching my family&apos;s training business struggle with manual bookings,
              missed payments, and no-shows.
            </p>
            <p className="text-zinc-400 leading-relaxed mb-4">
              I built the first version in 3 months. Today, we serve 200+ businesses across Tamil
              Nadu and are growing fast. Our goal is simple: make your business run on autopilot.
            </p>
            <p className="text-zinc-400 leading-relaxed">
              If you&apos;re a business owner tired of managing bookings on WhatsApp and spreadsheets,
              Kalai Arangam is for you.
            </p>
          </div>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
