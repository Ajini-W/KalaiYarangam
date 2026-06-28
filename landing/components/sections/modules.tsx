"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  Check,
  GraduationCap,
  Package,
  PartyPopper,
} from "lucide-react";

const modules = [
  {
    id: "training",
    tab: "Training",
    icon: GraduationCap,
    title: "Training Management",
    description:
      "Run your academy end to end — capture enquiries, enroll students, schedule batches, track attendance, and collect fees automatically.",
    features: [
      "Lead Management",
      "Student Enrollment",
      "Batch Scheduling",
      "Attendance Tracking",
      "Fee Collection",
      "Progress Reports",
      "Certification",
    ],
    rows: [
      { name: "Bharatanatyam — Batch A", meta: "24 students", tag: "Active" },
      { name: "Vocal Music — Evening", meta: "18 students", tag: "Active" },
      { name: "Yoga — Weekend", meta: "31 students", tag: "Enrolling" },
    ],
    color: "#F5A623",
    iconBg: "bg-primary/10 text-primary",
    tagColor: "bg-primary/10 text-primary",
  },
  {
    id: "rental",
    tab: "Rental",
    icon: Package,
    title: "Rental Management",
    description:
      "Track every asset from booking to return. Know what is available, dispatched, or under maintenance in real time.",
    features: [
      "Inventory Management",
      "Availability Calendar",
      "Booking Management",
      "Dispatch Tracking",
      "Return Processing",
      "Damage Assessment",
    ],
    rows: [
      { name: "Stage Lighting Kit", meta: "Out — returns Sat", tag: "Booked" },
      { name: "Costume Set — Royal", meta: "Available ×6", tag: "Ready" },
      { name: "Sound System Pro", meta: "Maintenance", tag: "Service" },
    ],
    color: "#0099FF",
    iconBg: "bg-accent-blue/10 text-accent-blue",
    tagColor: "bg-accent-blue/10 text-accent-blue",
  },
  {
    id: "event",
    tab: "Event",
    icon: PartyPopper,
    title: "Event Management",
    description:
      "Plan and deliver flawless events — from the first enquiry and quotation to team assignment, budgets, and closure reports.",
    features: [
      "Lead Tracking",
      "Quotation Builder",
      "Team Assignment",
      "Task Management",
      "Budget Monitoring",
      "Event Closure Reports",
    ],
    rows: [
      { name: "Sharma Wedding", meta: "₹4.2L budget", tag: "Planning" },
      { name: "Corporate Gala", meta: "12 tasks open", tag: "On Track" },
      { name: "Annual Day Show", meta: "Quote sent", tag: "Pending" },
    ],
    color: "#FF4D6A",
    iconBg: "bg-accent-red/10 text-accent-red",
    tagColor: "bg-accent-red/10 text-accent-red",
  },
];

export function Modules() {
  const [active, setActive] = useState(modules[0]);
  const activeIndex = modules.findIndex((m) => m.id === active.id);
  const manualRef = useRef(false);
  const manualTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-cycle every 2.5s unless user manually picked
  useEffect(() => {
    const interval = setInterval(() => {
      if (!manualRef.current) {
        setActive((prev) => {
          const idx = modules.findIndex((m) => m.id === prev.id);
          return modules[(idx + 1) % modules.length];
        });
      }
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  function handleTabClick(m: (typeof modules)[0]) {
    setActive(m);
    manualRef.current = true;
    if (manualTimerRef.current) clearTimeout(manualTimerRef.current);
    manualTimerRef.current = setTimeout(() => {
      manualRef.current = false;
    }, 20000);
  }

  return (
    <section id="modules" className="scroll-mt-24 px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-accent-green/20 bg-accent-green/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-accent-green">
            Product Modules
          </span>
          <h2 className="mt-5 text-balance font-heading text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Powerful modules that work the way you do
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            Activate only what you need. Every module is purpose-built and fully integrated with billing, CRM, and analytics.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="mt-14 flex justify-center">
          <div className="relative inline-flex items-center gap-2 rounded-2xl border border-border bg-card p-1.5 shadow-sm">
            {modules.map((m) => {
              const isActive = m.id === active.id;
              return (
                <button
                  key={m.id}
                  onClick={() => handleTabClick(m)}
                  className={`relative flex items-center gap-2.5 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                    isActive
                      ? "shadow-lg"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                  style={
                    isActive
                      ? {
                          color: "#fff",
                          background: m.color,
                          boxShadow: `0 4px 20px ${m.color}35, 0 0 0 1px ${m.color}20`,
                        }
                      : undefined
                  }
                >
                  <m.icon className="size-4" />
                  <span>{m.tab}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Card */}
        <div className="mt-10">
          <div
            key={active.id}
            className="grid items-center gap-8 rounded-3xl border bg-card p-6 sm:p-10 lg:grid-cols-2"
            style={{ borderColor: `${active.color}20` }}
          >
            <div>
              <div
                className="grid size-12 place-items-center rounded-2xl"
                style={{ background: `${active.color}15`, color: active.color }}
              >
                <active.icon className="size-6" />
              </div>
              <h3 className="mt-5 font-heading text-2xl font-bold">
                {active.title}
              </h3>
              <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
                {active.description}
              </p>
              <ul className="mt-6 grid grid-cols-2 gap-2.5">
                {active.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2 text-sm text-foreground/70"
                  >
                    <span
                      className="grid size-5 place-items-center rounded-full"
                      style={{ background: `${active.color}15`, color: active.color }}
                    >
                      <Check className="size-3" />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href="#pricing"
                className="mt-7 inline-flex h-12 items-center justify-center gap-2.5 whitespace-nowrap rounded-2xl px-7 text-base font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                style={{ background: `linear-gradient(135deg, ${active.color} 0%, ${active.color}CC 100%)`, boxShadow: `0 4px 14px ${active.color}30` }}
              >
                Explore {active.tab}
                <ArrowRight className="size-5 shrink-0" />
              </a>
            </div>

            {/* Module Preview */}
            <div className="rounded-2xl border border-border bg-surface-alt p-5">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-medium text-foreground/70">
                  {active.title}
                </p>
                <CalendarDays className="size-4 text-muted-foreground" />
              </div>
              <div className="space-y-2.5">
                {active.rows.map((row) => (
                  <div
                    key={row.name}
                    className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3 transition-all hover:shadow-md"
                  >
                    <div>
                      <p className="text-sm font-medium">{row.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {row.meta}
                      </p>
                    </div>
                    <span
                      className="rounded-full px-2.5 py-1 text-xs font-medium"
                      style={{ background: `${active.color}15`, color: active.color }}
                    >
                      {row.tag}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
