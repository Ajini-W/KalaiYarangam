export interface SeoMetadata {
  title: string
  description: string
  url: string
  image?: string
  type?: 'website' | 'article'
  publishedAt?: string
  updatedAt?: string
  author?: string
}

export function generateMetadata(seo: SeoMetadata) {
  const siteName = 'KalaiYarangam'
  const title = seo.title.includes(siteName) ? seo.title : `${seo.title} | ${siteName}`

  return {
    title,
    description: seo.description,
    openGraph: {
      title,
      description: seo.description,
      url: seo.url,
      siteName,
      images: seo.image ? [{ url: seo.image, width: 1200, height: 630 }] : [],
      type: seo.type ?? 'website',
      ...(seo.publishedAt && { publishedTime: seo.publishedAt }),
      ...(seo.updatedAt && { modifiedTime: seo.updatedAt }),
      ...(seo.author && { authors: [seo.author] }),
    },
    twitter: {
      card: 'summary_large_image' as const,
      title,
      description: seo.description,
      images: seo.image ? [seo.image] : [],
    },
    alternates: {
      canonical: seo.url,
    },
  }
}

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'KalaiYarangam',
    url: 'https://kalaiyarangam.com',
    logo: 'https://kalaiyarangam.com/icon.svg',
    description:
      'Multi-tenant SaaS ERP for Training Institutes, Rental Businesses, and Event Management Companies.',
    sameAs: [],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: 'support@kalaiyarangam.com',
    },
  }
}

export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'KalaiYarangam',
    url: 'https://kalaiyarangam.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://kalaiyarangam.com/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  }
}

export function generateArticleSchema(post: {
  title: string
  description: string
  publishedAt: string
  updatedAt?: string
  author: string
  url: string
  image?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    url: post.url,
    image: post.image,
    publisher: {
      '@type': 'Organization',
      name: 'KalaiYarangam',
      logo: {
        '@type': 'ImageObject',
        url: 'https://kalaiyarangam.com/icon.svg',
      },
    },
  }
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function generateFaqSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}
