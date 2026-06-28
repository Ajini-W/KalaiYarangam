"use client";

import { Lock } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/cn";

interface SessionLockIndicatorProps {
  isLocked: boolean;
  className?: string;
}

export function SessionLockIndicator({ isLocked, className }: SessionLockIndicatorProps) {
  if (!isLocked) return null;

  return (
    <Badge
      variant="warning"
      className={cn("gap-1", className)}
      title="This session is locked. Attendance cannot be edited until an administrator unlocks it."
    >
      <Lock size={12} aria-hidden />
      Locked
    </Badge>
  );
}
