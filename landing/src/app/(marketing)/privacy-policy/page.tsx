import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <section className="bg-black min-h-screen pt-32 pb-20 px-4">
      <div className="mx-auto max-w-3xl prose prose-invert prose-sm">
        <h1 className="text-3xl font-bold text-white mb-2">Privacy Policy</h1>
        <p className="text-zinc-500 text-sm mb-8">Last updated: June 2026</p>
        <div className="space-y-6 text-zinc-400 text-sm leading-relaxed">
          <p>Kalai Arangam (&quot;we&quot;, &quot;us&quot;) collects and processes personal data to provide our booking and management platform. This policy explains how we handle your data.</p>
          <h2 className="text-lg font-semibold text-white">Data We Collect</h2>
          <p>We collect information you provide when registering, booking, or contacting us. This includes name, email, phone number, and business information.</p>
          <h2 className="text-lg font-semibold text-white">How We Use Your Data</h2>
          <p>We use your data to provide and improve our services, send transactional communications, and comply with legal obligations.</p>
          <h2 className="text-lg font-semibold text-white">Contact</h2>
          <p>For privacy-related queries, email us at <a href="mailto:contact@kalaiarangam.com" className="text-brand">contact@kalaiarangam.com</a>.</p>
        </div>
      </div>
    </section>
  );
}
