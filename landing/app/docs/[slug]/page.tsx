import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Copy, Check } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Breadcrumbs } from '@/components/content/breadcrumbs'
import { ContentLayout } from '@/components/content/content-layout'
import { CodeBlock } from '@/components/content/code-block'
import { getAllDocs, getDoc, getDocGroups, getDocsByGroup, getDocPrevNext, extractToc } from '@/lib/content'
import { generateMetadata as genMeta, generateBreadcrumbSchema } from '@/lib/seo'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const doc = getDoc(slug)
  if (!doc) return {}

  return genMeta({
    title: doc.title,
    description: doc.description,
    url: `https://kalaiArangam.com/docs/${doc.slug}`,
  })
}

export async function generateStaticParams() {
  return getAllDocs().map((d) => ({ slug: d.slug }))
}

export default async function DocDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const doc = getDoc(slug)
  if (!doc) notFound()

  const allDocs = getAllDocs().sort((a, b) => a.order - b.order)
  const groups = getDocGroups()
  const { prev, next } = getDocPrevNext(slug)
  const toc = extractToc(doc.content)

  const sidebar = groups.map((group) => {
    const groupDocs = getDocsByGroup(group)
    return (
      <div key={group} className="mb-6">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {group}
        </h3>
        <ul className="space-y-1">
          {groupDocs.map((d) => (
            <li key={d.slug}>
              <Link
                href={`/docs/${d.slug}`}
                className={`block rounded-lg px-3 py-1.5 text-sm transition-colors ${
                  d.slug === slug
                    ? 'bg-brand/10 font-medium text-brand'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                }`}
              >
                {d.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    )
  })

  return (
    <div className="min-h-dvh bg-background">
      <SiteHeader />
      <main>
        <div className="mx-auto max-w-6xl px-4 py-8">
          <Breadcrumbs items={[{ label: 'Documentation', href: '/docs' }, { label: doc.title }]} />

          <div className="grid gap-10 lg:grid-cols-[220px_1fr_220px]">
            {/* Sidebar */}
            <aside className="hidden lg:block">
              <nav className="sticky top-24 space-y-1" aria-label="Documentation navigation">
                {sidebar}
              </nav>
            </aside>

            {/* Content */}
            <article className="min-w-0">
              <h1 className="mb-4 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
                {doc.title}
              </h1>
              <p className="mb-8 text-lg text-muted-foreground">{doc.description}</p>

              <div
                className="prose prose-gray dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(doc.content) }}
              />

              {/* Prev/Next */}
              <div className="mt-12 grid gap-4 border-t border-border pt-8 sm:grid-cols-2">
                {prev ? (
                  <Link
                    href={`/docs/${prev.slug}`}
                    className="group rounded-xl border border-border p-4 transition-all hover:border-border/80 hover:shadow-md"
                  >
                    <span className="text-xs text-muted-foreground">Previous</span>
                    <p className="mt-1 flex items-center gap-2 font-heading text-sm font-semibold group-hover:text-brand">
                      <ChevronLeft className="size-4" />
                      {prev.title}
                    </p>
                  </Link>
                ) : (
                  <div />
                )}
                {next && (
                  <Link
                    href={`/docs/${next.slug}`}
                    className="group rounded-xl border border-border p-4 text-right transition-all hover:border-border/80 hover:shadow-md"
                  >
                    <span className="text-xs text-muted-foreground">Next</span>
                    <p className="mt-1 flex items-center justify-end gap-2 font-heading text-sm font-semibold group-hover:text-brand">
                      {next.title}
                      <ChevronRight className="size-4" />
                    </p>
                  </Link>
                )}
              </div>
            </article>

            {/* TOC */}
            <aside className="hidden lg:block">
              {toc.length > 0 && (
                <nav className="sticky top-24" aria-label="Table of contents">
                  <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    On this page
                  </h2>
                  <ul className="space-y-1.5 border-l border-border">
                    {toc.map((item) => (
                      <li key={item.id}>
                        <a
                          href={`#${item.id}`}
                          className="block border-l-2 border-transparent py-1 text-sm text-muted-foreground transition-colors hover:border-brand hover:text-foreground"
                        >
                          {item.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              )}
            </aside>
          </div>
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
    .replace(/`([^`]+)`/g, '<code class="rounded bg-muted px-1.5 py-0.5 text-sm">$1</code>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/gs, '<ul>$&</ul>')
    .replace(/\|(.+)\|/g, (match) => {
      const cells = match.split('|').filter(Boolean).map((c) => c.trim())
      if (cells.every((c) => c.match(/^[-:]+$/))) return ''
      return '<tr>' + cells.map((c) => `<td class="border border-border px-3 py-2 text-sm">${c}</td>`).join('') + '</tr>'
    })
    .replace(/(<tr>.*<\/tr>\n?)+/gs, '<table class="border-collapse border border-border">$&</table>')
    .replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) => `<pre class="rounded-xl bg-muted/30 p-4 text-sm"><code>${code.trim()}</code></pre>`)
    .replace(/\n\n/g, '</p><p>')
    .replace(/^/, '<p>')
    .replace(/$/, '</p>')
    .replace(/<p><h/g, '<h')
    .replace(/<\/h(\d)><\/p>/g, '</h$1>')
    .replace(/<p><ul>/g, '<ul>')
    .replace(/<\/ul><\/p>/g, '</ul>')
    .replace(/<p><table/g, '<table')
    .replace(/<\/table><\/p>/g, '</table>')
    .replace(/<p><pre/g, '<pre')
    .replace(/<\/pre><\/p>/g, '</pre>')
}
