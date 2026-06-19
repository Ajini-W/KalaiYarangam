'use client'

import {
  BookOpen,
  CalendarHeart,
  FileText,
  GraduationCap,
  Package,
  Rocket,
  Search,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { SectionHeading } from '@/components/section-heading'
import { Reveal } from '@/components/reveal'
import { cn } from '@/lib/utils'

const categories = [
  {
    icon: Rocket,
    title: 'Getting Started',
    articles: ['Account Setup', 'Tenant Creation', 'Branding'],
  },
  {
    icon: GraduationCap,
    title: 'Training Management',
    articles: ['Student Enrollment', 'Attendance', 'Fee Collection'],
  },
  {
    icon: Package,
    title: 'Rental Management',
    articles: ['Inventory Setup', 'Booking Creation', 'Return Processing'],
  },
  {
    icon: CalendarHeart,
    title: 'Event Management',
    articles: ['Event Planning', 'Team Assignment', 'Budget Tracking'],
  },
]

export function Tutorials() {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return categories
    return categories
      .map((c) => ({
        ...c,
        articles: c.articles.filter(
          (a) =>
            a.toLowerCase().includes(q) || c.title.toLowerCase().includes(q),
        ),
      }))
      .filter((c) => c.articles.length > 0)
  }, [query])

  return (
    <section id="tutorials" className="scroll-mt-24 px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Tutorial Center"
          title="Learn KalaiYarangam faster"
          description="Step-by-step guides and searchable documentation help your team master the platform in days, not weeks."
        />

        <Reveal className="mx-auto mt-10 max-w-xl">
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 shadow-sm focus-within:border-brand/50 focus-within:ring-2 focus-within:ring-brand/20">
            <Search className="size-5 text-muted-foreground" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search documentation..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              aria-label="Search documentation"
            />
          </div>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((category, i) => (
            <Reveal
              key={category.title}
              delay={(i % 4) * 0.08}
              className="rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="grid size-11 place-items-center rounded-xl bg-brand/10 text-brand">
                <category.icon className="size-5" />
              </div>
              <h3 className="mt-4 font-heading text-base font-semibold">
                {category.title}
              </h3>
              <ul className="mt-4 space-y-2">
                {category.articles.map((article) => (
                  <li key={article}>
                    <a
                      href="#"
                      className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-brand"
                    >
                      <FileText className="size-3.5" />
                      {article}
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="mt-12 text-center text-sm text-muted-foreground">
            No articles found for &ldquo;{query}&rdquo;. Try a different search.
          </p>
        )}

        <div className="mt-10 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <BookOpen className="size-4" />
          Over 120 guides, videos, and API references available.
        </div>
      </div>
    </section>
  )
}
