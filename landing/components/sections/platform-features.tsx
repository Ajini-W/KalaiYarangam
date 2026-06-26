import {
  BarChart3,
  Bell,
  Layers,
  ShieldCheck,
  Users,
  Wallet,
} from "lucide-react";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: Users,
    title: "CRM",
    description:
      "Capture every enquiry from any channel and convert leads efficiently with automated follow-ups.",
    color: "bg-primary/10 text-primary",
    hoverBorder: "hover:border-primary/30",
  },
  {
    icon: Wallet,
    title: "Finance",
    description:
      "Manage payments, invoices, and collections with integrated billing and reconciliation.",
    color: "bg-accent-blue/10 text-accent-blue",
    hoverBorder: "hover:border-accent-blue/30",
  },
  {
    icon: Bell,
    title: "Notifications",
    description:
      "Reach customers instantly over WhatsApp, Email, SMS, and in-app - fully automated.",
    color: "bg-accent-red/10 text-accent-red",
    hoverBorder: "hover:border-accent-red/30",
  },
  {
    icon: BarChart3,
    title: "Analytics",
    description:
      "Track revenue, attendance, utilization, and profitability with real-time dashboards.",
    color: "bg-accent-green/10 text-accent-green",
    hoverBorder: "hover:border-accent-green/30",
  },
  {
    icon: ShieldCheck,
    title: "Security",
    description:
      "Role-based access control, audit logs, and full activity tracking keep your data safe.",
    color: "bg-accent-cyan/10 text-accent-cyan",
    hoverBorder: "hover:border-accent-cyan/30",
  },
  {
    icon: Layers,
    title: "Multi-Tenant Architecture",
    description:
      "True tenant isolation and elastic scalability built to grow with your business.",
    color: "bg-primary/10 text-primary",
    hoverBorder: "hover:border-primary/30",
  },
];

export function PlatformFeatures() {
  return (
    <section
      id="platform"
      className="scroll-mt-24 relative overflow-hidden border-y border-border bg-surface-alt px-4 py-24"
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
        <SectionHeading
          eyebrow="Platform"
          title="Everything you need to run operations"
          description="A complete operating system for your business - every capability connected, every workflow automated."
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <Reveal
              key={feature.title}
              delay={(i % 3) * 0.08}
              className={`group rounded-3xl border border-border bg-card p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5 ${feature.hoverBorder}`}
            >
              <div
                className={`grid size-11 place-items-center rounded-2xl ${feature.color} transition-transform group-hover:scale-110`}
              >
                <feature.icon className="size-5" />
              </div>
              <h3 className="mt-5 font-heading text-lg font-bold">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
