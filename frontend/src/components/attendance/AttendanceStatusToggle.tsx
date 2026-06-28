"use client";

import { cn } from "@/lib/cn";
import type { AttendanceStatus } from "@/types/attendance";

interface AttendanceStatusToggleProps {
  value: AttendanceStatus;
  onChange: (status: AttendanceStatus) => void;
  disabled?: boolean;
  className?: string;
}

const OPTIONS: { value: AttendanceStatus; label: string; activeClass: string }[] = [
  { value: "PRESENT", label: "Present", activeClass: "bg-success-light text-success-700 border-success" },
  { value: "ABSENT", label: "Absent", activeClass: "bg-danger-light text-danger-700 border-danger" },
  { value: "LATE", label: "Late", activeClass: "bg-warning-light text-warning-700 border-warning" },
];

export function AttendanceStatusToggle({
  value,
  onChange,
  disabled,
  className,
}: AttendanceStatusToggleProps) {
  return (
    <div
      className={cn("inline-flex flex-wrap gap-1", className)}
      role="group"
      aria-label="Attendance status"
    >
      {OPTIONS.map((option) => {
        const isActive = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            disabled={disabled}
            aria-pressed={isActive}
            onClick={() => onChange(option.value)}
            className={cn(
              "rounded-[var(--radius-sm)] border px-2.5 py-1 text-xs font-medium transition-colors",
              "disabled:cursor-not-allowed disabled:opacity-50",
              isActive
                ? option.activeClass
                : "border-border bg-surface text-text-secondary hover:bg-surface-overlay",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export function AttendanceStatusBadge({ status }: { status: AttendanceStatus }) {
  const map = {
    PRESENT: "success",
    ABSENT: "danger",
    LATE: "warning",
    EXCUSED: "info",
  } as const;

  const labels = {
    PRESENT: "Present",
    ABSENT: "Absent",
    LATE: "Late",
    EXCUSED: "Excused",
  };

  return (
    <span className={cn("inline-flex items-center rounded-[var(--radius-xs)] px-2 py-0.5 text-xs font-medium", {
      "bg-success-light text-success-700": status === "PRESENT",
      "bg-danger-light text-danger-700": status === "ABSENT",
      "bg-warning-light text-warning-700": status === "LATE",
      "bg-info-light text-info-700": status === "EXCUSED",
    })}>
      {labels[status]}
    </span>
  );
}
