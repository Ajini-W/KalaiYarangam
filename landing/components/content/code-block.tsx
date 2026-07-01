'use client'

import { Check, Copy } from 'lucide-react'
import { useState } from 'react'

export function CodeBlock({
  code,
  language = 'text',
  filename,
}: {
  code: string
  language?: string
  filename?: string
}) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="my-4 overflow-hidden rounded-xl border border-border">
      {filename && (
        <div className="flex items-center justify-between border-b border-border bg-muted/50 px-4 py-2">
          <span className="text-xs font-medium text-muted-foreground">{filename}</span>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground/60">{language}</span>
        </div>
      )}
      <div className="relative">
        <pre className="overflow-x-auto bg-muted/30 p-4 text-sm leading-relaxed">
          <code>{code}</code>
        </pre>
        <button
          onClick={handleCopy}
          className="absolute right-3 top-3 grid size-7 place-items-center rounded-md border border-border bg-background/80 text-muted-foreground backdrop-blur-sm transition-colors hover:text-foreground"
          aria-label={copied ? 'Copied' : 'Copy code'}
        >
          {copied ? <Check className="size-3.5 text-success" /> : <Copy className="size-3.5" />}
        </button>
      </div>
    </div>
  )
}
