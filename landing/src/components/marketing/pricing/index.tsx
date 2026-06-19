import Link from "next/link";
import { Check } from "lucide-react";
import { pricingPlans } from "@/config/pricing";
import { SectionHeader } from "@/components/shared/section-header";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function PricingSection() {
  return (
    <section id="pricing" className="bg-zinc-950 py-24 px-4">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Pricing"
          title="Extensive Pricing Plans"
          description={
            <>
              Doubts? Reach out to us at{" "}
              <a href={`mailto:${siteConfig.email}`} className="text-brand underline">
                {siteConfig.email}
              </a>
            </>
          }
        />

        <div className="grid gap-6 lg:grid-cols-3">
          {pricingPlans.map((plan) => (
            <div
              key={plan.id}
              className={cn(
                "relative flex flex-col rounded-xl border p-8 transition-all duration-300",
                plan.highlighted
                  ? "border-brand/50 bg-brand/5 shadow-lg shadow-brand/10"
                  : "border-white/[0.06] bg-white/[0.02] hover:border-white/10"
              )}
            >
              {plan.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand px-4 py-1 text-xs font-bold text-black">
                  {plan.badge}
                </span>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
                <p className="mt-1 text-sm text-zinc-500">{plan.description}</p>
              </div>

              <div className="mb-8">
                <span className="text-4xl font-bold text-white">{plan.price}</span>
                {plan.period && <span className="text-zinc-500 text-sm">{plan.period}</span>}
              </div>

              <ul className="mb-8 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-zinc-400">
                    <Check size={14} className="mt-0.5 shrink-0 text-brand" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href={plan.id === "enterprise" ? "/contact" : "/auth/sign-up"}
                className={cn(
                  "block rounded-md py-3 text-center text-sm font-semibold transition-colors",
                  plan.highlighted
                    ? "bg-brand text-black hover:bg-brand/90"
                    : "border border-white/10 bg-white/5 text-white hover:bg-white/10"
                )}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
