import { Building2, LayoutGrid, Rocket, UserPlus, Users } from 'lucide-react'
import { Reveal } from '@/components/reveal'
import { SectionHeading } from '@/components/section-heading'

const steps = [
  {
    icon: UserPlus,
    title: 'Create Account',
    description: 'Sign up in seconds — no credit card required.',
  },
  {
    icon: Building2,
    title: 'Create Organization',
    description: 'Set up your tenant, branding, and branches.',
  },
  {
    icon: LayoutGrid,
    title: 'Select Modules',
    description: 'Activate Training, Rental, or Event modules.',
  },
  {
    icon: Users,
    title: 'Invite Team',
    description: 'Add staff with role-based permissions.',
  },
  {
    icon: Rocket,
    title: 'Start Operations',
    description: 'Go live and manage everything in one place.',
  },
]

export function Walkthrough() {
  return (
    <section className="px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Product Walkthrough"
          title="Up and running in five simple steps"
          description="From sign-up to live operations, KalaiYarangam gets your business onboarded fast."
        />

        <div className="relative mt-16">
          <div className="absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-border to-transparent lg:block" />
          <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
            {steps.map((step, i) => (
              <Reveal key={step.title} delay={i * 0.1} as="li">
                <div className="relative flex flex-col items-center text-center lg:items-start lg:text-left">
                  <div className="relative z-10 grid size-14 place-items-center rounded-2xl border border-border bg-card text-brand shadow-sm">
                    <step.icon className="size-6" />
                    <span className="absolute -right-2 -top-2 grid size-6 place-items-center rounded-full bg-brand text-xs font-bold text-brand-foreground">
                      {i + 1}
                    </span>
                  </div>
                  <h3 className="mt-5 font-heading text-base font-semibold">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
