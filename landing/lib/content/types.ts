export interface BlogPost {
  slug: string
  title: string
  description: string
  content: string
  author: { name: string; role: string; avatar?: string }
  publishedAt: string
  updatedAt?: string
  readingTime: number
  category: string
  tags: string[]
  featured?: boolean
  featuredImage?: string
}

export interface Tutorial {
  slug: string
  title: string
  description: string
  content: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedTime: string
  prerequisites: string[]
  category: string
  tags: string[]
  featured?: boolean
  steps: TutorialStep[]
}

export interface TutorialStep {
  title: string
  content: string
  code?: { language: string; filename?: string; code: string }[]
}

export interface DocPage {
  slug: string
  title: string
  description: string
  content: string
  category: string
  order: number
  group: string
}

export interface LegalPage {
  slug: string
  title: string
  description: string
  content: string
  lastUpdated: string
}

export interface TocItem {
  id: string
  title: string
  level: number
}
