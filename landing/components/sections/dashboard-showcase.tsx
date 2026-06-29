"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  CalendarHeart,
  Crown,
  Dumbbell,
  Package,
} from "lucide-react";
import { useState } from "react";
import {
  DashboardMockup,
  dashboardConfigs,
  type DashboardConfig,
} from "@/components/dashboard-mockup";
import { SectionHeading } from "@/components/section-heading";
import { cn } from "@/lib/utils";

const screens = [
  {
    id: "owner",
    icon: Crown,
    label: "Owner Dashboard",
    description: "Revenue, students, utilization - full business overview.",
    config: dashboardConfigs.owner,
    activeColor: "border-primary/40 bg-primary/10 text-primary",
  },
  {
    id: "branch",
    icon: Building2,
    label: "Branch Dashboard",
    description: "Branch revenue, staff, attendance, and live batch status.",
    config: dashboardConfigs.branch,
    activeColor: "border-accent-blue/40 bg-accent-blue/10 text-accent-blue",
  },
  {
    id: "trainer",
    icon: Dumbbell,
    label: "Trainer Dashboard",
    description: "Today's classes, attendance rates, and pending marks.",
    config: dashboardConfigs.trainer,
    activeColor: "border-accent-green/40 bg-accent-green/10 text-accent-green",
  },
  {
    id: "event",
    icon: CalendarHeart,
    label: "Event Dashboard",
    description: "Active events, pipeline value, budgets, and task status.",
    config: dashboardConfigs.event,
    activeColor: "border-accent-red/40 bg-accent-red/10 text-accent-red",
  },
  {
    id: "rental",
    icon: Package,
    label: "Rental Dashboard",
    description: "Inventory availability, bookings, dispatch, and returns.",
    config: dashboardConfigs.rental,
    activeColor: "border-accent-cyan/40 bg-accent-cyan/10 text-accent-cyan",
  },
];

export function DashboardShowcase() {
  const [active, setActive] = useState(screens[0]);

  return (
    <section className="relative overflow-hidden border-y border-border bg-surface-alt px-4 py-24">
      <div
        className="absolute -right-24 top-1/4 h-48 w-48 rounded-full bg-primary/5 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute -left-16 bottom-1/3 h-36 w-36 rounded-full bg-accent-blue/5 blur-3xl"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Dashboard Showcase"
          title="A tailored view for every role"
          description="Owners, branch managers, trainers, and coordinators each get a focused dashboard built around their day."
        />

        <div className="mt-12 grid gap-8 lg:grid-cols-[280px_1fr]">
          <div
            role="tablist"
            aria-label="Dashboard views"
            className="flex flex-wrap gap-2 lg:flex-col"
          >
            {screens.map((screen) => {
              const isActive = screen.id === active.id;
              return (
                <button
                  key={screen.id}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActive(screen)}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                    isActive
                      ? screen.activeColor
                      : "border-border bg-card hover:text-foreground hover:shadow-md",
                  )}
                >
                  <screen.icon
                    className={cn(
                      "size-4 shrink-0",
                      isActive ? "currentColor" : "text-muted-foreground",
                    )}
                  />
                  <div className="min-w-0">
                    <p
                      className={cn(
                        "text-sm font-semibold",
                        isActive ? "currentColor" : "text-foreground",
                      )}
                    >
                      {screen.label}
                    </p>
                    <p className="mt-0.5 hidden text-xs text-muted-foreground lg:block">
                      {screen.description}
                    </p>
                  </div>
                </button>
              );
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
  );
}
