import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Clock, ChevronRight, ArrowLeft, ArrowRight } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { ContentLayout } from '@/components/content/content-layout'
import { CodeBlock } from '@/components/content/code-block'
import { SocialShare } from '@/components/content/social-share'
import { RelatedPosts } from '@/components/content/related-posts'
import { getTutorial, getAllTutorials, extractToc } from '@/lib/content'
import { generateMetadata as genMeta } from '@/lib/seo'
import { cn } from '@/lib/utils'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const tutorial = getTutorial(slug)
  if (!tutorial) return {}

  return genMeta({
    title: tutorial.title,
    description: tutorial.description,
    url: `https://kalaiArangam.com/tutorials/${tutorial.slug}`,
    type: 'article',
  })
}

export async function generateStaticParams() {
  return getAllTutorials().map((t) => ({ slug: t.slug }))
}

const difficultyColors = {
  beginner: 'bg-success/10 text-success',
  intermediate: 'bg-amber-500/10 text-amber-600',
  advanced: 'bg-destructive/10 text-destructive',
}

export default async function TutorialDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const tutorial = getTutorial(slug)
  if (!tutorial) notified()

  const allTutorials = getAllTutorials()
  const related = allTutorials
    .filter((t) => t.slug !== tutorial!.slug && t.category === tutorial!.category)
    .slice(0, 3)

  const toc = tutorial!.steps.map((s, i) => ({
    id: `step-${i + 1}`,
    title: `Step ${i + 1}: ${s.title}`,
    level: 2 as const,
  }))

  return (
    <div className="min-h-dvh bg-background">
      <SiteHeader />
      <main>
        <ContentLayout
          breadcrumbs={[
            { label: 'Tutorials', href: '/tutorials' },
            { label: tutorial!.title },
          ]}
          toc={toc}
        >
          <article>
            <header className="mb-8">
              <div className="mb-3 flex items-center gap-2">
                <span className="rounded-full bg-brand/10 px-2.5 py-0.5 text-xs font-medium text-brand">
                  {tutorial!.category}
                </span>
                <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-medium', difficultyColors[tutorial!.difficulty])}>
                  {tutorial!.difficulty}
                </span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="size-3" />
                  {tutorial!.estimatedTime}
                </span>
              </div>
              <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                {tutorial!.title}
              </h1>
              <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
                {tutorial!.description}
              </p>
              <div className="mt-4">
                <SocialShare
                  title={tutorial!.title}
                  url={`https://kalaiArangam.com/tutorials/${tutorial!.slug}`}
                />
              </div>
            </header>

            {tutorial!.prerequisites.length > 0 && (
              <div className="mb-8 rounded-xl border border-border bg-muted/30 p-4">
                <h3 className="mb-2 text-sm font-semibold">Prerequisites</h3>
                <ul className="space-y-1">
                  {tutorial!.prerequisites.map((p) => (
                    <li key={p} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <ChevronRight className="size-3.5" />
                      {p.replace(/-/g, ' ')}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Steps */}
            <div className="space-y-10">
              {tutorial!.steps.map((step, i) => (
                <section key={i} id={`step-${i + 1}`} className="scroll-mt-24">
                  <div className="mb-4 flex items-center gap-3">
                    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-brand text-sm font-bold text-brand-foreground">
                      {i + 1}
                    </span>
                    <h2 className="font-heading text-xl font-bold">{step.title}</h2>
                  </div>
                  <div className="ml-11">
                    <p className="text-muted-foreground leading-relaxed">{step.content}</p>
                    {step.code?.map((c, j) => (
                      <CodeBlock
                        key={j}
                        code={c.code}
                        language={c.language}
                        filename={c.filename}
                      />
                    ))}
                  </div>
                </section>
              ))}
            </div>

            {/* Progress nav */}
            <div className="mt-10 flex items-center justify-between border-t border-border pt-6">
              <p className="text-sm text-muted-foreground">
                {tutorial!.steps.length} steps completed
              </p>
              <div className="flex gap-2">
                {tutorial!.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-border bg-muted/30 px-2.5 py-0.5 text-xs text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <RelatedPosts items={related} basePath="/tutorials" type="tutorial" />
          </article>
        </ContentLayout>
      </main>
      <SiteFooter />
    </div>
  )
}

function notifed(): never {
  notFound()
}
