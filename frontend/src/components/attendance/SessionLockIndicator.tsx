"use client";

import * as React from "react";
import { Lock, Info } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/cn";

interface SessionLockIndicatorProps {
  isLocked: boolean;
  className?: string;
}

export function SessionLockIndicator({ isLocked, className }: SessionLockIndicatorProps) {
  const [showTooltip, setShowTooltip] = React.useState(false);

  if (!isLocked) return null;

  return (
    <div className="relative inline-block">
      <Badge
        variant="warning"
        className={cn("gap-1 cursor-help", className)}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
        aria-describedby="lock-tooltip"
      >
        <Lock size={12} aria-hidden />
        Locked
      </Badge>
      
      {showTooltip && (
        <div
          id="lock-tooltip"
          className="absolute left-0 top-full z-50 mt-2 w-64 rounded-[var(--radius-md)] border border-border bg-surface-raised p-3 shadow-[var(--shadow-3)] text-xs text-text-secondary"
          role="tooltip"
        >
          <div className="flex items-start gap-2">
            <Info className="mt-0.5 shrink-0 text-warning" size={14} />
            <p>
              This session is locked. Attendance cannot be edited until an administrator unlocks it.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
