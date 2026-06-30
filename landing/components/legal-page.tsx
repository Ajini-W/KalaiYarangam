import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Reveal } from '@/components/reveal'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import pagesData from '@/data/legal/pages.json'

export function LegalPage({ slug }: { slug: string }) {
  const page = pagesData.find((p) => p.slug === slug)
  if (!page) return null

  const sections = page.content.split('\n\n').filter(Boolean)

  return (
    <div className="min-h-dvh bg-background">
      <SiteHeader />
      <main className="pt-28 pb-24">
        <div className="mx-auto max-w-3xl px-4">
          <Reveal>
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
              <ArrowLeft className="size-4" />
              Back to home
            </Link>
            <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">{page.title}</h1>
            <p className="mt-2 text-sm text-muted-foreground">Last updated: {page.lastUpdated}</p>
          </Reveal>

          <Reveal className="mt-8">
            <div className="prose prose-gray dark:prose-invert max-w-none">
              {sections.map((section, i) => {
                if (section.startsWith('## ')) {
                  return <h2 key={i} className="font-heading text-xl font-bold mt-8 mb-3">{section.replace('## ', '')}</h2>
                }
                if (section.startsWith('### ')) {
                  return <h3 key={i} className="font-heading text-lg font-semibold mt-6 mb-2">{section.replace('### ', '')}</h3>
                }
                if (section.startsWith('- ')) {
                  const items = section.split('\n').filter(l => l.startsWith('- '))
                  return (
                    <ul key={i} className="mt-2 space-y-1.5 text-muted-foreground">
                      {items.map((item, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm">
                          <span className="mt-1.5 size-1.5 rounded-full bg-primary shrink-0" />
                          {item.replace('- ', '')}
                        </li>
                      ))}
                    </ul>
                  )
                }
                if (section.match(/^\d+\./)) {
                  const items = section.split('\n').filter(l => l.match(/^\d+\./))
                  return (
                    <ol key={i} className="mt-2 space-y-1.5 text-muted-foreground list-decimal list-inside">
                      {items.map((item, j) => (
                        <li key={j} className="text-sm">{item.replace(/^\d+\.\s*/, '')}</li>
                      ))}
                    </ol>
                  )
                }
                return <p key={i} className="mt-3 text-sm leading-relaxed text-muted-foreground">{section}</p>
              })}
            </div>
          </Reveal>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
