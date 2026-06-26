import Link from 'next/link'
import { ArrowRight, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function NewsletterCta() {
  return (
    <div className="my-12 rounded-2xl border border-border bg-card p-6 sm:p-8">
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="grid size-12 place-items-center rounded-xl bg-brand/10 text-brand">
            <Mail className="size-5" />
          </div>
          <div>
            <h3 className="font-heading text-lg font-semibold">
              Stay updated
            </h3>
            <p className="text-sm text-muted-foreground">
              Get the latest tutorials and product updates delivered to your inbox.
            </p>
          </div>
        </div>
        <Button asChild className="shrink-0 p-4 bg-brand text-brand-foreground hover:bg-brand/90">
          <a href="#newsletter">
            Subscribe
          </a>
        </Button>
      </div>
    </div>
  )
}
