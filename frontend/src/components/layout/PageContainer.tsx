import * as React from "react";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/cn";

export interface PageContainerProps {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  back?: () => void;
  children: React.ReactNode;
  className?: string;
  /** Remove default padding/max-width (e.g. full-bleed tables) */
  fluid?: boolean;
}

export function PageContainer({ title, subtitle, actions, back, children, className, fluid }: PageContainerProps) {
  return (
    <div className={cn("flex flex-col flex-1", !fluid && "mx-auto w-full max-w-screen-xl px-4 py-6 md:px-6 lg:px-8", className)}>
      {(title || actions || back) && (
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            {back && (
              <button onClick={back} className="rounded-[var(--radius-sm)] p-1.5 text-text-secondary hover:bg-surface-overlay transition-colors" aria-label="Go back">
                <ArrowLeft size={18} />
              </button>
            )}
            <div>
              {title && <h1 className="text-xl font-semibold text-text-primary">{title}</h1>}
              {subtitle && <p className="text-sm text-text-secondary">{subtitle}</p>}
            </div>
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </div>
  );
}
