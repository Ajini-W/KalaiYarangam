"use client";

import { FlaskConical } from "lucide-react";
import { cn } from "@/lib/cn";

interface DevModeBadgeProps {
  visible?: boolean;
  className?: string;
}

export function DevModeBadge({ visible = true, className }: DevModeBadgeProps) {
  if (!visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-warning/30 bg-warning/10 px-3 py-1 text-xs font-medium text-warning",
        className,
      )}
    >
      
      
    </div>
  );
}
