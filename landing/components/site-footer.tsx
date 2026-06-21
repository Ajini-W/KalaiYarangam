import Link from 'next/link'
import { Globe, Mail, MessageCircle, Send } from 'lucide-react'
import { Logo } from '@/components/logo'

const columns = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '#platform' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'Tutorials', href: '/tutorials' },
      { label: 'Documentation', href: '/docs' },
    ],
  },
  {
    title: 'Industries',
    links: [
      { label: 'Academies', href: '#industries' },
      { label: 'Rentals', href: '#industries' },
      { label: 'Events', href: '#industries' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Blog', href: '/blog' },
      { label: 'Help Center', href: '/docs' },
      { label: 'API Reference', href: '/docs/api-authentication' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '#contact' },
      { label: 'Contact', href: '#contact' },
      { label: 'Code of Conduct', href: '/code-of-conduct' },
      { label: 'Community Guidelines', href: '/community-guidelines' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/legal/privacy-policy' },
      { label: 'Terms & Conditions', href: '/legal/terms-and-conditions' },
      { label: 'Refund Policy', href: '/legal/refund-policy' },
      { label: 'Cookie Policy', href: '/legal/cookie-policy' },
      { label: 'Accessibility', href: '/legal/accessibility-statement' },
    ],
  },
]

const socials = [
  { icon: Globe, label: 'Website', href: '#' },
  { icon: Mail, label: 'Email', href: 'mailto:support@kalaiyarangam.com' },
  { icon: MessageCircle, label: 'WhatsApp', href: '#' },
  { icon: Send, label: 'Telegram', href: '#' },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-muted/30 px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(5,1fr)]">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              The intelligent business operating system for Training Institutes,
              Rental Businesses, and Event Companies.
            </p>
            <div className="mt-5 flex gap-2">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="grid size-9 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-brand/40 hover:text-brand"
                >
                  <social.icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="font-heading text-sm font-semibold">
                {column.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-sm text-muted-foreground sm:flex-row">
          <p>&copy; {new Date().getFullYear()} KalaiYarangam. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/legal/privacy-policy" className="transition-colors hover:text-foreground">Privacy</Link>
            <Link href="/legal/terms-and-conditions" className="transition-colors hover:text-foreground">Terms</Link>
            <Link href="/legal/cookie-policy" className="transition-colors hover:text-foreground">Cookies</Link>
            <Link href="/legal/disclaimer" className="transition-colors hover:text-foreground">Disclaimer</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
