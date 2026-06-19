import { Check, GraduationCap, Package, PartyPopper } from 'lucide-react'
import { Reveal } from '@/components/reveal'
import { SectionHeading } from '@/components/section-heading'
import { cn } from '@/lib/utils'

const industries = [
  {
    icon: GraduationCap,
    name: 'Training Institutes',
    description: 'Manage the student lifecycle from enquiry to certification.',
    features: ['Leads', 'Enrollments', 'Attendance', 'Fees', 'Certificates'],
    accent: 'text-brand',
    ring: 'group-hover:border-brand/40',
    glow: 'bg-brand/15',
  },
  {
    icon: Package,
    name: 'Rental Businesses',
    description:
      'Manage inventory, bookings, rentals, returns, and maintenance.',
    features: ['Inventory', 'Booking Calendar', 'Quotations', 'Returns'],
    accent: 'text-accent-cyan',
    ring: 'group-hover:border-accent-cyan/40',
    glow: 'bg-accent-cyan/15',
  },
  {
    icon: PartyPopper,
    name: 'Event Management',
    description: 'Manage events from first enquiry to final billing.',
    features: ['CRM', 'Quotations', 'Planning', 'Budget Tracking'],
    accent: 'text-success',
    ring: 'group-hover:border-success/40',
    glow: 'bg-success/15',
  },
]

export function Industries() {
  return (
    <section id="industries" className="scroll-mt-24 px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Built for your industry"
          title="One platform, three industry-specific workflows"
          description="KalaiYarangam adapts to how your business actually operates — no generic templates, no compromise."
        />

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {industries.map((industry, i) => (
            <Reveal key={industry.name} delay={i * 0.1}>
              <div className="group relative h-full overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div
                  className={cn(
                    'absolute -right-8 -top-8 size-32 rounded-full blur-3xl transition-opacity',
                    industry.glow,
                  )}
                />
                <div
                  className={cn(
                    'relative grid size-12 place-items-center rounded-xl border border-border bg-background transition-colors',
                    industry.ring,
                  )}
                >
                  <industry.icon className={cn('size-6', industry.accent)} />
                </div>
                <h3 className="mt-5 font-heading text-xl font-semibold">
                  {industry.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {industry.description}
                </p>
                <ul className="mt-5 grid grid-cols-2 gap-2">
                  {industry.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-2 text-sm text-foreground/80"
                    >
                      <Check className={cn('size-4', industry.accent)} />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
