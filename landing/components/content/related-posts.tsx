import Link from 'next/link'
import { ArrowRight, Clock, Tag } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RelatedItem {
  slug: string
  title: string
  description: string
  category?: string
  readingTime?: number
  difficulty?: string
}

export function RelatedPosts({
  items,
  basePath,
  type = 'blog',
}: {
  items: RelatedItem[]
  basePath: string
  type?: 'blog' | 'tutorial'
}) {
  if (items.length === 0) return null

  return (
    <section className="mt-12 border-t border-border pt-10">
      <h2 className="mb-6 font-heading text-xl font-semibold">
        Related {type === 'blog' ? 'Articles' : 'Tutorials'}
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Link
            key={item.slug}
            href={`${basePath}/${item.slug}`}
            className="group rounded-xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-border/80 hover:shadow-lg"
          >
            {item.category && (
              <span className="mb-2 inline-flex items-center gap-1 rounded-full bg-brand/10 px-2.5 py-0.5 text-xs font-medium text-brand">
                <Tag className="size-3" />
                {item.category}
              </span>
            )}
            <h3 className="font-heading text-base font-semibold transition-colors group-hover:text-brand">
              {item.title}
            </h3>
            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
              {item.description}
            </p>
            <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
              {item.readingTime && (
                <span className="flex items-center gap-1">
                  <Clock className="size-3" />
                  {item.readingTime} min read
                </span>
              )}
              {item.difficulty && (
                <span className={cn(
                  'rounded-full px-2 py-0.5 text-[10px] font-medium',
                  item.difficulty === 'beginner' && 'bg-success/10 text-success',
                  item.difficulty === 'intermediate' && 'bg-amber-500/10 text-amber-600',
                  item.difficulty === 'advanced' && 'bg-destructive/10 text-destructive',
                )}>
                  {item.difficulty}
                </span>
              )}
              <ArrowRight className="ml-auto size-3.5 transition-transform group-hover:translate-x-0.5" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
