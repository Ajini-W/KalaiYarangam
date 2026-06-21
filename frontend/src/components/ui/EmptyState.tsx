import * as React from "react";
import { Inbox, SearchX, ShieldOff, PlusCircle } from "lucide-react";
import { Button } from "./Button";
import { cn } from "@/lib/cn";

export interface EmptyStateProps {
  variant?: "no-data" | "no-results" | "no-access" | "first-use";
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
  className?: string;
}

const defaultIcons = {
  "no-data":    <Inbox size={48} className="text-text-disabled" />,
  "no-results": <SearchX size={48} className="text-text-disabled" />,
  "no-access":  <ShieldOff size={48} className="text-text-disabled" />,
  "first-use":  <PlusCircle size={48} className="text-primary" />,
};

export function EmptyState({ variant = "no-data", icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3 py-16 text-center", className)}>
      {icon ?? defaultIcons[variant]}
      <div>
        <p className="text-sm font-semibold text-text-primary">{title}</p>
        {description && <p className="mt-1 text-sm text-text-secondary max-w-xs">{description}</p>}
      </div>
      {action && <Button size="sm" onClick={action.onClick}>{action.label}</Button>}
    </div>
  );
}

export interface ErrorStateProps {
  code?: 403 | 404 | 500;
  title?: string;
  description?: string;
  action?: { label: string; onClick: () => void };
  className?: string;
}

const errorDefaults: Record<number, { title: string; description: string }> = {
  403: { title: "Access Denied",    description: "You don't have permission to view this page." },
  404: { title: "Page Not Found",   description: "The page you're looking for doesn't exist." },
  500: { title: "Something Went Wrong", description: "An unexpected error occurred. Please try again." },
};

export function ErrorState({ code = 404, title, description, action, className }: ErrorStateProps) {
  const defaults = errorDefaults[code];
  return (
    <div className={cn("flex flex-col items-center justify-center gap-4 py-20 text-center", className)}>
      <span className="text-6xl font-bold text-border">{code}</span>
      <div>
        <p className="text-lg font-semibold text-text-primary">{title ?? defaults.title}</p>
        <p className="mt-1 text-sm text-text-secondary max-w-sm">{description ?? defaults.description}</p>
      </div>
      {action && <Button onClick={action.onClick}>{action.label}</Button>}
    </div>
  );
}
