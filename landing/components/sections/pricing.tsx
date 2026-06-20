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
    price: 999,
    description: 'Choose any one module — Training, Rental, or Event.',
    features: [
      'Any 1 module',
      'Lead management',
      'Up to 5 staff users',
      '1 branch',
      '5 GB storage',
      'Standard reports',
    ],
    highlight: false,
  },
  {
    name: 'Business Plan',
    price: 1899,
    description: 'Choose any two modules for growing businesses.',
    features: [
      'Any 2 modules',
      'Multi-branch support',
      'Up to 15 staff users',
      '3 branches',
      '25 GB storage',
      'Advanced reports',
      'WhatsApp automation',
    ],
    highlight: false,
  },
  {
    name: 'Complete Plan',
    price: 2499,
    description: 'All modules included with unlimited potential.',
    features: [
      'All modules included',
      'AI insights & forecasting',
      'Up to 50 staff users',
      '10 branches',
      '100 GB storage',
      'Workflow automation',
      'Priority support',
    ],
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: 0,
    description: 'Custom solutions for large-scale operations.',
    features: [
      'Unlimited everything',
      'White label solution',
      'Custom domain & API',
      'SSO & audit logs',
      'Dedicated account manager',
      'SLA support',
      'Custom workflows',
    ],
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
                  Full access · All modules · No credit card
                </p>
              </div>
            </div>
            <Button
              asChild
              className="bg-brand text-brand-foreground hover:bg-brand/90"
            >
              <a href="#demo">Start Free Trial</a>
            </Button>
          </div>
        </Reveal>

        {/* Billing toggle */}
        <div className="mt-10 flex justify-center">
          <div className="inline-flex flex-wrap items-center justify-center gap-1 rounded-full border border-border bg-muted p-1.5">
            {billingOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setBilling(option.id)}
                className={cn(
                  'flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors',
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
              <p className="mt-1 text-sm text-muted-foreground">
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
              <ul className="mt-6 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <span className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-full bg-success/15 text-success">
                      <Check className="size-3" />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                asChild
                variant={plan.highlight ? 'default' : 'outline'}
                className={cn(
                  'mt-7 w-full',
                  plan.highlight &&
                    'bg-brand text-brand-foreground hover:bg-brand/90',
                )}
              >
                <a href="#demo">
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
