import { ArrowRight, PlayCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Reveal } from '@/components/reveal'

export function FinalCta() {
  return (
    <section id="demo" className="scroll-mt-24 px-4 py-24">
      <Reveal className="mx-auto max-w-5xl">
        <div className="relative overflow-hidden rounded-[2rem] border border-border bg-card px-6 py-16 text-center sm:px-12 sm:py-20">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10"
          >
            <div className="absolute left-1/2 top-0 h-80 w-[45rem] -translate-x-1/2 rounded-full bg-brand/20 blur-[140px]" />
            <div className="absolute bottom-0 right-1/4 h-60 w-60 rounded-full bg-accent-cyan/15 blur-[120px]" />
          </div>

          <h2 className="mx-auto max-w-2xl text-balance font-heading text-3xl font-bold tracking-tight sm:text-5xl">
            Ready to transform your business operations?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            Join thousands of academies, rental businesses, and event companies
            running smarter on one platform.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              size="lg"
              asChild
              className="h-13 w-full bg-brand px-8 text-base text-brand-foreground hover:bg-brand/90 sm:w-auto"
            >
              <a href="#pricing">
                Start Free Trial
                <ArrowRight className="size-4" />
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="h-13 w-full px-8 text-base sm:w-auto"
            >
              <a href="#demo">
                <PlayCircle className="size-4" />
                Book Demo
              </a>
            </Button>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
