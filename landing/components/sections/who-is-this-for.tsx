import { Reveal } from '@/components/reveal'
import { GraduationCap, Package, PartyPopper, Music, Waves, Swords, Camera, Heart, Clapperboard } from 'lucide-react'

const industries = [
  { icon: GraduationCap, name: 'Dance Academy', color: 'bg-primary/10 text-primary border-primary/15' },
  { icon: Music, name: 'Music School', color: 'bg-accent-blue/10 text-accent-blue border-accent-blue/15' },
  { icon: Waves, name: 'Swimming Academy', color: 'bg-accent-cyan/10 text-accent-cyan border-accent-cyan/15' },
  { icon: Swords, name: 'Martial Arts', color: 'bg-accent-red/10 text-accent-red border-accent-red/15' },
  { icon: Heart, name: 'Yoga Studio', color: 'bg-accent-green/10 text-accent-green border-accent-green/15' },
  { icon: GraduationCap, name: 'Tuition Centre', color: 'bg-primary/10 text-primary border-primary/15' },
  { icon: Package, name: 'Rental Business', color: 'bg-accent-blue/10 text-accent-blue border-accent-blue/15' },
  { icon: PartyPopper, name: 'Event Company', color: 'bg-accent-red/10 text-accent-red border-accent-red/15' },
  { icon: Heart, name: 'Wedding Planner', color: 'bg-primary/10 text-primary border-primary/15' },
  { icon: Camera, name: 'Photography Studio', color: 'bg-accent-cyan/10 text-accent-cyan border-accent-cyan/15' },
]

export function WhoIsThisFor() {
  return (
    <section className="px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
            Industry Solutions
          </span>
          <h2 className="mt-5 text-balance font-heading text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Built for your industry
          </h2>
          <h3 className="text-xl opacity-50 pt-2 font-bold">Industries We Serve</h3>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
          Discover how different sectors use our products to work smarter, save money and grow.
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {industries.map((industry, i) => (
            <Reveal key={industry.name} delay={(i % 5) * 0.06}>
              <a
                href={`/solutions#${industry.name.toLowerCase().replace(/\s+/g, '-')}`}
                className={`group flex flex-col items-center gap-3 rounded-2xl border p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/5 ${industry.color}`}
              >
                <div className="grid size-12 place-items-center rounded-xl bg-white/80 shadow-sm">
                  <industry.icon className="size-6" />
                </div>
                <p className="text-sm font-semibold">{industry.name}</p>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
