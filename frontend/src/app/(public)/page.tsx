import Link from "next/link";
import {
  GraduationCap,
  ShoppingBag,
  CalendarCheck,
  Users,
  BarChart2,
  Bell,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

const modules = [
  {
    icon: <GraduationCap size={28} className="text-brand-500" />,
    title: "Training Management",
    desc: "Manage leads, batches, students, attendance, fees, and certificates for any coaching or academy.",
    features: [
      "Lead pipeline & follow-ups",
      "Batch scheduling",
      "Fee collection & receipts",
      "Certificates & progress tracking",
    ],
  },
  {
    icon: <ShoppingBag size={28} className="text-brand-500" />,
    title: "Rental Management",
    desc: "End-to-end inventory rental — from booking and dispatch to return and damage assessment.",
    features: [
      "Inventory & availability calendar",
      "Quotations & booking confirmations",
      "Dispatch & return workflows",
      "Damage penalty handling",
    ],
  },
  {
    icon: <CalendarCheck size={28} className="text-brand-500" />,
    title: "Event Management",
    desc: "Plan, execute, and close events with full budget tracking, team tasks, and client approvals.",
    features: [
      "Proposal & quote approval",
      "WBS task boards",
      "Budget vs actual tracking",
      "Event closure & final billing",
    ],
  },
];

const stats = [
  { value: "3 Modules", label: "Training · Rental · Events" },
  { value: "15-Day Trial", label: "Full features, no card needed" },
  { value: "Multi-tenant", label: "Isolated per business" },
  { value: "Mobile-first", label: "Runs on any device" },
];

const industries = [
  "Dance Academies",
  "Karate Centers",
  "Yoga Studios",
  "Music Schools",
  "Costume Rentals",
  "Sound & Light Rental",
  "Wedding Planners",
  "Event Companies",
  "Photography Studios",
  "Coding Academies",
  "Tuition Centers",
  "Driving Schools",
];

export default function LandingPage() {
  return (
    <div className="bg-surface text-text-primary min-h-screen">
      {/* ── Navbar ── */}
      <header className="border-border bg-surface/95 sticky top-0 z-40 border-b backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="text-brand-600 text-xl font-bold">KalaiArangam</span>
          <nav className="text-text-secondary hidden items-center gap-6 text-sm md:flex">
            <a href="#modules" className="hover:text-text-primary transition-colors">
              Modules
            </a>
            <a href="#industries" className="hover:text-text-primary transition-colors">
              Industries
            </a>
            <a href="#pricing" className="hover:text-text-primary transition-colors">
              Pricing
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-text-secondary hover:text-text-primary text-sm font-medium transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="bg-brand-500 hover:bg-brand-600 inline-flex h-9 items-center rounded-[var(--radius-md)] px-4 text-sm font-semibold text-white transition-colors"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="mx-auto max-w-6xl px-6 py-20 text-center">
        <span className="border-brand-200 bg-brand-50 text-brand-600 mb-6 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold">
          ✨ 15-Day Free Trial — No Credit Card
        </span>
        <h1 className="text-text-primary text-4xl leading-tight font-bold tracking-tight sm:text-5xl lg:text-6xl">
          One platform for
          <br />
          <span className="text-brand-600">Training, Rental & Events</span>
        </h1>
        <p className="text-text-secondary mx-auto mt-6 max-w-2xl text-lg">
          KalaiArangam is a multi-tenant SaaS ERP built for academies, rental shops, and event
          companies. Replace spreadsheets and WhatsApp chaos with structured workflows.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/register"
            className="bg-brand-500 hover:bg-brand-600 inline-flex h-11 items-center gap-2 rounded-[var(--radius-md)] px-6 text-sm font-semibold text-white transition-colors"
          >
            Get Started Free <ArrowRight size={16} />
          </Link>
          <Link
            href="/login"
            className="border-border text-text-primary hover:bg-surface-raised inline-flex h-11 items-center rounded-[var(--radius-md)] border px-6 text-sm font-semibold transition-colors"
          >
            Sign In
          </Link>
        </div>

        {/* Stats bar */}
        <div className="border-border bg-surface-raised mx-auto mt-14 grid max-w-3xl grid-cols-2 gap-6 rounded-[var(--radius-lg)] border p-6 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.value} className="text-center">
              <p className="text-brand-600 text-lg font-bold">{s.value}</p>
              <p className="text-text-secondary text-xs">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Modules ── */}
      <section id="modules" className="bg-surface-raised py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12 text-center">
            <h2 className="text-text-primary text-3xl font-bold">Everything your business needs</h2>
            <p className="text-text-secondary mt-3">Subscribe only to the modules you use.</p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {modules.map((m) => (
              <div
                key={m.title}
                className="border-border bg-surface rounded-[var(--radius-lg)] border p-6 shadow-[var(--shadow-1)] transition-shadow hover:shadow-[var(--shadow-2)]"
              >
                <div className="bg-brand-50 mb-4 inline-flex rounded-[var(--radius-md)] p-3">
                  {m.icon}
                </div>
                <h3 className="text-text-primary text-lg font-semibold">{m.title}</h3>
                <p className="text-text-secondary mt-2 text-sm">{m.desc}</p>
                <ul className="mt-4 space-y-2">
                  {m.features.map((f) => (
                    <li key={f} className="text-text-secondary flex items-center gap-2 text-sm">
                      <CheckCircle2 size={14} className="text-success shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Industries ── */}
      <section id="industries" className="py-20">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <h2 className="text-text-primary text-3xl font-bold">Built for your industry</h2>
          <p className="text-text-secondary mt-3">Purpose-built workflows — not generic CRM.</p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {industries.map((ind) => (
              <span
                key={ind}
                className="border-border bg-surface-raised text-text-secondary hover:border-brand-400 hover:text-brand-600 cursor-default rounded-full border px-4 py-1.5 text-sm transition-colors"
              >
                {ind}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="bg-surface-raised py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-text-primary text-3xl font-bold">Simple, transparent pricing</h2>
          <p className="text-text-secondary mt-3">
            Subscribe per module. Save more on longer plans.
          </p>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              { plan: "Monthly", discount: "0%", note: "Billed monthly", popular: false },
              { plan: "6 Months", discount: "10%", note: "Billed biannually", popular: true },
              { plan: "12 Months", discount: "20%", note: "Billed annually", popular: false },
            ].map((p) => (
              <div
                key={p.plan}
                className={`relative rounded-[var(--radius-lg)] border p-6 text-left ${p.popular ? "border-brand-500 shadow-[var(--shadow-2)]" : "border-border bg-surface"}`}
              >
                {p.popular && (
                  <span className="bg-brand-500 absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-0.5 text-xs font-semibold text-white">
                    Most Popular
                  </span>
                )}
                <h3 className="text-text-primary text-base font-semibold">{p.plan}</h3>
                <p className="text-brand-600 mt-1 text-2xl font-bold">{p.discount} off</p>
                <p className="text-text-secondary mt-1 text-xs">{p.note}</p>
              </div>
            ))}
          </div>
          <Link
            href="/register"
            className="bg-brand-500 hover:bg-brand-600 mt-10 inline-flex h-11 items-center gap-2 rounded-[var(--radius-md)] px-8 text-sm font-semibold text-white transition-colors"
          >
            Start 15-Day Free Trial <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-border border-t py-10 text-center">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 sm:flex-row sm:justify-between">
          <span className="text-brand-600 text-base font-bold">KalaiArangam</span>
          <div className="text-text-secondary flex gap-6 text-sm">
            <a href="#" className="hover:text-text-primary transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-text-primary transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-text-primary transition-colors">
              Contact
            </a>
          </div>
          <p className="text-text-disabled text-xs">© 2026 KalaiArangam. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
