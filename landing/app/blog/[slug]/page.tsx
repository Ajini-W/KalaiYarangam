import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Clock, Tag, Calendar } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { ContentLayout } from '@/components/content/content-layout'
import { SocialShare } from '@/components/content/social-share'
import { NewsletterCta } from '@/components/content/newsletter-cta'
import { RelatedPosts } from '@/components/content/related-posts'
import { getBlogPost, getAllBlogPosts, extractToc } from '@/lib/content'
import { generateMetadata as genMeta, generateArticleSchema, generateBreadcrumbSchema } from '@/lib/seo'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) return {}

  return genMeta({
    title: post.title,
    description: post.description,
    url: `https://kalaiArangam.com/blog/${post.slug}`,
    type: 'article',
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
    author: post.author.name,
  })
}

export async function generateStaticParams() {
  return getAllBlogPosts().map((post) => ({ slug: post.slug }))
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) notFound()

  const toc = extractToc(post.content)
  const allPosts = getAllBlogPosts()
  const related = allPosts
    .filter((p) => p.slug !== post.slug && p.category === post.category)
    .slice(0, 3)

  const articleSchema = generateArticleSchema({
    title: post.title,
    description: post.description,
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
    author: post.author.name,
    url: `https://kalaiArangam.com/blog/${post.slug}`,
  })

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: 'https://kalaiArangam.com' },
    { name: 'Blog', url: 'https://kalaiArangam.com/blog' },
    { name: post.title, url: `https://kalaiArangam.com/blog/${post.slug}` },
  ])

  return (
    <div className="min-h-dvh bg-background">
      <SiteHeader />
      <main>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />

        <ContentLayout
          breadcrumbs={[
            { label: 'Blog', href: '/blog' },
            { label: post.title },
          ]}
          toc={toc}
        >
          <article>
            <header className="mb-8">
              <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-3 py-1 text-xs font-medium text-brand">
                <Tag className="size-3" />
                {post.category}
              </span>
              <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                {post.title}
              </h1>
              <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
                {post.description}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{post.author.name}</span>
                <span className="flex items-center gap-1">
                  <Calendar className="size-3.5" />
                  {post.publishedAt}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="size-3.5" />
                  {post.readingTime} min read
                </span>
              </div>
              <div className="mt-4">
                <SocialShare
                  title={post.title}
                  url={`https://kalaiArangam.com/blog/${post.slug}`}
                />
              </div>
            </header>

            <div
              className="prose prose-gray dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
            />

            {post.tags.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-border bg-muted/30 px-3 py-1 text-xs text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <RelatedPosts items={related} basePath="/blog" type="blog" />
          </article>

          <NewsletterCta />
        </ContentLayout>
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
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/gs, '<ul>$&</ul>')
    .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^/, '<p>')
    .replace(/$/, '</p>')
    .replace(/<p><h/g, '<h')
    .replace(/<\/h(\d)><\/p>/g, '</h$1>')
    .replace(/<p><ul>/g, '<ul>')
    .replace(/<\/ul><\/p>/g, '</ul>')
}
