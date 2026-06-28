import type { Metadata } from "next";
import Link from "next/link";
import { Clock, Tag, ArrowRight, Search } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Breadcrumbs } from "@/components/content/breadcrumbs";
import { ContentSearch } from "@/components/content/search";
import { NewsletterCta } from "@/components/content/newsletter-cta";
import { getAllBlogPosts, getAllBlogCategories } from "@/lib/content";
import { generateMetadata as genMeta } from "@/lib/seo";
import { Suspense } from "react";

export const metadata: Metadata = genMeta({
  title: "Blog - Industry Insights & Product Updates",
  description:
    "Read about training academy management, rental business operations, event planning, and product updates from kalaiArangam.",
  url: "https://kalaiArangam.com/blog",
});

const POSTS_PER_PAGE = 9;

export default function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string; tag?: string }>;
}) {
  const allPosts = getAllBlogPosts();
  const categories = getAllBlogCategories();

  let posts = allPosts;

  // Filtering will be handled client-side via search params
  const page = 1;
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  const paginatedPosts = posts.slice(0, POSTS_PER_PAGE);

  return (
    <div className="min-h-dvh bg-background">
      <SiteHeader />
      <main className="px-4 pb-24 pt-28">
        <div className="mx-auto max-w-6xl">
          <Breadcrumbs items={[{ label: "Blog" }]} />

          <div className="mb-10">
            <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl">
              Blog
            </h1>
            <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
              Industry insights, product updates, and best practices for
              training academies, rental businesses, and event companies.
            </p>
          </div>

          <div className="mb-8 grid gap-4 sm:grid-cols-[1fr_auto]">
            <Suspense>
              <ContentSearch
                items={allPosts.map((p) => ({
                  slug: p.slug,
                  title: p.title,
                  description: p.description,
                  category: p.category,
                }))}
                basePath="/blog"
                placeholder="Search articles..."
              />
            </Suspense>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <span
                  key={cat}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground"
                >
                  <Tag className="size-3" />
                  {cat}
                </span>
              ))}
            </div>
          </div>

          {/* Featured Post */}
          {paginatedPosts[0]?.featured && (
            <Link
              href={`/blog/${paginatedPosts[0].slug}`}
              className="group mb-8 block rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-border/80 hover:shadow-xl sm:p-8"
            >
              <span className="mb-3 inline-flex items-center rounded-full bg-brand/10 px-2.5 py-0.5 text-xs font-medium text-brand">
                Featured
              </span>
              <h2 className="font-heading text-2xl font-bold transition-colors group-hover:text-brand sm:text-3xl">
                {paginatedPosts[0].title}
              </h2>
              <p className="mt-3 max-w-3xl text-muted-foreground">
                {paginatedPosts[0].description}
              </p>
              <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                <span>{paginatedPosts[0].author.name}</span>
                <span>{paginatedPosts[0].publishedAt}</span>
                <span className="flex items-center gap-1">
                  <Clock className="size-3.5" />
                  {paginatedPosts[0].readingTime} min read
                </span>
                <ArrowRight className="ml-auto size-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          )}

          {/* Post Grid */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {paginatedPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group rounded-xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-border/80 hover:shadow-lg"
              >
                <span className="mb-2 inline-flex items-center gap-1 rounded-full bg-brand/10 px-2 py-0.5 text-[10px] font-medium text-brand">
                  {post.category}
                </span>
                <h3 className="font-heading text-base font-semibold transition-colors group-hover:text-brand">
                  {post.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                  {post.description}
                </p>
                <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{post.author.name}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="size-3" />
                    {post.readingTime} min
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {paginatedPosts.length === 0 && (
            <div className="py-20 text-center text-muted-foreground">
              <p className="text-lg">No articles found.</p>
              <p className="mt-2 text-sm">Check back soon for new content.</p>
            </div>
          )}

          <NewsletterCta />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
