"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Building2,
  CalendarCheck,
  CalendarDays,
  CreditCard,
  GraduationCap,
  Heart,
  Layers,
  Package,
  Users,
  Warehouse,
} from "lucide-react";
import { DashboardMockup } from "@/components/dashboard-mockup";

const heroFeatures = [
  {
    icon: GraduationCap,
    label: "Student Management",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Package,
    label: "Rental Management",
    color: "bg-accent-blue/10 text-accent-blue",
  },
  {
    icon: CalendarCheck,
    label: "Event Management",
    color: "bg-accent-red/10 text-accent-red",
  },
  {
    icon: Building2,
    label: "Multi-Branch Ops",
    color: "bg-accent-cyan/10 text-accent-cyan",
  },
  {
    icon: CreditCard,
    label: "Billing & Payments",
    color: "bg-accent-green/10 text-accent-green",
  },
  {
    icon: BarChart3,
    label: "Reports & Analytics",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: CalendarDays,
    label: "Calendar & Resource Scheduling",
    color: "bg-accent-blue/10 text-accent-blue",
  },
  {
    icon: Warehouse,
    label: "Inventory & Asset Management",
    color: "bg-accent-red/10 text-accent-red",
  },
  {
    icon: BarChart3,
    label: "Dashboard & Business Insights",
    color: "bg-accent-green/10 text-accent-green",
  }
];

export function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden px-4 pb-20 pt-32 sm:pt-40"
    >
      {/* Colorful background */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-surface-alt via-background to-background" />
        <div className="absolute left-[10%] top-[5%] h-[500px] w-[500px] rounded-full bg-primary/8 blur-[120px]" />
        <div className="absolute right-[5%] top-[10%] h-[400px] w-[400px] rounded-full bg-accent-blue/8 blur-[120px]" />
        <div className="absolute left-[40%] top-[30%] h-[300px] w-[300px] rounded-full bg-accent-red/6 blur-[100px]" />
        {/* Decorative shapes */}
        <div className="absolute left-[8%] top-[20%] size-16 rounded-2xl bg-primary/10 rotate-12 animate-float" />
        <div className="absolute right-[12%] top-[15%] size-12 rounded-full bg-accent-blue/10 animate-float-delayed" />
        <div className="absolute left-[20%] bottom-[30%] size-10 rounded-xl bg-accent-red/10 -rotate-12 animate-float-slow" />
        <div className="absolute right-[15%] bottom-[25%] size-14 rounded-2xl bg-accent-cyan/10 rotate-45 animate-float" />
        <div className="absolute left-[50%] top-[8%] size-8 rounded-full bg-accent-green/10 animate-float-delayed" />
      </div>

      <div className="mx-auto max-w-5xl text-center">
        {/* <motion.a
          href="#platform"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2.5 rounded-full border border-primary/20 bg-primary/5 px-5 py-2 text-sm font-medium text-primary backdrop-blur-sm transition-all hover:bg-primary/10 hover:shadow-md hover:shadow-primary/10"
        >
          <span
            className="size-1.5 rounded-full bg-accent-green animate-pulse"
            aria-hidden="true"
          />
          Multi-tenant SaaS ERP - built for Indian businesses
          <ArrowRight className="size-3.5" />
        </motion.a> */}

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05 }}
          className="mx-auto mt-8 max-w-4xl text-balance font-heading text-4xl font-extrabold leading-[1.02] tracking-tight sm:text-5xl md:text-6xl"
        >
          Manage your entire business from{" "}
          <span className="text-gradient">one platform</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.12 }}
          className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"
        >
          kalaiArangam helps Training Institutes, Rental Businesses, and Event
          Companies manage leads, operations, teams, payments, and analytics
          from a single cloud platform.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.18 }}
          className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4"
        >
          <a
            href="https://sarran.formaloo.co/zpwci7"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex h-12 w-full items-center justify-center gap-2 whitespace-nowrap rounded-2xl px-6 text-base font-semibold text-white shadow-lg shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:h-14 sm:w-auto sm:px-8 sm:text-lg"
            style={{ background: 'linear-gradient(135deg, #FFB21D 0%, #FF8A00 100%)' }}
          >
            <Heart className="size-4 shrink-0 sm:size-5" />
            Join Wishlist
          </a>
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
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium backdrop-blur-sm sm:text-sm ${f.color}`}
            >
              <f.icon className="size-3.5" aria-hidden="true" />
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
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -left-6 top-16 hidden rounded-2xl border border-primary/20 bg-white p-4 shadow-xl shadow-primary/5 backdrop-blur-xl md:block dark:bg-card"
        >
          <div className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-lg bg-primary/10 text-primary">
              <GraduationCap className="size-4" />
            </span>
            <div>
              <p className="text-[10px] text-muted-foreground">
                New Enrollment
              </p>
              <p className="text-sm font-semibold">+38 this week</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          animate={{ y: [0, 14, 0] }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute -right-6 bottom-20 hidden rounded-2xl border border-accent-green/20 bg-white p-4 shadow-xl shadow-accent-green/5 backdrop-blur-xl md:block dark:bg-card"
        >
          <div className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-lg bg-accent-green/10 text-accent-green">
              <CreditCard className="size-4" />
            </span>
            <div>
              <p className="text-[10px] text-muted-foreground">
                Payment received
              </p>
              <p className="text-sm font-semibold text-accent-green">₹24,500</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
