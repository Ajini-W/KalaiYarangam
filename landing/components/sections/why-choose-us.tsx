import { Reveal } from "@/components/reveal";
import {
  Check,
  Users,
  Wallet,
  Bell,
  BarChart3,
  ShieldCheck,
  Layers,
  HeadphonesIcon,
} from "lucide-react";

const reasons = [
  {
    icon: Users,
    title: "Purpose-Built for Academies",
    description:
      "Not a generic CRM - built specifically for training institutes, rentals, and events.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Wallet,
    title: "Automated Fee Collection",
    description:
      "WhatsApp reminders, payment links, and receipts - all on autopilot.",
    color: "bg-accent-blue/10 text-accent-blue",
  },
  {
    icon: Bell,
    title: "WhatsApp Automation",
    description:
      "Send attendance updates, fee reminders, and notifications automatically.",
    color: "bg-accent-green/10 text-accent-green",
  },
  {
    icon: BarChart3,
    title: "Real-Time Analytics",
    description:
      "See revenue, attendance, and trends across all branches instantly.",
    color: "bg-accent-cyan/10 text-accent-cyan",
  },
  {
    icon: ShieldCheck,
    title: "Secure & Private",
    description:
      "Role-based access, audit logs, and true multi-tenant isolation.",
    color: "bg-accent-red/10 text-accent-red",
  },
  {
    icon: Layers,
    title: "Multi-Branch Ready",
    description: "Manage unlimited branches from a single dashboard.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: HeadphonesIcon,
    title: "Local Support",
    description:
      "Support in Tamil, Hindi, and English - we understand your business.",
    color: "bg-accent-blue/10 text-accent-blue",
  },
  {
    icon: Check,
    title: "20-Day Free Trial",
    description: "Full access, all modules, no credit card required.",
    color: "bg-accent-green/10 text-accent-green",
  },
];

export function WhyChooseUs() {
  return (
    <section className="px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
            Why Choose Us
          </span>
          <h2 className="mt-5 text-balance font-heading text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Why academies choose kalaiArangam
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            Built by people who understand the academy business.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((reason, i) => (
            <Reveal key={reason.title} delay={(i % 4) * 0.08}>
              <div className="group rounded-2xl border h-59 border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/5">
                <div
                  className={`grid size-11 place-items-center rounded-2xl ${reason.color} transition-transform group-hover:scale-110`}
                >
                  <reason.icon className="size-5" />
                </div>
                <h3 className="mt-4 font-heading text-base font-bold">
                  {reason.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {reason.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
