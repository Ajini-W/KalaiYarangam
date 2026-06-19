import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Blog Post" };

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <section className="bg-black min-h-screen pt-32 pb-20 px-4">
      <div className="mx-auto max-w-3xl">
        <Link href="/blog" className="text-xs text-zinc-500 hover:text-brand mb-6 inline-block">
          ← Back to Blog
        </Link>
        <h1 className="text-3xl font-bold text-white mb-4 capitalize">
          {slug.replace(/-/g, " ")}
        </h1>
        <p className="text-zinc-400">Article content coming soon.</p>
      </div>
    </section>
  );
}
