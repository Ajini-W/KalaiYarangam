import { Breadcrumbs, type BreadcrumbItem } from './breadcrumbs'
import { TableOfContents } from './table-of-contents'
import type { TocItem } from '@/lib/content/types'

export function ContentLayout({
  breadcrumbs,
  toc,
  children,
  sidebar,
}: {
  breadcrumbs: BreadcrumbItem[]
  toc?: TocItem[]
  children: React.ReactNode
  sidebar?: React.ReactNode
}) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Breadcrumbs items={breadcrumbs} />
      <div className="grid gap-10 lg:grid-cols-[1fr_220px]">
        <div className="min-w-0">
          {children}
        </div>
        {toc && toc.length > 0 && (
          <aside className="hidden lg:block">
            <TableOfContents items={toc} />
          </aside>
        )}
      </div>
      {sidebar && (
        <div className="mt-8 border-t border-border pt-8">
          {sidebar}
        </div>
      )}
    </div>
  )
}
