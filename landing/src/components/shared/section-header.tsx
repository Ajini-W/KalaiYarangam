import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  center?: boolean;
  className?: string;
};

export function SectionHeader({ eyebrow, title, description, center = true, className }: Props) {
  return (
    <div className={cn("mb-12", center && "text-center", className)}>
      {eyebrow && (
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-brand">
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">{title}</h2>
      {description && (
        <p className="mt-4 text-zinc-400 max-w-2xl mx-auto text-sm sm:text-base">{description}</p>
      )}
    </div>
  );
}
