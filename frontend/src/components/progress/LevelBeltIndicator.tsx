"use client";

import { cn } from "@/lib/cn";

const BELT_COLORS: Record<string, string> = {
  white: "bg-gray-100 border-gray-300 text-gray-800",
  yellow: "bg-yellow-200 border-yellow-400 text-yellow-900",
  orange: "bg-orange-200 border-orange-400 text-orange-900",
  green: "bg-green-200 border-green-500 text-green-900",
  blue: "bg-blue-200 border-blue-500 text-blue-900",
  brown: "bg-amber-700 border-amber-900 text-white",
  black: "bg-gray-900 border-gray-950 text-white",
};

function resolveBeltClass(grade?: string | null, percentage?: number) {
  if (grade) {
    const key = grade.toLowerCase();
    if (BELT_COLORS[key]) return BELT_COLORS[key];
  }
  if (percentage == null) return BELT_COLORS.white;
  if (percentage >= 90) return BELT_COLORS.black;
  if (percentage >= 75) return BELT_COLORS.brown;
  if (percentage >= 60) return BELT_COLORS.blue;
  if (percentage >= 45) return BELT_COLORS.green;
  if (percentage >= 30) return BELT_COLORS.orange;
  if (percentage >= 15) return BELT_COLORS.yellow;
  return BELT_COLORS.white;
}

interface LevelBeltIndicatorProps {
  grade?: string | null;
  percentage?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LevelBeltIndicator({
  grade,
  percentage,
  size = "md",
  className,
}: LevelBeltIndicatorProps) {
  const beltClass = resolveBeltClass(grade, percentage);
  const label = grade ?? (percentage != null ? `${Math.round(percentage)}%` : "Beginner");

  return (
    <div className={cn("flex flex-col items-center gap-1", className)}>
      <div
        className={cn(
          "rounded-full border-2 font-semibold uppercase tracking-wide",
          beltClass,
          size === "sm" && "h-8 w-8 text-[10px]",
          size === "md" && "h-12 w-12 text-xs",
          size === "lg" && "h-16 w-16 text-sm",
          "flex items-center justify-center",
        )}
        aria-label={`Level: ${label}`}
      >
        {grade ? grade.slice(0, 2) : "★"}
      </div>
      <span className="text-xs text-text-secondary">{label}</span>
    </div>
  );
}
