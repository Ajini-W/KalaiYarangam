import type { Metadata } from "next";
import Link from "next/link";
import { Clock, Tag, ArrowRight, BookOpen } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Breadcrumbs } from "@/components/content/breadcrumbs";
import { ContentSearch } from "@/components/content/search";
import { getAllTutorials, getAllTutorialCategories } from "@/lib/content";
import { generateMetadata as genMeta } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { Suspense } from "react";

export const metadata: Metadata = genMeta({
  title: "Tutorials - Step-by-Step Guides",
  description:
    "Learn how to set up and use kalaiArangam with step-by-step tutorials for training management, rental operations, and event planning.",
  url: "https://kalaiArangam.com/tutorials",
});

const difficultyColors = {
  beginner: "bg-success/10 text-success",
  intermediate: "bg-amber-500/10 text-amber-600",
  advanced: "bg-destructive/10 text-destructive",
};

export default function TutorialsPage() {
  const tutorials = getAllTutorials();
  const categories = getAllTutorialCategories();

  return (
    <div className="min-h-dvh bg-background">
      <SiteHeader />
      <main className="px-4 pb-24 pt-28">
        <div className="mx-auto max-w-6xl">
          <Breadcrumbs items={[{ label: "Tutorials" }]} />

          <div className="mb-10">
            <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl">
              Tutorials
            </h1>
            <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
              Step-by-step guides to help you master every feature of
              kalaiArangam.
            </p>
          </div>

          <div className="mb-8">
            <Suspense>
              <ContentSearch
                items={tutorials.map((t) => ({
                  slug: t.slug,
                  title: t.title,
                  description: t.description,
                  category: t.category,
                }))}
                basePath="/tutorials"
                placeholder="Search tutorials..."
              />
            </Suspense>
          </div>

          {/* Difficulty filter */}
          <div className="mb-8 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <span
                key={cat}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground"
              >
                <BookOpen className="size-3" />
                {cat}
              </span>
            ))}
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {tutorials.map((tutorial) => (
              <Link
                key={tutorial.slug}
                href={`/tutorials/${tutorial.slug}`}
                className="group rounded-xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-border/80 hover:shadow-lg"
              >
                <div className="mb-3 flex items-center gap-2">
                  <span className="rounded-full bg-brand/10 px-2.5 py-0.5 text-[10px] font-medium text-brand">
                    {tutorial.category}
                  </span>
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-0.5 text-[10px] font-medium",
                      difficultyColors[tutorial.difficulty],
                    )}
                  >
                    {tutorial.difficulty}
                  </span>
                </div>
                <h3 className="font-heading text-base font-semibold transition-colors group-hover:text-brand">
                  {tutorial.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                  {tutorial.description}
                </p>
                <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="size-3" />
                    {tutorial.estimatedTime}
                  </span>
                  <span>{tutorial.steps.length} steps</span>
                  <ArrowRight className="ml-auto size-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>

          {tutorials.length === 0 && (
            <div className="py-20 text-center text-muted-foreground">
              <p className="text-lg">No tutorials available yet.</p>
              <p className="mt-2 text-sm">Check back soon for new guides.</p>
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
