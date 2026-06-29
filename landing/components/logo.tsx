import { cn } from '@/lib/utils'

export function Logo({
  className,
  showWordmark = true,
}: {
  className?: string
  showWordmark?: boolean
}) {
  return (
    <span className={cn('flex items-center gap-3', className)}>
      <img
        src="/logo.png"
        alt="kalaiArangam"
        className="h-10 w-10 rounded-xl object-contain"
        width={40}
        height={40}
      />
      {showWordmark && (
        <span className="font-heading text-xl font-bold tracking-tight">
          Kalai<span className="text-gradient">Arangam</span>
        </span>
      )}
    </span>
  )
}
