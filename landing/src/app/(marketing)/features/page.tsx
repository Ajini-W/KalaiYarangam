import type { Metadata } from "next";
import { features } from "@/config/features";
import { SectionHeader } from "@/components/shared/section-header";
import { CtaBanner } from "@/components/shared/cta-banner";

export const metadata: Metadata = { title: "Features" };

export default function FeaturesPage() {
  return (
    <>
      <section className="bg-black pt-32 pb-20 px-4">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand mb-4">Features</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Everything you need to run a modern booking business
          </h1>
          <p className="mt-6 text-zinc-400 text-lg max-w-2xl mx-auto">
            Purpose-built tools for training centers, rental businesses, and event organizers.
          </p>
        </div>
      </section>

      <section className="bg-zinc-950 py-20 px-4">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 hover:border-brand/30 hover:bg-brand/5 transition-all"
              >
                <div className="mb-4 text-3xl">{f.icon}</div>
                <h3 className="mb-2 font-semibold text-white">{f.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
