import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Reveal } from '@/components/reveal'
import { GraduationCap, Music, Waves, Swords, Heart, Package, PartyPopper, Camera, BookOpen } from 'lucide-react'

const solutions = [
  { icon: GraduationCap, name: 'Dance Academy', description: 'Manage students, batches, attendance, and recitals for Bharatanatyam, Kuchipudi, and contemporary dance schools.', color: 'bg-primary/10 text-primary border-primary/15' },
  { icon: Music, name: 'Music School', description: 'Schedule vocal and instrumental classes, track student progress, and manage exam preparations.', color: 'bg-accent-blue/10 text-accent-blue border-accent-blue/15' },
  { icon: BookOpen, name: 'Tuition Centre', description: 'Handle batch scheduling, fee collection, and parent notifications for academic coaching centres.', color: 'bg-accent-green/10 text-accent-green border-accent-green/15' },
  { icon: Waves, name: 'Swimming Academy', description: 'Track pool schedules, instructor availability, and swimmer progress across age groups.', color: 'bg-accent-cyan/10 text-accent-cyan border-accent-cyan/15' },
  { icon: Heart, name: 'Yoga Studio', description: 'Manage class schedules, instructor assignments, and wellness program tracking.', color: 'bg-accent-red/10 text-accent-red border-accent-red/15' },
  { icon: Swords, name: 'Martial Arts', description: 'Track belt progress, attendance, and competition schedules for karate, taekwondo, and kalaripayattu.', color: 'bg-primary/10 text-primary border-primary/15' },
  { icon: Package, name: 'Rental Business', description: 'Manage inventory, bookings, dispatch, returns, and damage assessment for any rental business.', color: 'bg-accent-blue/10 text-accent-blue border-accent-blue/15' },
  { icon: PartyPopper, name: 'Event Company', description: 'Handle event planning, quotations, budgets, team assignments, and closure reports.', color: 'bg-accent-red/10 text-accent-red border-accent-red/15' },
  { icon: Heart, name: 'Wedding Planner', description: 'Manage wedding event timelines, vendor coordination, budgets, and client communications.', color: 'bg-primary/10 text-primary border-primary/15' },
  { icon: Camera, name: 'Photography Studio', description: 'Track bookings, equipment, shoots, editing workflows, and client deliveries.', color: 'bg-accent-cyan/10 text-accent-cyan border-accent-cyan/15' },
]

export default function SolutionsPage() {
  return (
    <div className="min-h-dvh bg-background">
      <SiteHeader />
      <main className="pt-28 pb-24">
        <div className="mx-auto max-w-6xl px-4">
          <Reveal className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
              Solutions
            </span>
            <h1 className="mt-5 text-balance font-heading text-4xl font-bold tracking-tight sm:text-5xl">
              Industry Solutions
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              Purpose-built for your specific business. Each solution explains problems, workflows, features, and FAQs.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {solutions.map((s, i) => (
              <Reveal key={s.name} delay={(i % 3) * 0.08}>
                <a href={`/solutions#${s.name.toLowerCase().replace(/\s+/g, '-')}`} className={`group flex h-full flex-col rounded-3xl border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5 ${s.color}`}>
                  <div className="grid size-12 place-items-center rounded-2xl bg-white/80 shadow-sm">
                    <s.icon className="size-6" />
                  </div>
                  <h3 className="mt-4 font-heading text-lg font-bold">{s.name}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{s.description}</p>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
