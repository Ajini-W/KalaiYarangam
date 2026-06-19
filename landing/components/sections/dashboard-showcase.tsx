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
import { DashboardMockup } from '@/components/dashboard-mockup'
import { SectionHeading } from '@/components/section-heading'
import { cn } from '@/lib/utils'

const screens = [
  {
    id: 'owner',
    icon: Crown,
    label: 'Owner Dashboard',
    title: 'Business Performance',
  },
  {
    id: 'branch',
    icon: Building2,
    label: 'Branch Dashboard',
    title: 'Branch Operations',
  },
  {
    id: 'trainer',
    icon: Dumbbell,
    label: 'Trainer Dashboard',
    title: 'Batches & Attendance',
  },
  {
    id: 'event',
    icon: CalendarHeart,
    label: 'Event Dashboard',
    title: 'Event Pipeline',
  },
  {
    id: 'rental',
    icon: Package,
    label: 'Rental Dashboard',
    title: 'Inventory & Bookings',
  },
]

export function DashboardShowcase() {
  const [active, setActive] = useState(screens[0])

  return (
    <section className="border-y border-border bg-muted/30 px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Dashboard Showcase"
          title="A tailored view for every role"
          description="Owners, branch managers, trainers, and coordinators each get a focused dashboard built around their day."
        />

        <div className="mt-12 grid gap-8 lg:grid-cols-[260px_1fr]">
          <div className="flex flex-wrap gap-2 lg:flex-col">
            {screens.map((screen) => {
              const isActive = screen.id === active.id
              return (
                <button
                  key={screen.id}
                  onClick={() => setActive(screen)}
                  className={cn(
                    'flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all',
                    isActive
                      ? 'border-brand/40 bg-brand/10 text-brand'
                      : 'border-border bg-card text-muted-foreground hover:text-foreground',
                  )}
                >
                  <screen.icon className="size-4 shrink-0" />
                  <span className="hidden sm:inline">{screen.label}</span>
                  <span className="sm:hidden">
                    {screen.label.split(' ')[0]}
                  </span>
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
              <DashboardMockup role={active.label} title={active.title} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
