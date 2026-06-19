import { cn } from '@/lib/utils'

export function Logo({
  className,
  showWordmark = true,
}: {
  className?: string
  showWordmark?: boolean
}) {
  return (
    <span className={cn('flex items-center gap-2.5', className)}>
      <span
        aria-hidden
        className="relative grid size-9 place-items-center rounded-xl bg-gradient-to-br from-brand to-accent-cyan text-brand-foreground shadow-lg shadow-brand/30"
      >
        <span className="absolute inset-[3px] rounded-lg border border-white/25" />
        <KalaiMark className="size-5" />
      </span>
      {showWordmark && (
        <span className="font-heading text-lg font-bold tracking-tight">
          Kalai<span className="text-gradient">Yarangam</span>
        </span>
      )}
    </span>
  )
}

function KalaiMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden
    >
      <path
        d="M5 4v16M5 12l8-8M5 12l8 8M14 4c3.5 2 5 5 5 8s-1.5 6-5 8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
