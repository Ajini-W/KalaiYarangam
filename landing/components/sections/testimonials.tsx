'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Pause, Play, Quote, Star } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { SectionHeading } from '@/components/section-heading'
import { cn } from '@/lib/utils'

const testimonials = [
  {
    quote:
      'We replaced three different tools and a pile of spreadsheets. Fee collection that used to take a week now closes in a day, and our follow-up rate doubled.',
    name: 'Priya Raman',
    role: 'Founder, Nrithya Bharatanatyam Academy',
    metric: '2x faster fee collection',
    initials: 'PR',
    color: 'from-primary to-accent-yellow',
  },
  {
    quote:
      'The availability calendar alone saved us from double-bookings every festival season. We finally know exactly where every costume and light is.',
    name: 'Arun Kumar',
    role: 'Owner, StageCraft Rentals',
    metric: '0 double-bookings this season',
    initials: 'AK',
    color: 'from-accent-blue to-accent-cyan',
  },
  {
    quote:
      'From enquiry to closure report, every event runs through kalaiArangam. Our team coordination and budget accuracy have completely transformed.',
    name: 'Meera Nair',
    role: 'Director, Celebr8 Event Planners',
    metric: '30% higher margins',
    initials: 'MN',
    color: 'from-accent-red to-primary',
  },
]

export function Testimonials() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  const next = useCallback(
    () => setIndex((i) => (i + 1) % testimonials.length),
    [],
  )
  const prev = () =>
    setIndex((i) => (i - 1 + testimonials.length) % testimonials.length)

  useEffect(() => {
    if (paused) return
    const timer = setInterval(next, 6000)
    return () => clearInterval(timer)
  }, [next, paused])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const handleEnter = () => setPaused(true)
    const handleLeave = () => setPaused(false)
    section.addEventListener('mouseenter', handleEnter)
    section.addEventListener('mouseleave', handleLeave)
    section.addEventListener('focusin', handleEnter)
    section.addEventListener('focusout', handleLeave)
    return () => {
      section.removeEventListener('mouseenter', handleEnter)
      section.removeEventListener('mouseleave', handleLeave)
      section.removeEventListener('focusin', handleEnter)
      section.removeEventListener('focusout', handleLeave)
    }
  }, [])

  const active = testimonials[index]

  return (
    <section className="px-4 py-24">
      <div className="mx-auto max-w-4xl">
        <SectionHeading
          eyebrow="Testimonials"
          title="Loved by businesses that mean business"
        />

        <div
          ref={sectionRef}
          role="region"
          aria-roledescription="carousel"
          aria-label="Customer testimonials"
          className="relative mt-12 overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-xl shadow-black/5 sm:p-12"
        >
          <Quote className="absolute right-8 top-8 size-16 text-primary/10" aria-hidden="true" />
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              role="group"
              aria-roledescription="slide"
              aria-label={`Testimonial ${index + 1} of ${testimonials.length}`}
            >
              <div className="flex gap-1 text-primary" aria-hidden="true">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-4 fill-current" />
                ))}
              </div>
              <blockquote className="mt-5 text-pretty font-heading text-xl font-medium leading-relaxed sm:text-2xl">
                &ldquo;{active.quote}&rdquo;
              </blockquote>
              <div className="mt-8 flex items-center gap-4">
                <span className={`grid size-12 place-items-center rounded-full bg-gradient-to-br ${active.color} text-sm font-bold text-white`}>
                  {active.initials}
                </span>
                <div>
                  <p className="font-bold">{active.name}</p>
                  <p className="text-sm text-muted-foreground">{active.role}</p>
                </div>
                <span className="ml-auto hidden rounded-full bg-accent-green/10 px-3 py-1.5 text-sm font-semibold text-accent-green sm:block">
                  {active.metric}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-10 flex items-center justify-between">
            <div className="flex gap-2" role="tablist" aria-label="Testimonial navigation">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Go to testimonial ${i + 1}`}
                  className={cn(
                    'h-2 rounded-full transition-all',
                    i === index ? 'w-6 bg-primary' : 'w-2 bg-border',
                  )}
                />
              ))}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setPaused(!paused)}
                aria-label={paused ? 'Resume auto-play' : 'Pause auto-play'}
                className="grid size-8 place-items-center rounded-full border border-border text-muted-foreground transition-all hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
              >
                {paused ? <Play className="size-3" /> : <Pause className="size-3" />}
              </button>
              <div className="flex gap-2">
                <button
                  onClick={prev}
                  aria-label="Previous testimonial"
                  className="grid size-10 place-items-center rounded-full border border-border transition-all hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
                >
                  <ChevronLeft className="size-4" />
                </button>
                <button
                  onClick={next}
                  aria-label="Next testimonial"
                  className="grid size-10 place-items-center rounded-full border border-border transition-all hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
