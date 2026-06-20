'use client'

import {
  ArrowRight,
  CalendarDays,
  Check,
  GraduationCap,
  Package,
  PartyPopper,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SectionHeading } from '@/components/section-heading'

const modules = [
  {
    id: 'training',
    tab: 'Training',
    icon: GraduationCap,
    title: 'Training Management',
    description:
      'Run your academy end to end — capture enquiries, enroll students, schedule batches, track attendance, and collect fees automatically.',
    features: [
      'Lead Management',
      'Student Enrollment',
      'Batch Scheduling',
      'Attendance Tracking',
      'Fee Collection',
      'Progress Reports',
      'Certification',
    ],
    rows: [
      { name: 'Bharatanatyam — Batch A', meta: '24 students', tag: 'Active' },
      { name: 'Vocal Music — Evening', meta: '18 students', tag: 'Active' },
      { name: 'Yoga — Weekend', meta: '31 students', tag: 'Enrolling' },
    ],
  },
  {
    id: 'rental',
    tab: 'Rental',
    icon: Package,
    title: 'Rental Management',
    description:
      'Track every asset from booking to return. Know what is available, dispatched, or under maintenance in real time.',
    features: [
      'Inventory Management',
      'Availability Calendar',
      'Booking Management',
      'Dispatch Tracking',
      'Return Processing',
      'Damage Assessment',
    ],
    rows: [
      { name: 'Stage Lighting Kit', meta: 'Out — returns Sat', tag: 'Booked' },
      { name: 'Costume Set — Royal', meta: 'Available ×6', tag: 'Ready' },
      { name: 'Sound System Pro', meta: 'Maintenance', tag: 'Service' },
    ],
  },
  {
    id: 'event',
    tab: 'Event',
    icon: PartyPopper,
    title: 'Event Management',
    description:
      'Plan and deliver flawless events — from the first enquiry and quotation to team assignment, budgets, and closure reports.',
    features: [
      'Lead Tracking',
      'Quotation Builder',
      'Team Assignment',
      'Task Management',
      'Budget Monitoring',
      'Event Closure Reports',
    ],
    rows: [
      { name: 'Sharma Wedding', meta: '₹4.2L budget', tag: 'Planning' },
      { name: 'Corporate Gala', meta: '12 tasks open', tag: 'On Track' },
      { name: 'Annual Day Show', meta: 'Quote sent', tag: 'Pending' },
    ],
  },
]

export function Modules() {
  return (
    <section id="modules" className="scroll-mt-24 px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Product Modules"
          title="Powerful modules that work the way you do"
          description="Activate only what you need. Every module is purpose-built and fully integrated with billing, CRM, and analytics."
        />

        <Tabs defaultValue="training" className="mt-14 gap-8">
          <TabsList className="mx-auto h-auto flex-wrap gap-1 rounded-full bg-muted p-1.5">
            {modules.map((m) => (
              <TabsTrigger
                key={m.id}
                value={m.id}
                className="gap-2 rounded-full px-5 py-2 text-sm data-[state=active]:bg-brand data-[state=active]:text-brand-foreground"
              >
                <m.icon className="size-4" />
                {m.tab}
              </TabsTrigger>
            ))}
          </TabsList>

          {modules.map((m) => (
            <TabsContent key={m.id} value={m.id}>
              <div className="grid items-center gap-8 rounded-3xl border border-border bg-card p-6 sm:p-10 lg:grid-cols-2">
                <div>
                  <div className="grid size-12 place-items-center rounded-xl bg-brand/10 text-brand">
                    <m.icon className="size-6" />
                  </div>
                  <h3 className="mt-5 font-heading text-2xl font-bold">
                    {m.title}
                  </h3>
                  <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
                    {m.description}
                  </p>
                  <ul className="mt-6 grid grid-cols-2 gap-2.5">
                    {m.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-center gap-2 text-sm text-foreground/70"
                      >
                        <span className="grid size-5 place-items-center rounded-full bg-success/15 text-success">
                          <Check className="size-3" />
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button
                    asChild
                    className="mt-7 bg-brand text-brand-foreground hover:bg-brand/90"
                  >
                    <a href="#pricing">
                      Explore {m.tab}
                      <ArrowRight className="size-4" />
                    </a>
                  </Button>
                </div>

                {/* Module preview */}
                <div className="rounded-2xl border border-border bg-muted/30 p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground/70">{m.title}</p>
                    <CalendarDays className="size-4 text-muted-foreground" />
                  </div>
                  <div className="space-y-2.5">
                    {m.rows.map((row) => (
                      <div
                        key={row.name}
                        className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3"
                      >
                        <div>
                          <p className="text-sm font-medium">{row.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {row.meta}
                          </p>
                        </div>
                        <span className="rounded-full bg-brand/10 px-2.5 py-1 text-xs font-medium text-brand">
                          {row.tag}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  )
}
