import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Reveal } from "@/components/reveal";
import { ArrowRight } from "lucide-react";

const useCases = [
  {
    title: "How to collect fees online",
    description:
      "Set up automated payment collection with WhatsApp reminders and instant receipts.",
    category: "Fee Collection",
  },
  {
    title: "How to manage dance students",
    description:
      "Track student progress, attendance, and batch assignments for dance academies.",
    category: "Student Management",
  },
  {
    title: "How to reduce absent students",
    description:
      "Use automated attendance tracking and parent notifications to improve attendance rates.",
    category: "Attendance",
  },
  {
    title: "How to send WhatsApp reminders",
    description:
      "Automate fee reminders, class schedules, and event notifications via WhatsApp.",
    category: "Notifications",
  },
  {
    title: "How to manage academy branches",
    description:
      "Run multiple branches from a single dashboard with consolidated reporting.",
    category: "Branch Management",
  },
  {
    title: "How to manage rentals",
    description:
      "Track inventory, bookings, dispatch, and returns with real-time availability.",
    category: "Rental Business",
  },
  {
    title: "How to generate certificates",
    description:
      "Create professional certificates for students with one-click generation.",
    category: "Student Management",
  },
  {
    title: "How to track enquiries",
    description:
      "Capture leads from WhatsApp, phone, and walk-ins into a unified pipeline.",
    category: "CRM",
  },
  {
    title: "How to manage staff",
    description:
      "Assign roles, track performance, and manage schedules across branches.",
    category: "Staff Management",
  },
  {
    title: "How to manage event bookings",
    description:
      "Handle event enquiries, quotations, budgets, and team assignments.",
    category: "Event Business",
  },
];

export default function UseCasesPage() {
  return (
    <div className="min-h-dvh bg-background">
      <SiteHeader />
      <main className="pt-28 pb-24">
        <div className="mx-auto max-w-6xl px-4">
          <Reveal className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-accent-blue/20 bg-accent-blue/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-accent-blue">
              Use Cases
            </span>
            <h1 className="mt-5 text-balance font-heading text-4xl font-bold tracking-tight sm:text-5xl">
              Real business problems, solved
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              Every page answers a real business problem - not just promotes a
              product.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-4 sm:grid-cols-2">
            {useCases.map((uc, i) => (
              <Reveal key={i} delay={(i % 2) * 0.06}>
                <a
                  href={`/use-cases#${uc.title.toLowerCase().replace(/\s+/g, "-")}`}
                  className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/5 hover:border-primary/20"
                >
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                      {uc.category}
                    </span>
                    <h3 className="mt-1 font-heading text-base font-bold group-hover:text-primary transition-colors">
                      {uc.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {uc.description}
                    </p>
                  </div>
                  <ArrowRight className="size-4 shrink-0 mt-2 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
