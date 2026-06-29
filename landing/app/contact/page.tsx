'use client'

import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Reveal } from '@/components/reveal'
import { Mail, MessageCircle, Phone, MapPin } from 'lucide-react'

const contactMethods = [
  { icon: Mail, label: 'Email', value: 'support@kalaiArangam.com', href: 'mailto:support@kalaiArangam.com' },
  { icon: MessageCircle, label: 'WhatsApp', value: 'Chat with us', href: '#' },
  { icon: Phone, label: 'Phone', value: '+91 XXX XXX XXXX', href: 'tel:+91XXXXXXXXXX' },
  { icon: MapPin, label: 'Location', value: 'Tamil Nadu, India', href: '#' },
]

export default function ContactPage() {
  return (
    <div className="min-h-dvh bg-background">
      <SiteHeader />
      <main className="pt-28 pb-24">
        <div className="mx-auto max-w-4xl px-4">
          <Reveal className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-accent-blue/20 bg-accent-blue/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-accent-blue">
              Contact
            </span>
            <h1 className="mt-5 text-balance font-heading text-4xl font-bold tracking-tight sm:text-5xl">
              Get in touch
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              Have questions? We would love to hear from you.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-4 sm:grid-cols-2">
            {contactMethods.map((m, i) => (
              <Reveal key={m.label} delay={i * 0.08}>
                <a href={m.href} className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/5 hover:border-primary/20">
                  <div className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
                    <m.icon className="size-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{m.label}</p>
                    <p className="mt-0.5 font-semibold group-hover:text-primary transition-colors">{m.value}</p>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-14">
            <div className="rounded-3xl border border-border bg-card p-8 sm:p-10">
              <h2 className="font-heading text-xl font-bold">Send us a message</h2>
              <p className="mt-1 text-sm text-muted-foreground">Fill out the form and we will get back to you within 24 hours.</p>
              <form className="mt-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="mb-1.5 block text-sm font-medium">Name</label>
                    <input id="name" type="text" placeholder="Your name" className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20" />
                  </div>
                  <div>
                    <label htmlFor="email" className="mb-1.5 block text-sm font-medium">Email</label>
                    <input id="email" type="email" placeholder="you@example.com" className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20" />
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="mb-1.5 block text-sm font-medium">Subject</label>
                  <input id="subject" type="text" placeholder="How can we help?" className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20" />
                </div>
                <div>
                  <label htmlFor="message" className="mb-1.5 block text-sm font-medium">Message</label>
                  <textarea id="message" rows={5} placeholder="Tell us more..." className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none" />
                </div>
                <button type="submit" className="inline-flex h-12 items-center justify-center gap-2 whitespace-nowrap rounded-2xl px-8 text-sm font-semibold text-white shadow-md shadow-primary/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/30" style={{ background: 'linear-gradient(135deg, #FFB21D 0%, #FF8A00 100%)' }}>
                  Send Message
                </button>
              </form>
            </div>
          </Reveal>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
