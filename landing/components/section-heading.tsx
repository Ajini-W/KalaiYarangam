import { Reveal } from '@/components/reveal'
import { cn } from '@/lib/utils'

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
  align = 'center',
  accentColor = 'primary',
}: {
  eyebrow?: string
  title: React.ReactNode
  description?: string
  className?: string
  align?: 'center' | 'left'
  accentColor?: 'primary' | 'blue' | 'red' | 'green' | 'cyan'
}) {
  const accentColors = {
    primary: 'bg-primary/10 text-primary border-primary/20',
    blue: 'bg-accent-blue/10 text-accent-blue border-accent-blue/20',
    red: 'bg-accent-red/10 text-accent-red border-accent-red/20',
    green: 'bg-accent-green/10 text-accent-green border-accent-green/20',
    cyan: 'bg-accent-cyan/10 text-accent-cyan border-accent-cyan/20',
  }

  return (
    <Reveal
      className={cn(
        'max-w-2xl',
        align === 'center' ? 'mx-auto text-center' : 'text-left',
        className,
      )}
    >
      {eyebrow && (
        <span
          className={cn(
            'inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-widest',
            accentColors[accentColor],
          )}
        >
          {eyebrow}
        </span>
      )}
      <h2 className="mt-5 text-balance font-heading text-3xl font-bold tracking-tight sm:text-4xl md:text-[2.75rem] md:leading-[1.15]">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
          {description}
        </p>
      )}
    </Reveal>
  )
}
