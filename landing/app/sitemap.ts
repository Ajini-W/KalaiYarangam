import { MetadataRoute } from 'next'
import { getAllBlogPosts, getAllTutorials, getAllDocs, getAllLegalPages } from '@/lib/content'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://kalaiArangam.com'

  const staticPages = [
    { url: base, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 1 },
    { url: `${base}/blog`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${base}/tutorials`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${base}/docs`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${base}/legal`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.3 },
    { url: `${base}/code-of-conduct`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.2 },
    { url: `${base}/community-guidelines`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.2 },
  ]

  const blogPages = getAllBlogPosts().map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt ?? post.publishedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  const tutorialPages = getAllTutorials().map((tutorial) => ({
    url: `${base}/tutorials/${tutorial.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  const docPages = getAllDocs().map((doc) => ({
    url: `${base}/docs/${doc.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }))

  const legalPages = getAllLegalPages().map((page) => ({
    url: `${base}/legal/${page.slug}`,
    lastModified: new Date(page.lastUpdated),
    changeFrequency: 'yearly' as const,
    priority: 0.2,
  }))

  return [...staticPages, ...blogPages, ...tutorialPages, ...docPages, ...legalPages]
}
