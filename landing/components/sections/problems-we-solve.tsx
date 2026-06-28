import { Reveal } from "@/components/reveal";
import { X } from "lucide-react";

const problems = [
  {
    problem: "Tracking fees in WhatsApp messages and Excel sheets",
    solution: "Automated fee collection with payment links and receipts",
  },
  {
    problem: "Double-bookings for classes and equipment",
    solution: "Real-time availability calendar across all branches",
  },
  {
    problem: "No visibility into daily revenue or attendance",
    solution: "Live dashboards showing revenue, attendance, and trends",
  },
  {
    problem: "Following up on student enquiries manually",
    solution: "Lead pipeline with automated WhatsApp reminders",
  },
  {
    problem: "Managing staff schedules across multiple branches",
    solution: "Centralized staff management with role-based access",
  },
  {
    problem: "Generating certificates and reports by hand",
    solution: "One-click certificate generation and report export",
  },
];

export function ProblemsWeSolve() {
  return (
    <section className="relative overflow-hidden bg-surface-alt px-4 py-24">
      <div
        className="absolute -right-20 top-1/4 h-48 w-48 rounded-full bg-accent-red/5 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute -left-16 bottom-1/3 h-36 w-36 rounded-full bg-primary/5 blur-3xl"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-6xl">
        <Reveal className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-accent-red/20 bg-accent-red/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-accent-red">
            Problems We Solve
          </span>
          <h2 className="mt-5 text-balance font-heading text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Stop juggling spreadsheets, WhatsApp and manual registers
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            Every problem you face daily - kalaiArangam already has a solution.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {problems.map((item, i) => (
            <Reveal key={i} delay={(i % 3) * 0.08}>
              <div className="group rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/5">
                <div className="flex items-start gap-3">
                  <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-accent-red/10 text-accent-red">
                    <X className="size-4" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground line-through decoration-accent-red/40">
                    {item.problem}
                  </p>
                </div>
                <div className="mt-4 flex items-start gap-3">
                  <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-accent-green/10 text-accent-green">
                    <span className="text-sm">✓</span>
                  </div>
                  <p className="text-sm font-semibold">{item.solution}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
