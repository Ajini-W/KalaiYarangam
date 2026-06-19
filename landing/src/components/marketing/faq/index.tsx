"use client";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { SectionHeader } from "@/components/shared/section-header";
import { siteConfig } from "@/config/site";

const faqs = [
  {
    q: "What exactly does Kalai Arangam do?",
    a: "It's an all-in-one booking and management platform for training centers, rental businesses, and event organizers. You get online bookings, payments, reminders, analytics, and more.",
  },
  {
    q: "Do I need to be technical to use this?",
    a: "Not at all. The platform is built for business owners. Setup takes under 30 minutes and our onboarding team helps you get started.",
  },
  {
    q: "Can I connect this with my existing tools?",
    a: "Yes. We integrate with Google Calendar, Razorpay, Cashfree, WhatsApp, and more. API access is available on the Growth and Enterprise plans.",
  },
  {
    q: "How does payment processing work?",
    a: "We support UPI, credit/debit cards, and net banking via Razorpay and Cashfree. Funds are settled directly to your bank account.",
  },
  {
    q: "Is there a free trial?",
    a: "Yes, you get a 14-day free trial on the Starter and Growth plans. No credit card required.",
  },
  {
    q: "What happens if I exceed my booking limit?",
    a: "We'll notify you before you hit the limit and offer a seamless upgrade. You'll never lose a booking because of plan limits.",
  },
];

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-zinc-950 py-24 px-4">
      <div className="mx-auto max-w-3xl">
        <SectionHeader
          eyebrow="FAQ"
          title="Frequently Asked Questions"
          description={
            <>
              Have more doubts? Reach out to us at{" "}
              <a href={`mailto:${siteConfig.email}`} className="text-brand underline">
                {siteConfig.email}
              </a>
            </>
          }
        />

        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between px-6 py-4 text-left text-sm font-semibold text-white hover:text-brand transition-colors"
              >
                {faq.q}
                {open === i ? (
                  <Minus size={16} className="shrink-0 text-brand" />
                ) : (
                  <Plus size={16} className="shrink-0 text-zinc-500" />
                )}
              </button>
              {open === i && (
                <div className="px-6 pb-5 text-sm text-zinc-400 leading-relaxed border-t border-white/[0.04] pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
