import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <section className="bg-black min-h-screen pt-32 pb-20 px-4">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold text-white mb-2">Terms of Service</h1>
        <p className="text-zinc-500 text-sm mb-8">Last updated: June 2026</p>
        <div className="space-y-6 text-zinc-400 text-sm leading-relaxed">
          <p>By accessing or using Kalai Arangam, you agree to be bound by these Terms of Service.</p>
          <h2 className="text-lg font-semibold text-white">Use of Service</h2>
          <p>You may use our platform for lawful business purposes only. You are responsible for all activity under your account.</p>
          <h2 className="text-lg font-semibold text-white">Payment Terms</h2>
          <p>Subscription fees are billed monthly in advance. All fees are non-refundable except as required by law.</p>
          <h2 className="text-lg font-semibold text-white">Termination</h2>
          <p>We reserve the right to suspend or terminate accounts that violate these terms.</p>
          <h2 className="text-lg font-semibold text-white">Contact</h2>
          <p>Questions? Email <a href="mailto:contact@kalaiarangam.com" className="text-brand">contact@kalaiarangam.com</a>.</p>
        </div>
      </div>
    </section>
  );
}
