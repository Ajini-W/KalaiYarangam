import type { Metadata } from "next";
import { Mail, MessageSquare } from "lucide-react";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <section className="bg-black min-h-screen pt-32 pb-20 px-4">
      <div className="mx-auto max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand mb-4">Contact</p>
        <h1 className="text-4xl font-bold text-white mb-4">Get in touch</h1>
        <p className="text-zinc-400 mb-12">
          Have a question or ready to get started? We&apos;ll respond within 24 hours.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 mb-12">
          <a
            href={`mailto:${siteConfig.email}`}
            className="flex items-center gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 hover:border-brand/30 transition-all"
          >
            <Mail className="text-brand" size={24} />
            <div>
              <p className="text-sm font-semibold text-white">Email us</p>
              <p className="text-xs text-zinc-500 mt-0.5">{siteConfig.email}</p>
            </div>
          </a>
          <div className="flex items-center gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-6">
            <MessageSquare className="text-brand" size={24} />
            <div>
              <p className="text-sm font-semibold text-white">Live Chat</p>
              <p className="text-xs text-zinc-500 mt-0.5">Mon–Fri, 9am–6pm IST</p>
            </div>
          </div>
        </div>

        <form className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Name</label>
              <input
                type="text"
                placeholder="Your name"
                className="w-full rounded-md border border-white/[0.06] bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-zinc-600 focus:border-brand/50 focus:outline-none focus:ring-1 focus:ring-brand/30 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Email</label>
              <input
                type="email"
                placeholder="you@company.com"
                className="w-full rounded-md border border-white/[0.06] bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-zinc-600 focus:border-brand/50 focus:outline-none focus:ring-1 focus:ring-brand/30 transition-colors"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">Business type</label>
            <select className="w-full rounded-md border border-white/[0.06] bg-white/[0.03] px-4 py-3 text-sm text-white focus:border-brand/50 focus:outline-none focus:ring-1 focus:ring-brand/30 transition-colors">
              <option value="" className="bg-zinc-900">Select your business</option>
              <option value="training" className="bg-zinc-900">Training Center</option>
              <option value="rental" className="bg-zinc-900">Rental Business</option>
              <option value="events" className="bg-zinc-900">Event Organizer</option>
              <option value="other" className="bg-zinc-900">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">Message</label>
            <textarea
              rows={5}
              placeholder="Tell us about your business and what you need..."
              className="w-full rounded-md border border-white/[0.06] bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-zinc-600 focus:border-brand/50 focus:outline-none focus:ring-1 focus:ring-brand/30 transition-colors resize-none"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-brand py-3 text-sm font-semibold text-black hover:bg-brand/90 transition-colors"
          >
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
}
