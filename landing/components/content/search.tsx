'use client'

import { Search as SearchIcon, X } from 'lucide-react'
import { useState, useMemo } from 'react'
import Link from 'next/link'

interface SearchItem {
  slug: string
  title: string
  description: string
  category?: string
}

export function ContentSearch({
  items,
  basePath,
  placeholder = 'Search...',
}: {
  items: SearchItem[]
  basePath: string
  placeholder?: string
}) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    if (!q) return []
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category?.toLowerCase().includes(q),
    )
  }, [query, items])

  return (
    <div className="relative">
      <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 focus-within:border-brand/50 focus-within:ring-2 focus-within:ring-brand/20">
        <SearchIcon className="size-5 shrink-0 text-muted-foreground" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          aria-label="Search"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="shrink-0 text-muted-foreground hover:text-foreground"
            aria-label="Clear search"
          >
            <X className="size-4" />
          </button>
        )}
      </div>
      {query && filtered.length > 0 && (
        <ul className="absolute z-20 mt-2 w-full rounded-xl border border-border bg-card p-2 shadow-xl">
          {filtered.slice(0, 8).map((item) => (
            <li key={item.slug}>
              <Link
                href={`${basePath}/${item.slug}`}
                onClick={() => setQuery('')}
                className="block rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent"
              >
                <p className="font-medium">{item.title}</p>
                {item.category && (
                  <p className="mt-0.5 text-xs text-muted-foreground">{item.category}</p>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
      {query && filtered.length === 0 && (
        <div className="absolute z-20 mt-2 w-full rounded-xl border border-border bg-card p-4 text-center text-sm text-muted-foreground shadow-xl">
          No results found for &ldquo;{query}&rdquo;
        </div>
      )}
    </div>
  )
}
