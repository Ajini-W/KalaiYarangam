import { features } from "@/config/features";
import { SectionHeader } from "@/components/shared/section-header";

export function FeaturesSection() {
  return (
    <section id="features" className="bg-zinc-950 py-24 px-4">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Features"
          title="Replace your manual processes"
          description="Everything you need to run a modern booking business — in one platform."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 hover:border-brand/30 hover:bg-brand/5 transition-all duration-300"
            >
              <div className="mb-4 text-3xl">{feature.icon}</div>
              <h3 className="mb-2 font-semibold text-white">{feature.title}</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
