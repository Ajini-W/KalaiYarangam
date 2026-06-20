'use client'

import { motion } from 'framer-motion'
import {
  ArrowRight,
  BarChart3,
  Building2,
  CalendarCheck,
  CreditCard,
  GraduationCap,
  Package,
  PlayCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DashboardMockup } from '@/components/dashboard-mockup'

const heroFeatures = [
  { icon: GraduationCap, label: 'Student Management' },
  { icon: Package, label: 'Rental Management' },
  { icon: CalendarCheck, label: 'Event Management' },
  { icon: Building2, label: 'Multi-Branch Ops' },
  { icon: CreditCard, label: 'Billing & Payments' },
  { icon: BarChart3, label: 'Reports & Analytics' },
]

export function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden px-4 pb-20 pt-32 sm:pt-40"
    >
      {/* Gradient orbs background */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-15%] h-[700px] w-[1000px] -translate-x-1/2 rounded-full bg-brand/20 blur-[160px]" />
        <div className="absolute right-[5%] top-[15%] h-[400px] w-[400px] rounded-full bg-accent-cyan/15 blur-[140px]" />
        <div className="absolute left-[10%] top-[40%] h-[300px] w-[300px] rounded-full bg-brand-2/15 blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,var(--background)_100%)]" />
      </div>

      <div className="mx-auto max-w-5xl text-center">
        <motion.a
          href="#platform"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2.5 rounded-full border border-border bg-card/60 px-5 py-2 text-sm text-muted-foreground backdrop-blur-sm transition-colors hover:text-foreground"
        >
          <span className="size-1.5 rounded-full bg-success animate-pulse" aria-hidden="true" />
          Multi-tenant SaaS ERP — built for Indian businesses
          <ArrowRight className="size-3.5" />
        </motion.a>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05 }}
          className="mx-auto mt-8 max-w-4xl text-balance font-heading text-4xl font-extrabold leading-[1.02] tracking-tight sm:text-5xl md:text-6xl"
        >
          Manage your entire business from{' '}
          <span className="text-gradient">one platform</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.12 }}
          className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"
        >
          KalaiYarangam helps Training Institutes, Rental Businesses, and Event
          Companies manage leads, operations, teams, payments, and analytics
          from a single cloud platform.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.18 }}
          className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Button
            size="lg"
            asChild
            className="w-full px-8 text-base sm:w-auto"
          >
            <a href="#pricing">
              Start 20-Day Free Trial
              <ArrowRight className="size-4" />
            </a>
          </Button>
          <Button
            size="lg"
            variant="outline"
            asChild
            className="w-full px-8 text-base sm:w-auto"
          >
            <a href="#contact">
              <PlayCircle className="size-4" />
              Book Demo
            </a>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.26 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-2.5"
        >
          {heroFeatures.map((f) => (
            <span
              key={f.label}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-2 text-xs font-medium text-muted-foreground backdrop-blur-sm sm:text-sm"
            >
              <f.icon className="size-3.5 text-brand" aria-hidden="true" />
              {f.label}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Dashboard mockup with floating cards */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="relative mx-auto mt-20 max-w-5xl"
        aria-hidden="true"
      >
        <div className="glow-brand rounded-2xl">
          <DashboardMockup />
        </div>

        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -left-6 top-16 hidden rounded-xl border border-border bg-card/90 p-3.5 shadow-2xl backdrop-blur-xl md:block"
        >
          <p className="text-[10px] text-muted-foreground">New Enrollment</p>
          <p className="text-sm font-semibold">+38 this week</p>
        </motion.div>

        <motion.div
          animate={{ y: [0, 14, 0] }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
          className="absolute -right-6 bottom-20 hidden rounded-xl border border-border bg-card/90 p-3.5 shadow-2xl backdrop-blur-xl md:block"
        >
          <p className="text-[10px] text-muted-foreground">Payment received</p>
          <p className="text-sm font-semibold text-success">₹24,500</p>
        </motion.div>
      </motion.div>
    </section>
  )
}
