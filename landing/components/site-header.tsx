'use client'

import { Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/logo'
import { ThemeToggle } from '@/components/theme-toggle'
import { cn } from '@/lib/utils'

const navLinks = [
  { label: 'Industries', href: '#industries' },
  { label: 'Modules', href: '#modules' },
  { label: 'Platform', href: '#platform' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Tutorials', href: '#tutorials' },
]

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:pt-5">
      <div
        className={cn(
          'mx-auto flex max-w-6xl items-center justify-between rounded-2xl border border-border px-5 py-3 transition-all duration-500',
          scrolled &&
            'border-border/70 bg-background/70 shadow-2xl shadow-brand/5 backdrop-blur-2xl',
        )}
      >
        <a href="#top" aria-label="KalaiYarangam home">
          <Logo />
        </a>

        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-lg px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <ThemeToggle />
          <Button
            variant="ghost"
            className="hidden font-medium sm:inline-flex"
            asChild
          >
            <a href="#demo">Book Demo</a>
          </Button>
          <Button
            asChild
            className="hidden bg-brand text-brand-foreground hover:bg-brand/90 sm:inline-flex"
          >
            <a href="#pricing">Start Free Trial</a>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      {open && (
        <div className="mx-auto mt-2 max-w-6xl overflow-hidden rounded-2xl border border-border bg-background/95 p-3 shadow-2xl backdrop-blur-2xl lg:hidden">
          <nav className="flex flex-col">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3.5 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
            <div className="mt-2 flex flex-col gap-2 border-t border-border pt-3">
              <Button variant="outline" asChild>
                <a href="#demo" onClick={() => setOpen(false)}>
                  Book Demo
                </a>
              </Button>
              <Button
                asChild
                className="bg-brand text-brand-foreground hover:bg-brand/90"
              >
                <a href="#pricing" onClick={() => setOpen(false)}>
                  Start Free Trial
                </a>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
