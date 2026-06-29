import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Reveal } from "@/components/reveal";
import { Check, ArrowRight, Sparkles } from "lucide-react";

const plans = [
  {
    name: "Solo Module",
    subtitle: "Choose Any One Module",
    price: 999,
    description: "Training Management, Rental Management, or Event Management.",
    features: [
      "Lead Management",
      "Customer Management",
      "Payment Tracking",
      "Notifications",
      "Dashboard",
      "Reports",
      "Export (PDF, Excel, CSV)",
    ],
    limits: ["Staff Users: 5", "Branches: 1", "Storage: 5 GB", "Records: 500"],
    highlight: false,
  },
  {
    name: "Business Plan",
    subtitle: "Choose Any Two Modules",
    price: 1899,
    description:
      "Everything in Solo, plus advanced features for growing teams.",
    features: [
      "Multi Branch Support",
      "Team Management",
      "Role Management",
      "Approval Workflows",
      "Customer Portal",
      "Student Portal",
      "Advanced Reports",
      "WhatsApp Automation",
    ],
    limits: [
      "Staff Users: 15",
      "Branches: 3",
      "Storage: 25 GB",
      "Records: 5,000",
    ],
    highlight: true,
  },
  {
    name: "Complete Plan",
    subtitle: "Includes All Modules",
    price: 2499,
    description:
      "All modules with premium features, AI, and unlimited records.",
    features: [
      "All module features included",
      "AI Insights",
      "Smart Follow-ups",
      "Revenue Forecasting",
      "Advanced Analytics",
      "Portals",
      "Workflow Automation",
      "Priority Support",
    ],
    limits: [
      "Staff Users: 50",
      "Branches: 10",
      "Storage: 100 GB",
      "Records: Unlimited",
    ],
    highlight: false,
  },
];

const SAAS_URL = process.env.NEXT_PUBLIC_SAAS_URL || "https://app.saas.com";

export default function PricingPage() {
  return (
    <div className="min-h-dvh bg-background">
      <SiteHeader />
      <main className="pt-28 pb-24">
        <div className="mx-auto max-w-6xl px-4">
          <Reveal className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-accent-cyan/20 bg-accent-cyan/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-accent-cyan">
              Pricing
            </span>
            <h1 className="mt-5 text-balance font-heading text-4xl font-bold tracking-tight sm:text-5xl">
              Simple, transparent pricing
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              Start with a 20-day free trial - full access, all modules, no
              credit card required.
            </p>
          </Reveal>

          <Reveal className="mx-auto mt-10 max-w-3xl">
            <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-accent-green/20 bg-accent-green/5 p-5 sm:flex-row">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-accent-green/15 text-accent-green">
                  <Sparkles className="size-5" />
                </span>
                <div>
                  <p className="font-heading font-bold">20-Day Free Trial</p>
                  <p className="text-sm text-muted-foreground">
                    All Modules · Unlimited Users · Mobile Access · No credit
                    card
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center justify-center rounded-2xl px-6 py-3 text-sm font-semibold text-accent-green bg-accent-green/10 cursor-default">
                🎉 Launching Soon
              </span>
            </div>
          </Reveal>

          <div className="mt-14 grid gap-5 lg:grid-cols-3">
            {plans.map((plan, i) => (
              <Reveal key={plan.name} delay={i * 0.08}>
                <div
                  className={`relative flex h-full flex-col rounded-3xl border p-6 transition-all duration-300 hover:-translate-y-1 ${
                    plan.highlight
                      ? "border-primary/30 bg-gradient-to-b from-primary/5 to-card shadow-xl shadow-primary/10 lg:scale-[1.03]"
                      : "border-border bg-card hover:shadow-lg hover:shadow-black/5"
                  }`}
                >
                  {plan.highlight && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-bold text-primary-foreground shadow-md shadow-primary/20">
                      Most Popular
                    </span>
                  )}
                  <h3 className="font-heading text-lg font-bold">
                    {plan.name}
                  </h3>
                  <p className="mt-0.5 text-xs font-semibold text-primary">
                    {plan.subtitle}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {plan.description}
                  </p>
                  <div className="mt-5 flex items-end gap-1">
                    <span className="font-heading text-3xl font-extrabold tracking-tight">
                      ₹{plan.price.toLocaleString("en-IN")}
                    </span>
                    <span className="mb-1 text-sm text-muted-foreground">
                      /month
                    </span>
                  </div>
                  <ul className="mt-6 flex-1 space-y-2.5">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <span className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-full bg-accent-green/15 text-accent-green">
                          <Check className="size-3" />
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  {plan.limits.length > 0 && (
                    <div className="mt-4 rounded-2xl border border-border bg-surface-alt p-3">
                      <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        Limits
                      </p>
                      <ul className="space-y-1">
                        {plan.limits.map((l) => (
                          <li
                            key={l}
                            className="flex items-center justify-between text-xs text-foreground/70"
                          >
                            <span>{l.split(":")[0]}</span>
                            <span className="font-medium">
                              {l.split(":")[1]}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <span
                    className={`mt-6 inline-flex h-12 items-center justify-center gap-2 whitespace-nowrap rounded-2xl px-6 text-sm font-semibold cursor-default w-full ${
                      plan.highlight
                        ? "bg-primary/10 text-primary"
                        : "border border-border text-muted-foreground"
                    }`}
                  >
                    Coming Soon
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
