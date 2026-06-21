import { cn } from "@/lib/cn";

const sizes = { xs: 16, sm: 20, md: 24, lg: 32, xl: 48 } as const;

export interface SpinnerProps {
  size?: keyof typeof sizes;
  className?: string;
  label?: string;
}

export function Spinner({ size = "md", className, label = "Loading…" }: SpinnerProps) {
  const px = sizes[size];
  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 24 24"
      fill="none"
      className={cn("animate-spin text-primary", className)}
      role="status"
      aria-label={label}
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
      <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
