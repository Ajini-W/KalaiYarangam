"use client";

import { ArrowRight, Check, Sparkles } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";
import { cn } from "@/lib/utils";

type Billing = "monthly" | "half" | "annual";

const billingOptions: { id: Billing; label: string; note?: string }[] = [
  { id: "monthly", label: "Monthly" },
  { id: "half", label: "6 Months", note: "Save 10%" },
  { id: "annual", label: "12 Months", note: "Save 20%" },
];

const discount: Record<Billing, number> = {
  monthly: 1,
  half: 0.9,
  annual: 0.8,
};

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
    color: "border-primary/20",
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
    color: "border-primary/30",
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
      "Customer / Student / Client Portals",
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
    color: "border-accent-blue/20",
  },
  {
    name: "Enterprise",
    subtitle: "Custom Quotation",
    price: 0,
    description:
      "For franchise academies, multi-city businesses, and large chains.",
    features: [
      "Unlimited Users & Branches",
      "White Label Solution",
      "Custom Domain",
      "API Access",
      "ERP Integrations",
      "Dedicated Account Manager",
      "SLA Support",
      "Single Sign-On (SSO)",
      "Audit Logs",
      "Custom Workflows",
    ],
    limits: [],
    highlight: false,
    isEnterprise: true,
    color: "border-accent-cyan/20",
  },
];

function formatPrice(base: number, billing: Billing) {
  return Math.round(base * discount[billing]).toLocaleString("en-IN");
}

export function Pricing() {
  const [billing, setBilling] = useState<Billing>("annual");

  return (
    <section id="pricing" className="scroll-mt-24 px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Pricing"
          title="Simple, transparent pricing"
          description="Start with a 20-day free trial - full access, all modules, no credit card required."
        />

        {/* Free trial banner */}
        <Reveal className="mx-auto mt-10 max-w-3xl">
          <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-accent-green/20 bg-accent-green/5 p-5 sm:flex-row">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-accent-green/15 text-accent-green">
                <Sparkles className="size-5" />
              </span>
              <div>
                <p className="font-heading font-bold">20-Day Free Trial</p>
                <p className="text-sm text-muted-foreground">
                  All Modules · Unlimited Users · Mobile Access · No credit card
                </p>
              </div>
            </div>
            <span className="inline-flex items-center justify-center rounded-full bg-accent-green/15 px-5 py-2 text-sm font-semibold text-accent-green cursor-default">
                🎉 Launching Soon
              </span>
          </div>
        </Reveal>

        {/* Billing toggle */}
        <div className="mt-10 flex justify-center">
          <div
            role="tablist"
            aria-label="Billing period"
            className="inline-flex flex-wrap items-center justify-center gap-1 rounded-full border border-border bg-muted p-1.5"
          >
            {billingOptions.map((option) => (
              <button
                key={option.id}
                role="tab"
                aria-selected={billing === option.id}
                onClick={() => setBilling(option.id)}
                className={cn(
                  "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                  billing === option.id
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {option.label}
                {option.note && (
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
                      billing === option.id
                        ? "bg-primary-foreground/20 text-primary-foreground"
                        : "bg-accent-green/15 text-accent-green",
                    )}
                  >
                    {option.note}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Plans */}
        <div className="mt-12 grid gap-5 lg:grid-cols-4">
          {plans.map((plan, i) => (
            <Reveal
              key={plan.name}
              delay={i * 0.08}
              className={cn(
                "relative flex h-full flex-col rounded-3xl border p-6 transition-all duration-300 hover:-translate-y-1",
                plan.highlight
                  ? "border-primary/30 bg-gradient-to-b from-primary/5 to-transparent shadow-2xl shadow-primary/10 lg:scale-[1.03]"
                  : `${plan.color} bg-card hover:shadow-xl hover:shadow-black/5`,
              )}
            >
              {plan.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-bold text-primary-foreground shadow-md shadow-primary/20">
                  Most Popular
                </span>
              )}
              <h3 className="font-heading text-lg font-bold">{plan.name}</h3>
              <p className="mt-0.5 text-xs font-semibold text-primary">
                {plan.subtitle}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {plan.description}
              </p>
              <div className="mt-5 flex items-end gap-1">
                {plan.isEnterprise ? (
                  <span className="font-heading text-3xl font-extrabold tracking-tight">
                    Custom
                  </span>
                ) : (
                  <>
                    <span className="font-heading text-3xl font-extrabold tracking-tight">
                      ₹{formatPrice(plan.price, billing)}
                    </span>
                    <span className="mb-1 text-sm text-muted-foreground">
                      /month
                    </span>
                  </>
                )}
              </div>
              <ul className="mt-6 flex-1 space-y-2.5">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <span className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-full bg-accent-green/15 text-accent-green">
                      <Check className="size-3" />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
              {plan.limits.length > 0 && (
                <div className="mt-4 rounded-2xl border border-border bg-surface-alt p-3">
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Limits
                  </p>
                  <ul className="space-y-1">
                    {plan.limits.map((limit) => (
                      <li
                        key={limit}
                        className="flex items-center justify-between text-xs text-foreground/70"
                      >
                        <span>{limit.split(":")[0]}</span>
                        <span className="font-medium">
                          {limit.split(":")[1]}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <span
                className={cn(
                  "mt-6 w-full inline-flex items-center justify-center rounded-full font-semibold text-sm py-2 px-4 cursor-default",
                  plan.highlight
                    ? "bg-primary/10 text-primary"
                    : "border-2 border-border text-muted-foreground",
                )}
              >
                {plan.isEnterprise ? "Contact Sales — Coming Soon" : "Coming Soon"}
              </span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
