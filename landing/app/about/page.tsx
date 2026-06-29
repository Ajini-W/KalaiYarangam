import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Reveal } from "@/components/reveal";
import { Target, Users, Heart, Shield } from "lucide-react";

const values = [
  {
    icon: Target,
    title: "Built for Real Businesses",
    description:
      "We understand the academy and rental business because we built this software to solve our own problems.",
  },
  {
    icon: Users,
    title: "Customer First",
    description:
      "Every feature starts with a conversation with our users. We build what you actually need.",
  },
  {
    icon: Heart,
    title: "Made in India",
    description:
      "Built specifically for Indian businesses with support in Tamil, Hindi, and English.",
  },
  {
    icon: Shield,
    title: "Trust & Security",
    description:
      "Your data is protected with enterprise-grade security, role-based access, and audit logs.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-dvh bg-background">
      <SiteHeader />
      <main className="pt-28 pb-24">
        <div className="mx-auto max-w-4xl px-4">
          <Reveal className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
              About
            </span>
            <h1 className="mt-5 text-balance font-heading text-4xl font-bold tracking-tight sm:text-5xl">
              About kalaiArangam
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              One platform to manage your entire academy or business - built by
              people who understand your world.
            </p>
          </Reveal>

          <Reveal className="mt-12">
            <div className="rounded-3xl border border-border bg-card p-8 sm:p-10">
              <h2 className="font-heading text-2xl font-bold">Our Story</h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                kalaiArangam started with a simple observation: training
                academies, rental businesses, and event companies in India still
                run on WhatsApp messages, Excel sheets, and paper registers. As
                these businesses grow, the chaos grows with them.
              </p>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                We built kalaiArangam to replace that chaos with a single,
                intelligent platform that handles everything - from student
                admissions and fee collection to inventory management and event
                planning. Our goal is simple: give business owners their time
                back so they can focus on what they do best.
              </p>
            </div>
          </Reveal>

          <div className="mt-14 grid gap-5 sm:grid-cols-2">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.08}>
                <div className="rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/5">
                  <div className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
                    <v.icon className="size-5" />
                  </div>
                  <h3 className="mt-4 font-heading text-base font-bold">
                    {v.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {v.description}
                  </p>
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
