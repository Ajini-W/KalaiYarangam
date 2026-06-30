import { Reveal } from "@/components/reveal";
import { ArrowRight, Check } from "lucide-react";

const plans = [
  {
    name: "Solo Module",
    price: "₹999",
    period: "/month",
    description: "Choose any one module",
    features: ["5 Staff Users", "1 Branch", "5 GB Storage", "500 Records"],
    highlight: false,
  },
  {
    name: "Business Plan",
    price: "₹1,899",
    period: "/month",
    description: "Choose any two modules",
    features: [
      "15 Staff Users",
      "3 Branches",
      "25 GB Storage",
      "5,000 Records",
    ],
    highlight: true,
    badge: "Most Popular",
  },
  {
    name: "Complete Plan",
    price: "₹2,499",
    period: "/month",
    description: "All modules included",
    features: [
      "50 Staff Users",
      "10 Branches",
      "100 GB Storage",
      "Unlimited Records",
    ],
    highlight: false,
  },
];

export function PricingPreview() {
  return (
    <section
      id="pricing"
      className="scroll-mt-24 relative overflow-hidden bg-surface-alt px-4 py-24"
    >
      <div
        className="absolute -right-24 top-1/4 h-48 w-48 rounded-full bg-primary/5 blur-3xl"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-5xl">
        <Reveal className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-accent-cyan/20 bg-accent-cyan/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-accent-cyan">
            Pricing
          </span>
          <h2 className="mt-5 text-balance font-heading text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Simple, transparent pricing
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            Start with a 20-day free trial - no credit card required.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-3">
          {plans.map((plan, i) => (
            <Reveal key={plan.name} delay={i * 0.08}>
              <div
                className={`relative flex h-full flex-col rounded-3xl border p-6 transition-all duration-300 hover:-translate-y-1 ${
                  plan.highlight
                    ? "border-primary/30 bg-gradient-to-b from-primary/5 to-card shadow-xl shadow-primary/10 lg:scale-[1.03]"
                    : "border-border bg-card hover:shadow-lg hover:shadow-black/5"
                }`}
              >
                {plan.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-bold text-primary-foreground shadow-md shadow-primary/20">
                    {plan.badge}
                  </span>
                )}
                <h3 className="font-heading text-lg font-bold">{plan.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {plan.description}
                </p>
                <div className="mt-4 flex items-end gap-1">
                  <span className="font-heading text-3xl font-extrabold tracking-tight">
                    {plan.price}
                  </span>
                  <span className="mb-1 text-sm text-muted-foreground">
                    {plan.period}
                  </span>
                </div>
                <ul className="mt-5 flex-1 space-y-2.5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <span className="grid size-4 shrink-0 place-items-center rounded-full bg-accent-green/15 text-accent-green">
                        <Check className="size-3" />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href="#contact"
                  className={`mt-6 inline-flex h-12 items-center justify-center gap-2 whitespace-nowrap rounded-2xl px-6 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 ${
                    plan.highlight
                      ? "text-white shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30"
                      : "border border-border bg-card text-foreground hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
                  }`}
                  style={
                    plan.highlight
                      ? {
                          background:
                            "linear-gradient(135deg, #FFB21D 0%, #FF8A00 100%)",
                        }
                      : undefined
                  }
                >
                  Get started
                  <ArrowRight className="size-4" />
                </a>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-8 text-center">
          <a
            href="/pricing"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            View all pricing details
            <ArrowRight className="size-4" />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
