import { cn } from "@/lib/cn";

export interface SkeletonProps { className?: string }

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      aria-hidden
      className={cn("animate-pulse rounded-[var(--radius-sm)] bg-surface-overlay", className)}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-[var(--radius-md)] border border-border p-4 space-y-3">
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-4/5" />
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      <Skeleton className="h-9 w-full rounded-[var(--radius-sm)]" />
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  );
}
