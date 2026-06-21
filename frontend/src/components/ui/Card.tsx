import * as React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/cn";

/* ─── Card ────────────────────────────────────────────────────────────────── */
const cardVariants = {
  default:  "bg-surface border border-border",
  bordered: "bg-surface border-2 border-border",
  elevated: "bg-surface shadow-[var(--shadow-2)]",
} as const;

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof cardVariants;
}

export function Card({ variant = "default", className, ...props }: CardProps) {
  return <div className={cn("rounded-[var(--radius-md)]", cardVariants[variant], className)} {...props} />;
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex items-center justify-between px-5 pt-5 pb-3", className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("text-sm font-semibold text-text-primary", className)} {...props} />;
}

export function CardBody({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-5 pb-5", className)} {...props} />;
}

export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("border-t border-border-subtle px-5 py-3", className)} {...props} />;
}

/* ─── StatCard ────────────────────────────────────────────────────────────── */
export interface StatCardProps {
  title: string;
  value: string | number;
  delta?: string | number;
  deltaType?: "increase" | "decrease" | "neutral";
  icon?: React.ReactNode;
  className?: string;
}

const deltaConfig = {
  increase: { color: "text-success", icon: TrendingUp },
  decrease: { color: "text-danger",  icon: TrendingDown },
  neutral:  { color: "text-text-secondary", icon: Minus },
} as const;

export function StatCard({ title, value, delta, deltaType = "neutral", icon, className }: StatCardProps) {
  const { color, icon: DeltaIcon } = deltaConfig[deltaType];
  return (
    <Card className={cn("p-5", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">{title}</p>
          <p className="mt-1 text-2xl font-bold text-text-primary tabular-nums">{value}</p>
          {delta != null && (
            <p className={cn("mt-1 flex items-center gap-1 text-xs font-medium", color)}>
              <DeltaIcon size={12} />
              {delta}
            </p>
          )}
        </div>
        {icon && (
          <div className="shrink-0 rounded-[var(--radius-md)] bg-[var(--primary)]/10 p-2.5 text-primary">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}
