import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Reveal } from "@/components/reveal";
import {
  Users,
  ClipboardList,
  Wallet,
  CalendarDays,
  MessageSquare,
  Package,
  CalendarCheck,
  FileText,
  Smartphone,
  BarChart3,
  ArrowRight,
} from "lucide-react";

const groups = [
  {
    category: "Admissions",
    features: [
      {
        icon: Users,
        name: "Student Management",
        desc: "Track every student from enquiry to graduation",
        href: "/features/student-management",
      },
      {
        icon: ClipboardList,
        name: "Attendance",
        desc: "Mark attendance in seconds from any device",
        href: "/features/student-attendance",
      },
      {
        icon: Wallet,
        name: "Fee Collection",
        desc: "Automated reminders and payment links",
        href: "/features/fee-collection",
      },
      {
        icon: CalendarDays,
        name: "Batch Scheduling",
        desc: "Manage classes, trainers, and rooms",
        href: "/features/batch-scheduling",
      },
      {
        icon: MessageSquare,
        name: "WhatsApp Notifications",
        desc: "Instant updates to parents and students",
        href: "/features/whatsapp-notifications",
      },
    ],
  },
  {
    category: "Inventory",
    features: [
      {
        icon: Package,
        name: "Rental Booking",
        desc: "Real-time availability and booking calendar",
        href: "/features/rental-booking",
      },
      {
        icon: CalendarCheck,
        name: "Event Planning",
        desc: "From enquiry to closure report",
        href: "/features/event-planning",
      },
    ],
  },
  {
    category: "Operations",
    features: [
      {
        icon: FileText,
        name: "Reports",
        desc: "Revenue, attendance, and utilization reports",
        href: "/features/reports",
      },
      {
        icon: Smartphone,
        name: "Mobile App",
        desc: "Manage everything from your phone",
        href: "/features/mobile-app",
      },
      {
        icon: BarChart3,
        name: "Analytics",
        desc: "Smart insights for better decisions",
        href: "/features/analytics",
      },
    ],
  },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-dvh bg-background">
      <SiteHeader />
      <main className="pt-28 pb-24">
        <div className="mx-auto max-w-6xl px-4">
          <Reveal className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-accent-green/20 bg-accent-green/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-accent-green">
              Features
            </span>
            <h1 className="mt-5 text-balance font-heading text-4xl font-bold tracking-tight sm:text-5xl">
              Everything you need
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              Grouped by what matters most - not a list of 100 features.
            </p>
          </Reveal>

          <div className="mt-14 space-y-12">
            {groups.map((group, gi) => (
              <Reveal key={group.category} delay={gi * 0.1}>
                <h2 className="font-heading text-2xl font-bold mb-6">
                  {group.category}
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {group.features.map((f) => (
                    <a
                      key={f.name}
                      href={f.href}
                      className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/5 hover:border-primary/20"
                    >
                      <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                        <f.icon className="size-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold group-hover:text-primary transition-colors">
                          {f.name}
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {f.desc}
                        </p>
                      </div>
                      <ArrowRight className="size-4 shrink-0 mt-1 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </a>
                  ))}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
