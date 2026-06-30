"use client";

import * as React from "react";
import { cn } from "@/lib/cn";
import { Card } from "@/components/ui/Card";
import { Switch } from "@/components/ui/Switch";

export interface ModuleToggleCardProps {
  title: string;
  description: string;
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  disabled?: boolean;
}

export function ModuleToggleCard({ title, description, enabled, onToggle, disabled }: ModuleToggleCardProps) {
  const id = `module-${title.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <Card className={cn(
      "flex items-start justify-between gap-4 p-5 transition-colors",
      enabled ? "bg-surface" : "bg-surface-overlay/50",
    )}>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className={cn(
            "text-sm font-semibold",
            enabled ? "text-text-primary" : "text-text-secondary",
          )}>
            {title}
          </h3>
          {!enabled && <span className="text-xs text-text-placeholder">Disabled</span>}
        </div>
        <p className="mt-1 text-sm text-text-secondary">{description}</p>
      </div>
      <Switch
        id={id}
        checked={enabled}
        onCheckedChange={onToggle}
        disabled={disabled}
      />
    </Card>
  );
}
