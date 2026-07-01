import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Reveal } from "@/components/reveal";
import { FeatureHero } from "@/components/sections/feature-hero";
import { features, getFeatureBySlug, getAllFeatureSlugs } from "@/data/features";
import { ArrowRight, Check, ChevronRight, HelpCircle } from "lucide-react";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllFeatureSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const feature = getFeatureBySlug(slug);
  if (!feature) return { title: "Feature Not Found" };

  return {
    title: `${feature.name} - kalaiArangam`,
    description: feature.description,
    openGraph: {
      title: `${feature.name} - kalaiArangam`,
      description: feature.tagline,
    },
  };
}

export default async function FeaturePage({ params }: PageProps) {
  const { slug } = await params;
  const feature = getFeatureBySlug(slug);

  if (!feature) notFound();

  const relatedFeatures = features
    .filter((f) => f.category === feature.category && f.slug !== feature.slug)
    .slice(0, 3);

  return (
    <div className="min-h-dvh bg-background">
      <SiteHeader />
      <main className="pt-28 pb-24">
        <FeatureHero
          iconName={feature.iconName}
          bgColor={feature.bgColor}
          color={feature.color}
          category={feature.category}
          name={feature.name}
          tagline={feature.tagline}
          stats={feature.stats}
        />

        {/* Description */}
        <section className="mx-auto mt-20 max-w-4xl px-4">
          <Reveal>
            <p className="text-center text-lg leading-relaxed text-muted-foreground sm:text-xl">
              {feature.description}
            </p>
          </Reveal>
        </section>

        {/* Highlights */}
        <section className="mx-auto mt-20 max-w-6xl px-4">
          <Reveal>
            <h2 className="text-center font-heading text-2xl font-bold sm:text-3xl">
              Key Capabilities
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mx-auto mt-10 grid max-w-3xl gap-3">
              {feature.highlights.map((highlight) => (
                <div
                  key={highlight}
                  className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/20 hover:shadow-md"
                >
                  <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Check className="size-4" />
                  </div>
                  <span className="text-sm font-medium">{highlight}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        {/* Benefits */}
        <section className="mx-auto mt-24 max-w-6xl px-4">
          <Reveal>
            <h2 className="text-center font-heading text-2xl font-bold sm:text-3xl">
              Why You&apos;ll Love It
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-muted-foreground">
              Designed to solve real problems, not just check boxes.
            </p>
          </Reveal>
          <div className="mx-auto mt-12 grid gap-6 sm:grid-cols-2">
            {feature.benefits.map((benefit, i) => (
              <Reveal key={benefit.title} delay={i * 0.1}>
                <div className="group h-full rounded-3xl border border-border bg-card p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5 hover:border-primary/20">
                  <div
                    className={`grid size-12 place-items-center rounded-2xl ${feature.bgColor} ${feature.color} transition-transform group-hover:scale-110`}
                  >
                    <benefit.icon className="size-6" />
                  </div>
                  <h3 className="mt-5 font-heading text-lg font-bold">
                    {benefit.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {benefit.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Use Cases */}
        <section className="mx-auto mt-24 max-w-6xl px-4">
          <Reveal>
            <h2 className="text-center font-heading text-2xl font-bold sm:text-3xl">
              How Others Use It
            </h2>
          </Reveal>
          <div className="mx-auto mt-12 grid gap-6 sm:grid-cols-3">
            {feature.useCases.map((useCase, i) => (
              <Reveal key={useCase.title} delay={i * 0.1}>
                <div className="h-full rounded-3xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5">
                  <div className="flex items-center gap-2 text-primary">
                    <ChevronRight className="size-5" />
                    <h3 className="font-heading font-bold">{useCase.title}</h3>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {useCase.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* FAQs */}
        <section className="mx-auto mt-24 max-w-3xl px-4">
          <Reveal>
            <h2 className="text-center font-heading text-2xl font-bold sm:text-3xl">
              Frequently Asked Questions
            </h2>
          </Reveal>
          <div className="mx-auto mt-10 space-y-4">
            {feature.faqs.map((faq, i) => (
              <Reveal key={faq.question} delay={i * 0.05}>
                <details className="group rounded-2xl border border-border bg-card transition-all hover:border-primary/20">
                  <summary className="flex cursor-pointer items-center gap-3 p-5 font-medium list-none [&::-webkit-details-marker]:hidden">
                    <HelpCircle className="size-5 shrink-0 text-primary" />
                    {faq.question}
                    <ChevronRight className="size-4 shrink-0 ml-auto transition-transform group-open:rotate-90 text-muted-foreground" />
                  </summary>
                  <div className="px-5 pb-5 pl-13 text-sm leading-relaxed text-muted-foreground">
                    {faq.answer}
                  </div>
                </details>
              </Reveal>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto mt-24 max-w-4xl px-4">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-card to-accent-blue/10 border border-border p-8 sm:p-12 text-center">
              <div
                className="absolute -left-20 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl"
                aria-hidden="true"
              />
              <div
                className="absolute -right-20 top-1/3 h-32 w-32 rounded-full bg-accent-blue/10 blur-3xl"
                aria-hidden="true"
              />
              <div className="relative">
                <h2 className="font-heading text-2xl font-bold sm:text-3xl">
                  Ready to Transform Your {feature.category.toLowerCase()}?
                </h2>
                <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
                  Join hundreds of institutes already using kalaiArangam to
                  streamline their operations.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                  <a
                    href={`${process.env.NEXT_PUBLIC_SAAS_URL || "https://app.saas.com"}/register`}
                    className="group relative inline-flex h-12 items-center justify-center gap-2 whitespace-nowrap rounded-2xl px-6 text-base font-semibold text-white shadow-lg shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30 sm:h-14 sm:px-8 sm:text-lg"
                    style={{
                      background:
                        "linear-gradient(135deg, #FFB21D 0%, #FF8A00 100%)",
                    }}
                  >
                    Start Free Trial
                    <ArrowRight className="size-4 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 sm:size-5" />
                  </a>
                  <a
                    href="/contact"
                    className="inline-flex h-12 items-center justify-center gap-2 whitespace-nowrap rounded-2xl border border-gray-200 bg-white px-6 text-base font-semibold text-gray-900 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md dark:border-white/15 dark:bg-white/10 dark:text-white dark:hover:border-white/25 dark:hover:bg-white/15 sm:h-14 sm:px-8 sm:text-lg"
                  >
                    Talk to Sales
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        {/* Related Features */}
        {relatedFeatures.length > 0 && (
          <section className="mx-auto mt-24 max-w-6xl px-4">
            <Reveal>
              <h2 className="text-center font-heading text-2xl font-bold sm:text-3xl">
                Related Features
              </h2>
            </Reveal>
            <div className="mx-auto mt-10 grid gap-4 sm:grid-cols-3">
              {relatedFeatures.map((related, i) => {
                const RelatedIcon = related.icon;
                return (
                  <Reveal key={related.slug} delay={i * 0.1}>
                    <a
                      href={`/features/${related.slug}`}
                      className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/5 hover:border-primary/20"
                    >
                      <div
                        className={`grid size-10 shrink-0 place-items-center rounded-xl ${related.bgColor} ${related.color} group-hover:scale-110 transition-transform`}
                      >
                        <RelatedIcon className="size-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold group-hover:text-primary transition-colors">
                          {related.name}
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                          {related.tagline}
                        </p>
                      </div>
                      <ArrowRight className="size-4 shrink-0 mt-1 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </a>
                  </Reveal>
                );
              })}
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
