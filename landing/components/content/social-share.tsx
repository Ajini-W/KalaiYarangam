'use client'

import { Share2, LinkIcon, Check } from 'lucide-react'
import { useState } from 'react'

export function SocialShare({
  title,
  url,
}: {
  title: string
  url: string
}) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground">Share:</span>
      <a
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="grid size-8 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-brand/40 hover:text-brand"
        aria-label="Share on Twitter"
      >
        <Share2 className="size-3.5" />
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="grid size-8 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-brand/40 hover:text-brand"
        aria-label="Share on LinkedIn"
      >
        <Share2 className="size-3.5" />
      </a>
      <button
        onClick={handleCopy}
        className="grid size-8 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-brand/40 hover:text-brand"
        aria-label={copied ? 'Link copied' : 'Copy link'}
      >
        {copied ? <Check className="size-3.5 text-success" /> : <LinkIcon className="size-3.5" />}
      </button>
    </div>
  )
}
