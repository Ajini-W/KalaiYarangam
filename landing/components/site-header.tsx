'use client'

import { Menu, X, LogIn, Heart } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Logo } from '@/components/logo'
import { ThemeToggle } from '@/components/theme-toggle'
import { PwaInstallButton } from '@/components/pwa-install-button'
import { cn } from '@/lib/utils'

const SAAS_URL = process.env.NEXT_PUBLIC_SAAS_URL || 'https://app.saas.com'

const navLinks = [
  { label: 'Solutions', href: '/solutions' },
  { label: 'Features', href: '/features' },
  { label: 'Use Cases', href: '/use-cases' },
  { label: 'Tutorials', href: '/tutorials' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Blog', href: '/blog' },
]

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20)
          ticking = false
        })
        ticking = true
      }
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const closeMenu = useCallback(() => setOpen(false), [])

  useEffect(() => {
    if (!open) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeMenu()
        triggerRef.current?.focus()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, closeMenu])

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4 sm:pt-4">
      <div
        className={cn(
          'mx-auto flex max-w-6xl items-center justify-between rounded-2xl border border-border px-4 py-2.5 transition-all duration-500 sm:px-5 sm:py-3',
          scrolled
            ? 'border-border/70 bg-white/80 shadow-xl shadow-black/5 backdrop-blur-2xl dark:bg-background/80'
            : 'bg-white/60 backdrop-blur-sm dark:bg-background/60',
        )}
      >
        <a href="/" aria-label="kalaiArangam home" className="shrink-0">
          <Logo />
        </a>

        <nav
          className="hidden items-center gap-1 lg:flex"
          aria-label="Main navigation"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-xl px-3.5 py-2 text-sm font-medium text-muted-foreground transition-all hover:bg-primary/5 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2.5">
          <ThemeToggle />
          <PwaInstallButton />
          <a
            href={`${SAAS_URL}/login`}
            className="hidden items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-all hover:bg-primary/5 hover:text-primary sm:inline-flex"
          >
            <LogIn className="size-4" />
            Log in
          </a>
          <a
            href="https://sarran.formaloo.co/zpwci7"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-1.5 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30 sm:inline-flex"
          >
            <Heart className="size-3.5" />
            Wishlist
          </a>
          <button
            ref={triggerRef}
            onClick={() => setOpen((v) => !v)}
            className="grid size-9 place-items-center rounded-xl text-muted-foreground transition-colors hover:bg-primary/5 hover:text-primary lg:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div
          id="mobile-menu"
          ref={menuRef}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
          className="mx-auto mt-2 max-w-6xl overflow-hidden rounded-2xl border border-border bg-white p-4 shadow-2xl dark:bg-background lg:hidden"
        >
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-all hover:bg-primary/5 hover:text-primary"
              >
                {link.label}
              </a>
            ))}
            <div className="mt-3 flex flex-col gap-2 border-t border-border pt-3">
              <a
                href={`${SAAS_URL}/login`}
                onClick={closeMenu}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 text-sm font-semibold text-foreground transition-all hover:bg-muted"
              >
                <LogIn className="size-4" />
                Log in
              </a>
              <a
                href="https://sarran.formaloo.co/zpwci7"
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeMenu}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 transition-all hover:bg-primary/90"
              >
                <Heart className="size-4" />
                wishlist
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
