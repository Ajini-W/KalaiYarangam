'use client'

import { motion, AnimatePresence } from 'framer-motion'
import {
  Building2,
  CalendarHeart,
  Crown,
  Dumbbell,
  Package,
} from 'lucide-react'
import { useState } from 'react'
import { DashboardMockup, dashboardConfigs, type DashboardConfig } from '@/components/dashboard-mockup'
import { SectionHeading } from '@/components/section-heading'
import { cn } from '@/lib/utils'

const screens = [
  {
    id: 'owner',
    icon: Crown,
    label: 'Owner Dashboard',
    description: 'Revenue, students, utilization — full business overview.',
    config: dashboardConfigs.owner,
  },
  {
    id: 'branch',
    icon: Building2,
    label: 'Branch Dashboard',
    description: 'Branch revenue, staff, attendance, and live batch status.',
    config: dashboardConfigs.branch,
  },
  {
    id: 'trainer',
    icon: Dumbbell,
    label: 'Trainer Dashboard',
    description: 'Today\'s classes, attendance rates, and pending marks.',
    config: dashboardConfigs.trainer,
  },
  {
    id: 'event',
    icon: CalendarHeart,
    label: 'Event Dashboard',
    description: 'Active events, pipeline value, budgets, and task status.',
    config: dashboardConfigs.event,
  },
  {
    id: 'rental',
    icon: Package,
    label: 'Rental Dashboard',
    description: 'Inventory availability, bookings, dispatch, and returns.',
    config: dashboardConfigs.rental,
  },
]

export function DashboardShowcase() {
  const [active, setActive] = useState(screens[0])

  return (
    <section className="border-y border-border bg-muted/20 px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Dashboard Showcase"
          title="A tailored view for every role"
          description="Owners, branch managers, trainers, and coordinators each get a focused dashboard built around their day."
        />

        <div className="mt-12 grid gap-8 lg:grid-cols-[280px_1fr]">
          <div role="tablist" aria-label="Dashboard views" className="flex flex-wrap gap-2 lg:flex-col">
            {screens.map((screen) => {
              const isActive = screen.id === active.id
              return (
                <button
                  key={screen.id}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActive(screen)}
                  className={cn(
                    'flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
                    isActive
                      ? 'border-brand/40 bg-brand/10'
                      : 'border-border bg-card hover:text-foreground',
                  )}
                >
                  <screen.icon className={cn('size-4 shrink-0', isActive ? 'text-brand' : 'text-muted-foreground')} />
                  <div className="min-w-0">
                    <p className={cn('text-sm font-medium', isActive ? 'text-brand' : 'text-foreground')}>{screen.label}</p>
                    <p className="mt-0.5 hidden text-xs text-muted-foreground lg:block">{screen.description}</p>
                  </div>
                </button>
              )
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <DashboardMockup config={active.config} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
