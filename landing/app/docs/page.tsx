import type { Metadata } from "next";
import Link from "next/link";
import { FileText, ChevronRight } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Breadcrumbs } from "@/components/content/breadcrumbs";
import { getAllDocs, getDocGroups } from "@/lib/content";
import { generateMetadata as genMeta } from "@/lib/seo";

export const metadata: Metadata = genMeta({
  title: "Documentation",
  description:
    "Complete documentation for kalaiArangam - setup guides, module references, API docs, and more.",
  url: "https://kalaiArangam.com/docs",
});

export default function DocsPage() {
  const docs = getAllDocs();
  const groups = getDocGroups();

  return (
    <div className="min-h-dvh bg-background">
      <SiteHeader />
      <main className="px-4 pb-24 pt-28">
        <div className="mx-auto max-w-6xl">
          <Breadcrumbs items={[{ label: "Documentation" }]} />

          <div className="mb-10">
            <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl">
              Documentation
            </h1>
            <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
              Everything you need to set up, configure, and use kalaiArangam.
            </p>
          </div>

          <div className="space-y-10">
            {groups.map((group) => (
              <section key={group}>
                <h2 className="mb-4 font-heading text-xl font-semibold">
                  {group}
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {docs
                    .filter((d) => d.group === group)
                    .sort((a, b) => a.order - b.order)
                    .map((doc) => (
                      <Link
                        key={doc.slug}
                        href={`/docs/${doc.slug}`}
                        className="group flex items-start gap-3 rounded-xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-border/80 hover:shadow-lg"
                      >
                        <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand/10 text-brand">
                          <FileText className="size-5" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-heading text-sm font-semibold transition-colors group-hover:text-brand">
                            {doc.title}
                          </h3>
                          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                            {doc.description}
                          </p>
                        </div>
                        <ChevronRight className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                      </Link>
                    ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
