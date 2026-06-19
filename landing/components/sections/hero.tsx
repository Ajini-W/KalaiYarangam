"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Building2,
  CalendarCheck,
  CreditCard,
  GraduationCap,
  Package,
  PlayCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardMockup } from "@/components/dashboard-mockup";

const heroFeatures = [
  { icon: GraduationCap, label: "Student Management" },
  { icon: Package, label: "Rental Management" },
  { icon: CalendarCheck, label: "Event Management" },
  { icon: Building2, label: "Multi-Branch Ops" },
  { icon: CreditCard, label: "Billing & Payments" },
  { icon: BarChart3, label: "Reports & Analytics" },
];

export function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden px-4 pb-20 pt-32 sm:pt-40"
    >
      {/* Gradient lighting */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-10%] h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-brand/25 blur-[130px]" />
        <div className="absolute right-[8%] top-[20%] h-[320px] w-[320px] rounded-full bg-accent-cyan/20 blur-[110px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_55%,var(--background)_100%)]" />
      </div>

      <div className="mx-auto max-w-5xl text-center">
        <motion.a
          href="#platform"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5 text-sm text-muted-foreground backdrop-blur transition-colors hover:text-foreground"
        >
          <span className="size-1.5 rounded-full bg-success" />
          Multi-tenant SaaS ERP — built for Indian businesses
          <ArrowRight className="size-3.5" />
        </motion.a>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="mx-auto mt-6 max-w-4xl text-balance font-heading text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl"
        >
          Manage your entire business from{" "}
          <span className="text-gradient">one platform</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.12 }}
          className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"
        >
          KalaiYarangam helps Training Institutes, Rental Businesses, and Event
          Companies manage leads, operations, teams, payments, and analytics
          from a single cloud platform.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.18 }}
          className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Button
            size="lg"
            // asChild
            className="h-12 w-full bg-brand px-7 text-base text-brand-foreground hover:bg-brand/90 sm:w-auto"
          >
            <a href="#pricing">
              Start 15-Day Free Trial
              <ArrowRight className="size-4" />
            </a>
          </Button>
          <Button
            size="lg"
            variant="outline"
            // asChild
            className="h-12 w-full px-7 text-base sm:w-auto"
          >
            <a href="#demo">
              <PlayCircle className="size-4" />
              Book Demo
            </a>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.26 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-2.5"
        >
          {heroFeatures.map((f) => (
            <span
              key={f.label}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3.5 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur sm:text-sm"
            >
              <f.icon className="size-3.5 text-brand" />
              {f.label}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Dashboard mockup with floating cards */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="relative mx-auto mt-16 max-w-5xl"
      >
        <DashboardMockup />

        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -left-4 top-16 hidden rounded-xl border border-border bg-card/90 p-3 shadow-xl backdrop-blur md:block"
        >
          <p className="text-[10px] text-muted-foreground">New Enrollment</p>
          <p className="text-sm font-semibold">+38 this week</p>
        </motion.div>

        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute -right-4 bottom-20 hidden rounded-xl border border-border bg-card/90 p-3 shadow-xl backdrop-blur md:block"
        >
          <p className="text-[10px] text-muted-foreground">Payment received</p>
          <p className="text-sm font-semibold text-success">₹24,500</p>
        </motion.div>
      </motion.div>
    </section>
  );
}
