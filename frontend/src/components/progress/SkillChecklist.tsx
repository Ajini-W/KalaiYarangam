"use client";

import { CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/cn";

export interface SkillItem {
  id: string;
  label: string;
  completed: boolean;
}

interface SkillChecklistProps {
  items: SkillItem[];
  title?: string;
  className?: string;
}

export function SkillChecklist({ items, title = "Skills", className }: SkillChecklistProps) {
  if (items.length === 0) return null;

  return (
    <div className={cn("space-y-2", className)}>
      <p className="text-sm font-medium text-text-primary">{title}</p>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.id} className="flex items-center gap-2 text-sm">
            {item.completed ? (
              <CheckCircle2 size={16} className="shrink-0 text-success" aria-hidden />
            ) : (
              <Circle size={16} className="shrink-0 text-text-disabled" aria-hidden />
            )}
            <span className={item.completed ? "text-text-primary" : "text-text-secondary"}>
              {item.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function modulesToSkills(
  records: Array<{ id: string; module?: string | null; percentage: number }>,
): SkillItem[] {
  return records
    .filter((r) => r.module)
    .map((r) => ({
      id: r.id,
      label: r.module as string,
      completed: r.percentage >= 80,
    }));
}
