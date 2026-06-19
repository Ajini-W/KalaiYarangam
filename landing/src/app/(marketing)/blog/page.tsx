import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Blog" };

const posts = [
  {
    slug: "how-to-reduce-no-shows",
    title: "How to Reduce No-Shows by 60% with Automated Reminders",
    excerpt: "No-shows cost businesses thousands every month. Here's how automated SMS and email reminders can cut them dramatically.",
    date: "June 10, 2026",
    category: "Tips",
    readTime: "4 min",
  },
  {
    slug: "online-booking-guide",
    title: "The Complete Guide to Setting Up Online Bookings for Your Training Center",
    excerpt: "Step-by-step guide to moving your booking process online and saving 5+ hours per week on admin work.",
    date: "May 28, 2026",
    category: "Guide",
    readTime: "7 min",
  },
  {
    slug: "rental-business-tips",
    title: "5 Ways to Improve Utilization Rates for Your Rental Business",
    excerpt: "Most rental businesses leave 30–40% utilization on the table. Learn how to fix that with data-driven scheduling.",
    date: "May 15, 2026",
    category: "Business",
    readTime: "5 min",
  },
];

export default function BlogPage() {
  return (
    <section className="bg-black min-h-screen pt-32 pb-20 px-4">
      <div className="mx-auto max-w-4xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand mb-4">Blog</p>
        <h1 className="text-4xl font-bold text-white mb-12">Insights & Guides</h1>

        <div className="space-y-4">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block rounded-xl border border-white/[0.06] bg-zinc-950 p-6 hover:border-brand/30 transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="rounded-full border border-brand/30 bg-brand/10 px-2.5 py-0.5 text-xs font-medium text-brand">
                  {post.category}
                </span>
                <span className="text-xs text-zinc-600">{post.date}</span>
                <span className="text-xs text-zinc-600">·</span>
                <span className="text-xs text-zinc-600">{post.readTime} read</span>
              </div>
              <h2 className="text-lg font-semibold text-white group-hover:text-brand transition-colors mb-2">
                {post.title}
              </h2>
              <p className="text-sm text-zinc-500 leading-relaxed">{post.excerpt}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
