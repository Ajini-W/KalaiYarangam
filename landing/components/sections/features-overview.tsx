import { Reveal } from "@/components/reveal";
import {
  Users,
  Wallet,
  BarChart3,
  GraduationCap,
  CalendarDays,
  ClipboardList,
  MessageSquare,
  Package,
  CalendarCheck,
  FileText,
  Smartphone,
  PartyPopper,
  UserCheck,
  CheckSquare,
  Truck,
} from "lucide-react";

const featureGroups = [
  {
    category: "Admissions",
    icon: GraduationCap,
    color: "text-primary",
    features: [
      { icon: Users, name: "Student Management", desc: "Track every student from enquiry to graduation" },
      { icon: ClipboardList, name: "Attendance", desc: "Mark attendance in seconds from any device" },
      { icon: Wallet, name: "Fee Collection", desc: "Automated reminders and payment links" },
      { icon: CalendarDays, name: "Batch Scheduling", desc: "Manage classes, trainers, and rooms" },
      { icon: MessageSquare, name: "WhatsApp Notifications", desc: "Instant updates to parents and students" },
    ],
  },
  {
    category: "Inventory",
    icon: Package,
    color: "text-accent-blue",
    features: [
      { icon: Package, name: "Rental Booking", desc: "Real-time availability and booking calendar" },
      { icon: CalendarCheck, name: "Event Planning", desc: "From enquiry to closure report" },
      { icon: FileText, name: "Reports", desc: "Revenue, attendance, and utilization reports" },
      { icon: Smartphone, name: "Mobile App", desc: "Manage everything from your phone" },
      { icon: BarChart3, name: "Analytics", desc: "Smart insights for better decisions" },
    ],
  },
  {
    category: "Events",
    icon: PartyPopper,
    color: "text-accent-red",
    features: [
      { icon: Users, name: "Event CRM", desc: "Capture every event enquiry and convert leads into confirmed bookings" },
      { icon: UserCheck, name: "Team Management", desc: "Assign coordinators, vendors, and crew with clear responsibilities" },
      { icon: CheckSquare, name: "Task Management", desc: "Track every task, milestone, and event checklist in real time" },
      { icon: Truck, name: "Vendor Management", desc: "Manage suppliers, contracts, and service delivery seamlessly" },
      { icon: Smartphone, name: "Mobile Access", desc: "Manage events, approvals, and updates from anywhere" },
    ],
  },
];

export function FeaturesOverview() {
  return (
    <section
      id="features"
      className="scroll-mt-24 relative overflow-hidden bg-surface-alt px-4 py-24"
    >
      <div
        className="absolute -left-20 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute -right-20 top-1/3 h-32 w-32 rounded-full bg-accent-blue/5 blur-3xl"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-6xl">
        <Reveal className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-accent-green/20 bg-accent-green/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-accent-green">
            Features
          </span>
          <h2 className="mt-5 text-balance font-heading text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Everything you need to run your academy
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            Grouped by what matters most - not a list of 100 features.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-8 lg:grid-cols-3">
          {featureGroups.map((group, gi) => (
            <Reveal key={group.category} delay={gi * 0.1} className="h-full">
              <div className="h-full rounded-3xl border border-border bg-card p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className={`grid size-10 place-items-center rounded-xl bg-muted ${group.color}`}
                  >
                    <group.icon className="size-5" />
                  </div>
                  <h3 className="font-heading text-xl font-bold">
                    {group.category}
                  </h3>
                </div>
                <div className="space-y-4">
                  {group.features.map((f) => (
                    <div
                      key={f.name}
                      className="flex items-center h-20 gap-3 rounded-xl p-3 transition-colors hover:bg-muted/50"
                    >
                      <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground">
                        <f.icon className="size-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{f.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {f.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
