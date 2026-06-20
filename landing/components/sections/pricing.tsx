'use client'

import { ArrowRight, Check, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { SectionHeading } from '@/components/section-heading'
import { Reveal } from '@/components/reveal'
import { cn } from '@/lib/utils'

type Billing = 'monthly' | 'half' | 'annual'

const billingOptions: { id: Billing; label: string; note?: string }[] = [
  { id: 'monthly', label: 'Monthly' },
  { id: 'half', label: '6 Months', note: 'Save 10%' },
  { id: 'annual', label: '12 Months', note: 'Save 20%' },
]

const discount: Record<Billing, number> = {
  monthly: 1,
  half: 0.9,
  annual: 0.8,
}

const plans = [
  {
    name: 'Solo Module',
    subtitle: 'Choose Any One Module',
    price: 999,
    description: 'Training Management, Rental Management, or Event Management.',
    features: [
      'Lead Management',
      'Customer Management',
      'Payment Tracking',
      'Notifications',
      'Dashboard',
      'Reports',
      'Export (PDF, Excel, CSV)',
    ],
    limits: [
      'Staff Users: 5',
      'Branches: 1',
      'Storage: 5 GB',
      'Records: 500',
    ],
    highlight: false,
  },
  {
    name: 'Business Plan',
    subtitle: 'Choose Any Two Modules',
    price: 1899,
    description: 'Everything in Solo, plus advanced features for growing teams.',
    features: [
      'Multi Branch Support',
      'Team Management',
      'Role Management',
      'Approval Workflows',
      'Customer Portal',
      'Student Portal',
      'Advanced Reports',
      'WhatsApp Automation',
    ],
    limits: [
      'Staff Users: 15',
      'Branches: 3',
      'Storage: 25 GB',
      'Records: 5,000',
    ],
    highlight: true,
  },
  {
    name: 'Complete Plan',
    subtitle: 'Includes All Modules',
    price: 2499,
    description: 'All modules with premium features, AI, and unlimited records.',
    features: [
      'All module features included',
      'AI Insights',
      'Smart Follow-ups',
      'Revenue Forecasting',
      'Advanced Analytics',
      'Customer / Student / Client Portals',
      'Workflow Automation',
      'Priority Support',
    ],
    limits: [
      'Staff Users: 50',
      'Branches: 10',
      'Storage: 100 GB',
      'Records: Unlimited',
    ],
    highlight: false,
  },
  {
    name: 'Enterprise',
    subtitle: 'Custom Quotation',
    price: 0,
    description: 'For franchise academies, multi-city businesses, and large chains.',
    features: [
      'Unlimited Users & Branches',
      'White Label Solution',
      'Custom Domain',
      'API Access',
      'ERP Integrations',
      'Dedicated Account Manager',
      'SLA Support',
      'Single Sign-On (SSO)',
      'Audit Logs',
      'Custom Workflows',
    ],
    limits: [],
    highlight: false,
    isEnterprise: true,
  },
]

function formatPrice(base: number, billing: Billing) {
  return Math.round(base * discount[billing]).toLocaleString('en-IN')
}

export function Pricing() {
  const [billing, setBilling] = useState<Billing>('annual')

  return (
    <section id="pricing" className="scroll-mt-24 px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Pricing"
          title="Simple, transparent pricing"
          description="Start with a 20-day free trial — full access, all modules, no credit card required."
        />

        {/* Free trial banner */}
        <Reveal className="mx-auto mt-10 max-w-3xl">
          <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-brand/20 bg-brand/5 p-5 dark:bg-brand/[0.06] sm:flex-row">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-brand/15 text-brand">
                <Sparkles className="size-5" />
              </span>
              <div>
                <p className="font-heading font-semibold">20-Day Free Trial</p>
                <p className="text-sm text-muted-foreground">
                  All Modules · Unlimited Users · Mobile Access · No credit card
                </p>
              </div>
            </div>
            <Button
              asChild
              className="bg-brand text-brand-foreground hover:bg-brand/90"
            >
              <a href="#contact">Start Free Trial</a>
            </Button>
          </div>
        </Reveal>

        {/* Billing toggle */}
        <div className="mt-10 flex justify-center">
          <div role="tablist" aria-label="Billing period" className="inline-flex flex-wrap items-center justify-center gap-1 rounded-full border border-border bg-muted p-1.5">
            {billingOptions.map((option) => (
              <button
                key={option.id}
                role="tab"
                aria-selected={billing === option.id}
                onClick={() => setBilling(option.id)}
                className={cn(
                  'flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
                  billing === option.id
                    ? 'bg-brand text-brand-foreground'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {option.label}
                {option.note && (
                  <span
                    className={cn(
                      'rounded-full px-1.5 py-0.5 text-[10px] font-semibold',
                      billing === option.id
                        ? 'bg-brand-foreground/20 text-brand-foreground'
                        : 'bg-success/15 text-success',
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
                'relative flex h-full flex-col rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1',
                plan.highlight
                  ? 'border-brand/30 bg-brand/5 shadow-2xl shadow-brand/10 dark:bg-brand/[0.04] dark:shadow-brand/[0.08] lg:scale-[1.03]'
                  : 'border-border bg-card hover:border-border/80 hover:shadow-lg',
              )}
            >
              {plan.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand px-3 py-1 text-xs font-semibold text-brand-foreground">
                  Most Popular
                </span>
              )}
              <h3 className="font-heading text-lg font-semibold">
                {plan.name}
              </h3>
              <p className="mt-0.5 text-xs font-medium text-brand">
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
                    <span className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-full bg-success/15 text-success">
                      <Check className="size-3" />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
              {plan.limits.length > 0 && (
                <div className="mt-4 rounded-xl border border-border bg-muted/30 p-3">
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Limits
                  </p>
                  <ul className="space-y-1">
                    {plan.limits.map((limit) => (
                      <li
                        key={limit}
                        className="flex items-center justify-between text-xs text-foreground/70"
                      >
                        <span>{limit.split(':')[0]}</span>
                        <span className="font-medium">{limit.split(':')[1]}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <Button
                asChild
                variant={plan.highlight ? 'default' : 'outline'}
                className={cn(
                  'mt-6 w-full',
                  plan.highlight &&
                    'bg-brand text-brand-foreground hover:bg-brand/90',
                )}
              >
                <a href="#contact">
                  {plan.isEnterprise ? 'Contact Sales' : 'Get started'}
                  <ArrowRight className="size-4" />
                </a>
              </Button>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
