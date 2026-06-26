import { Counter } from '@/components/counter'
import { Reveal } from '@/components/reveal'

const stats = [
  { value: 2400, suffix: '+', label: 'Active users on the platform', color: 'from-primary/10 to-primary/5 border-primary/15' },
  { value: 850, suffix: '+', label: 'Businesses managed daily', color: 'from-accent-blue/10 to-accent-blue/5 border-accent-blue/15' },
  { value: 120, prefix: '₹', suffix: 'Cr+', label: 'Revenue processed', color: 'from-accent-green/10 to-accent-green/5 border-accent-green/15' },
  { value: 99.9, suffix: '%', label: 'Platform uptime', decimals: 1, color: 'from-accent-cyan/10 to-accent-cyan/5 border-accent-cyan/15' },
]

const segments = [
  { name: 'Academies', color: 'text-primary' },
  { name: 'Rental Businesses', color: 'text-accent-blue' },
  { name: 'Event Companies', color: 'text-accent-red' },
]

export function TrustedBy() {
  return (
    <section className="relative overflow-hidden border-y border-border bg-surface-alt px-4 py-16">
      <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-primary/5 blur-3xl" aria-hidden="true" />
      <div className="absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-accent-blue/5 blur-3xl" aria-hidden="true" />
      <div className="relative mx-auto max-w-6xl">
        <Reveal className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            Trusted by growing businesses across India
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-base font-bold">
            {segments.map((s) => (
              <span key={s.name} className={s.color}>{s.name}</span>
            ))}
          </div>
        </Reveal>

        <div className="mt-12 grid grid-cols-2 gap-5 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <Reveal
              key={stat.label}
              delay={i * 0.08}
              className={`rounded-2xl border bg-gradient-to-br p-6 text-center ${stat.color} transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}
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
