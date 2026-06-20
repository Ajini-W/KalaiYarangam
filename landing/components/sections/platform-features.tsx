import {
  BarChart3,
  Bell,
  Layers,
  ShieldCheck,
  Users,
  Wallet,
} from 'lucide-react'
import { Reveal } from '@/components/reveal'
import { SectionHeading } from '@/components/section-heading'

const features = [
  {
    icon: Users,
    title: 'CRM',
    description:
      'Capture every enquiry from any channel and convert leads efficiently with automated follow-ups.',
  },
  {
    icon: Wallet,
    title: 'Finance',
    description:
      'Manage payments, invoices, and collections with integrated billing and reconciliation.',
  },
  {
    icon: Bell,
    title: 'Notifications',
    description:
      'Reach customers instantly over WhatsApp, Email, SMS, and in-app — fully automated.',
  },
  {
    icon: BarChart3,
    title: 'Analytics',
    description:
      'Track revenue, attendance, utilization, and profitability with real-time dashboards.',
  },
  {
    icon: ShieldCheck,
    title: 'Security',
    description:
      'Role-based access control, audit logs, and full activity tracking keep your data safe.',
  },
  {
    icon: Layers,
    title: 'Multi-Tenant Architecture',
    description:
      'True tenant isolation and elastic scalability built to grow with your business.',
  },
]

export function PlatformFeatures() {
  return (
    <section
      id="platform"
      className="scroll-mt-24 border-y border-border bg-muted/20 px-4 py-24"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Platform"
          title="Everything you need to run operations"
          description="A complete operating system for your business — every capability connected, every workflow automated."
        />

        <div className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-border bg-border md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <Reveal
              key={feature.title}
              delay={(i % 3) * 0.08}
              className="group bg-card p-7 transition-colors hover:bg-accent/40"
            >
              <div className="grid size-11 place-items-center rounded-xl bg-brand/10 text-brand transition-transform group-hover:scale-110">
                <feature.icon className="size-5" />
              </div>
              <h3 className="mt-5 font-heading text-lg font-semibold">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
