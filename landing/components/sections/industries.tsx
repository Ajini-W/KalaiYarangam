import { Check, GraduationCap, Package, PartyPopper } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { cn } from "@/lib/utils";

const industries = [
  {
    icon: GraduationCap,
    name: "Training Institutes",
    description: "Manage the student lifecycle from enquiry to certification.",
    features: ["Leads", "Enrollments", "Attendance", "Fees", "Certificates"],
    accent: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/20",
    glow: "bg-primary/5",
  },
  {
    icon: Package,
    name: "Rental Businesses",
    description:
      "Manage inventory, bookings, rentals, returns, and maintenance.",
    features: ["Inventory", "Booking Calendar", "Quotations", "Returns"],
    accent: "text-accent-blue",
    bg: "bg-accent-blue/10",
    border: "border-accent-blue/20",
    glow: "bg-accent-blue/5",
  },
  {
    icon: PartyPopper,
    name: "Event Management",
    description: "Manage events from first enquiry to final billing.",
    features: ["CRM", "Quotations", "Planning", "Budget Tracking"],
    accent: "text-accent-red",
    bg: "bg-accent-red/10",
    border: "border-accent-red/20",
    glow: "bg-accent-red/5",
  },
];

export function Industries() {
  return (
    <section id="industries" className="scroll-mt-24 px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Built for your industry"
          title="One platform, three industry-specific workflows"
          description="kalaiArangam adapts to how your business actually operates - no generic templates, no compromise."
        />

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {industries.map((industry, i) => (
            <Reveal key={industry.name} delay={i * 0.1}>
              <div className="group relative h-full overflow-hidden rounded-3xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5">
                <div
                  className={cn(
                    "absolute -right-8 -top-8 size-36 rounded-full blur-3xl transition-opacity",
                    industry.glow,
                  )}
                />
                <div
                  className={cn(
                    "relative grid size-12 place-items-center rounded-2xl border",
                    industry.bg,
                    industry.border,
                  )}
                >
                  <industry.icon className={cn("size-6", industry.accent)} />
                </div>
                <h3 className="mt-5 font-heading text-xl font-bold">
                  {industry.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {industry.description}
                </p>
                <ul className="mt-5 grid grid-cols-2 gap-2">
                  {industry.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-2 text-sm text-foreground/70"
                    >
                      <span
                        className={cn(
                          "grid size-4 place-items-center rounded-full bg-current/10",
                          industry.accent,
                        )}
                      >
                        <Check className="size-2.5" />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
