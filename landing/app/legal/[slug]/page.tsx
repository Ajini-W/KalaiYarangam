import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Calendar } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { ContentLayout } from '@/components/content/content-layout'
import { getLegalPage, getAllLegalPages, extractToc } from '@/lib/content'
import { generateMetadata as genMeta } from '@/lib/seo'
import Link from 'next/link'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const page = getLegalPage(slug)
  if (!page) return {}

  return genMeta({
    title: page.title,
    description: page.description,
    url: `https://kalaiArangam.com/legal/${page.slug}`,
  })
}

export async function generateStaticParams() {
  return getAllLegalPages().map((p) => ({ slug: p.slug }))
}

export default async function LegalDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const page = getLegalPage(slug)
  if (!page) notFound()

  const toc = extractToc(page.content)
  const allLegal = getAllLegalPages()

  const sidebar = (
    <div className="rounded-xl border border-border bg-muted/20 p-4">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Legal Documents
      </h3>
      <ul className="space-y-1">
        {allLegal.map((p) => (
          <li key={p.slug}>
            <Link
              href={`/legal/${p.slug}`}
              className={`block rounded-lg px-3 py-1.5 text-sm transition-colors ${
                p.slug === slug
                  ? 'bg-brand/10 font-medium text-brand'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              }`}
            >
              {p.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )

  return (
    <div className="min-h-dvh bg-background">
      <SiteHeader />
      <main className="px-4 pb-24 pt-28">
        <div className="mx-auto max-w-4xl">
          <ContentLayout
            breadcrumbs={[
              { label: 'Legal', href: '/legal' },
              { label: page.title },
            ]}
            toc={toc}
            sidebar={sidebar}
          >
            <article>
              <header className="mb-8">
                <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
                  {page.title}
                </h1>
                <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="size-3.5" />
                  Last updated: {page.lastUpdated}
                </div>
              </header>

              <div
                className="prose prose-gray dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(page.content) }}
              />

              <div className="mt-10 rounded-xl border border-border bg-muted/20 p-4 text-sm text-muted-foreground">
                <p>
                  If you have questions about this policy, contact us at{' '}
                  <a href="mailto:legal@kalaiArangam.com" className="text-brand hover:underline">
                    legal@kalaiArangam.com
                  </a>
                </p>
              </div>
            </article>
          </ContentLayout>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

function renderMarkdown(content: string): string {
  return content
    .replace(/^### (.+)$/gm, '<h3 id="$1">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 id="$1">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 id="$1">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/gs, '<ul>$&</ul>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^/, '<p>')
    .replace(/$/, '</p>')
    .replace(/<p><h/g, '<h')
    .replace(/<\/h(\d)><\/p>/g, '</h$1>')
    .replace(/<p><ul>/g, '<ul>')
    .replace(/<\/ul><\/p>/g, '</ul>')
}
