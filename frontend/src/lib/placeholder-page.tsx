import type { ReactNode } from "react";

/** Minimal placeholder for route scaffolding – replace with real content */
export function PlaceholderPage({
  title,
  description,
}: {
  title: string;
  description?: string;
}): ReactNode {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 p-8 text-center">
      <h1 className="text-2xl font-bold">{title}</h1>
      {description && <p className="text-text-secondary text-sm">{description}</p>}
      <span className="bg-surface-overlay text-text-secondary rounded px-2 py-0.5 text-xs">
        Coming soon
      </span>
    </div>
  );
}
