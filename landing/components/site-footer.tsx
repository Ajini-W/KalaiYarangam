import { Globe, Mail, MessageCircle, Send } from 'lucide-react'
import { Logo } from '@/components/logo'

const columns = [
  {
    title: 'Product',
    links: ['Features', 'Pricing', 'Tutorials', 'Documentation'],
  },
  {
    title: 'Industries',
    links: ['Academies', 'Rentals', 'Events'],
  },
  {
    title: 'Resources',
    links: ['Blog', 'Help Center', 'API Documentation'],
  },
  {
    title: 'Company',
    links: ['About', 'Contact', 'Privacy Policy', 'Terms'],
  },
]

const socials = [
  { icon: Globe, label: 'Website' },
  { icon: Mail, label: 'Email' },
  { icon: MessageCircle, label: 'WhatsApp' },
  { icon: Send, label: 'Telegram' },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-muted/30 px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
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
                  href="#"
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
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-sm text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} KalaiYarangam. All rights reserved.</p>
          <p>Made for businesses that run on one platform.</p>
        </div>
      </div>
    </footer>
  )
}
