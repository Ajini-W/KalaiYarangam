import { ArrowRight, PlayCircle } from 'lucide-react'
import { Reveal } from '@/components/reveal'

export function FinalCta() {
  return (
    <section id="contact" className="scroll-mt-24 px-4 py-24">
      <Reveal className="mx-auto max-w-5xl">
        <div className="relative overflow-hidden rounded-[2rem] border border-border bg-gradient-to-br from-primary/5 via-card to-accent-blue/5 px-6 py-16 text-center sm:px-12 sm:py-20">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10"
          >
            <div className="absolute left-[10%] top-[10%] size-20 rounded-2xl bg-primary/10 rotate-12 animate-float" />
            <div className="absolute right-[15%] top-[20%] size-14 rounded-full bg-accent-blue/10 animate-float-delayed" />
            <div className="absolute left-[20%] bottom-[15%] size-16 rounded-xl bg-accent-red/10 -rotate-12 animate-float-slow" />
            <div className="absolute right-[10%] bottom-[25%] size-12 rounded-2xl bg-accent-cyan/10 rotate-45 animate-float" />
            <div className="absolute left-1/2 top-0 h-80 w-[45rem] -translate-x-1/2 rounded-full bg-primary/10 blur-[140px]" />
          </div>

          <h2 className="mx-auto max-w-2xl text-balance font-heading text-3xl font-bold tracking-tight sm:text-5xl">
            Ready to transform your business operations?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            Join thousands of academies, rental businesses, and event companies
            running smarter on one platform.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <a
              href="#pricing"
              className="group inline-flex h-12 w-full items-center justify-center gap-2 whitespace-nowrap rounded-2xl px-6 text-base font-semibold text-white shadow-lg shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:h-14 sm:w-auto sm:px-8 sm:text-lg"
              style={{ background: 'linear-gradient(135deg, #FFB21D 0%, #FF8A00 100%)' }}
            >
              Start Free Trial
              <ArrowRight className="size-4 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 sm:size-5" />
            </a>
            <a
              href="#contact"
              className="inline-flex h-12 w-full items-center justify-center gap-2 whitespace-nowrap rounded-2xl border border-gray-200 bg-white px-6 text-base font-semibold text-gray-900 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary dark:border-white/15 dark:bg-white/10 dark:text-white dark:hover:border-white/25 dark:hover:bg-white/15 sm:h-14 sm:w-auto sm:px-8 sm:text-lg"
            >
              <PlayCircle className="size-4 shrink-0 sm:size-5" />
              Book Demo
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
