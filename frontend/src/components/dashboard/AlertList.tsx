"use client";

import Link from "next/link";
import { AlertTriangle, Info, Bell } from "lucide-react";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import type { DashboardAlert } from "@/types/dashboard";

const SEVERITY_ICON = {
  info: Info,
  warning: AlertTriangle,
  danger: AlertTriangle,
} as const;

const SEVERITY_VARIANT = {
  info: "info",
  warning: "warning",
  danger: "danger",
} as const;

interface AlertListProps {
  alerts: DashboardAlert[];
  loading?: boolean;
}

export function AlertList({ alerts, loading }: AlertListProps) {
  return (
    <Card variant="elevated">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Bell className="text-primary" size={18} />
          <CardTitle>Alerts</CardTitle>
        </div>
      </CardHeader>
      <CardBody className="pt-0">
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        ) : alerts.length === 0 ? (
          <EmptyState variant="no-data" title="No alerts" description="You're all caught up." />
        ) : (
          <ul className="space-y-3">
            {alerts.map((alert) => {
              const Icon = SEVERITY_ICON[alert.severity];
              const content = (
                <div className="flex gap-3 rounded-[var(--radius-md)] border border-border bg-surface-overlay p-3 transition-colors hover:border-primary/30">
                  <Icon size={16} className="mt-0.5 shrink-0 text-text-secondary" aria-hidden />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-text-primary">{alert.title}</p>
                      <Badge variant={SEVERITY_VARIANT[alert.severity] as "info" | "warning" | "danger"} size="sm">
                        {alert.severity}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-text-secondary">{alert.message}</p>
                    <p className="mt-1 text-xs text-text-disabled">
                      {new Date(alert.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <Bell size={14} className="shrink-0 text-text-disabled" aria-hidden />
                </div>
              );
              return (
                <li key={alert.id}>
                  {alert.href ? (
                    <Link href={alert.href} className="block hover:opacity-90">{content}</Link>
                  ) : (
                    content
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </CardBody>
    </Card>
  );
}
