import { Reveal } from "@/components/reveal";
import { UserPlus, Building2, LayoutGrid, Users, Rocket } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Create Account",
    description: "Sign up in seconds - no credit card required.",
    color: "bg-primary/10 text-primary",
    number: "bg-primary text-primary-foreground",
  },
  {
    icon: Building2,
    title: "Set Up Your Buisness",
    description: "Add your branches, staff, and branding.",
    color: "bg-accent-blue/10 text-accent-blue",
    number: "bg-accent-blue text-white",
  },
  {
    icon: LayoutGrid,
    title: "Import Your Data",
    description: "Add customers, students, inventory, events, or existing records.",
    color: "bg-accent-red/10 text-accent-red",
    number: "bg-accent-red text-white",
  },
  {
    icon: Users,
    title: "Manage Daily Ops",
    description: "Attendance, fees, notifications - all automated.",
    color: "bg-accent-green/10 text-accent-green",
    number: "bg-accent-green text-white",
  },
  {
    icon: Rocket,
    title: "Grow Your Business",
    description: "Analytics, reports, and smart insights.",
    color: "bg-accent-cyan/10 text-accent-cyan",
    number: "bg-accent-cyan text-white",
  },
];

export function HowItWorks() {
  return (
    <section className="px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-accent-blue/20 bg-accent-blue/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-accent-blue">
            How It Works
          </span>
          <h2 className="mt-5 text-balance font-heading text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            How kalaiArangam Works
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            From sign-up to live operations in five simple steps.
          </p>
        </Reveal>

        <div className="relative mt-16">
          <div
            aria-hidden="true"
           className="absolute left-14 right-14 top-7 hidden h-px bg-gradient-to-r from-primary/20 via-accent-blue/20 to-accent-cyan/20 lg:block"
          />
          <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
            {steps.map((step, i) => (
              <Reveal key={step.title} delay={i * 0.1} as="li">
                <div className="relative flex flex-col items-center text-center lg:items-start lg:text-left">
                  <div
                    className={`relative z-10 grid size-14 place-items-center rounded-2xl border border-border bg-card shadow-sm ${step.color}`}
                  >
                    <step.icon className="size-6" />
                    <span
                      className={`absolute -right-2 -top-2 grid size-6 place-items-center rounded-full text-xs font-bold shadow-md ${step.number}`}
                    >
                      {i + 1}
                    </span>
                  </div>
                  <h3 className="mt-5 font-heading text-base font-bold">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
