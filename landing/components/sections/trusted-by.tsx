import { Counter } from '@/components/counter'
import { Reveal } from '@/components/reveal'

const stats = [
  { value: 2400, suffix: '+', label: 'Active users on the platform' },
  { value: 850, suffix: '+', label: 'Businesses managed daily' },
  { value: 120, prefix: '₹', suffix: 'Cr+', label: 'Revenue processed' },
  { value: 99.9, suffix: '%', label: 'Platform uptime', decimals: 1 },
]

const segments = ['Academies', 'Rental Businesses', 'Event Companies']

export function TrustedBy() {
  return (
    <section className="border-y border-border bg-muted/20 px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <Reveal className="text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
            Trusted by growing businesses across India
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-base font-semibold text-foreground/60">
            {segments.map((s) => (
              <span key={s}>{s}</span>
            ))}
          </div>
        </Reveal>

        <div className="mt-12 grid grid-cols-2 gap-5 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <Reveal
              key={stat.label}
              delay={i * 0.08}
              className="rounded-2xl border border-border bg-card p-6 text-center"
            >
              <p className="font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">
                {stat.prefix}
                <Counter to={stat.value} decimals={stat.decimals ?? 0} />
                {stat.suffix}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
