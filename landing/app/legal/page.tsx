import type { Metadata } from 'next'
import Link from 'next/link'
import { FileText } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Breadcrumbs } from '@/components/content/breadcrumbs'
import { getAllLegalPages } from '@/lib/content'
import { generateMetadata as genMeta } from '@/lib/seo'

export const metadata: Metadata = genMeta({
  title: 'Legal',
  description:
    'Legal documents, policies, and terms for kalaiArangam.',
  url: 'https://kalaiArangam.com/legal',
})

export default function LegalPage() {
  const pages = getAllLegalPages()

  return (
    <div className="min-h-dvh bg-background">
      <SiteHeader />
      <main className="px-4 pb-24 pt-28">
        <div className="mx-auto max-w-4xl">
          <Breadcrumbs items={[{ label: 'Legal' }]} />

          <h1 className="mb-4 font-heading text-4xl font-bold tracking-tight sm:text-5xl">
            Legal
          </h1>
          <p className="mb-10 max-w-2xl text-lg text-muted-foreground">
            Policies, terms, and legal documents governing the use of kalaiArangam.
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            {pages.map((page) => (
              <Link
                key={page.slug}
                href={`/legal/${page.slug}`}
                className="group flex items-start gap-3 rounded-xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-border/80 hover:shadow-lg"
              >
                <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand/10 text-brand">
                  <FileText className="size-5" />
                </div>
                <div>
                  <h2 className="font-heading text-base font-semibold transition-colors group-hover:text-brand">
                    {page.title}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">{page.description}</p>
                  <p className="mt-2 text-xs text-muted-foreground/60">
                    Last updated: {page.lastUpdated}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
