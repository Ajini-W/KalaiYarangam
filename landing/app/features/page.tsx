import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Reveal } from "@/components/reveal";
import { features } from "@/data/features";
import { Heart,ArrowRight } from "lucide-react";

const categories = Array.from(new Set(features.map((f) => f.category)));

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
            <h1 className="mt-5 text-balance font-heading text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Everything you need
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              Grouped by what matters most - not a list of 100 features.
            </p>
            <div className="mt-8 flex justify-center">
              <a
                href="https://sarran.formaloo.co/zpwci7"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-playful inline-flex items-center gap-2 bg-primary text-primary-foreground"
              >
                <Heart className="size-4" />
                Join Wishlist
              </a>
            </div>
          </Reveal>

          <div className="mt-16 space-y-16">
            {categories.map((category, gi) => (
              <Reveal key={category} delay={gi * 0.1}>
                <div>
                  <h2 className="font-heading text-2xl font-bold mb-2">
                    {category}
                  </h2>
                  <p className="text-sm text-muted-foreground mb-6">
                    {category === "Admissions" && "Manage students, attendance, fees, and scheduling"}
                    {category === "Inventory" && "Book rentals and plan events end-to-end"}
                    {category === "Operations" && "Reports, mobile access, and smart analytics"}
                    {category === "Platform" && "Enterprise-grade security and scalability"}
                  </p>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {features
                      .filter((f) => f.category === category)
                      .map((f) => {
                        const Icon = f.icon;
                        return (
                          <a
                            key={f.slug}
                            href={`/features/${f.slug}`}
                            className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/5 hover:border-primary/20"
                          >
                            <div
                              className={`grid size-10 shrink-0 place-items-center rounded-xl ${f.bgColor} ${f.color} group-hover:scale-110 transition-transform`}
                            >
                              <Icon className="size-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold group-hover:text-primary transition-colors">
                                {f.name}
                              </p>
                              <p className="mt-1 text-sm text-muted-foreground">
                                {f.tagline}
                              </p>
                            </div>
                            <ArrowRight className="size-4 shrink-0 mt-1 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                          </a>
                        );
                      })}
                  </div>
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
