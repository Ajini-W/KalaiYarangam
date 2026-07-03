"use client";

import { Calendar } from "lucide-react";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import type { DashboardUpcomingItem } from "@/types/dashboard";

interface UpcomingWidgetProps {
  items: DashboardUpcomingItem[];
  loading?: boolean;
}

export function UpcomingWidget({ items, loading }: UpcomingWidgetProps) {
  return (
    <Card variant="elevated">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Calendar className="text-primary" size={18} />
          <CardTitle>Upcoming</CardTitle>
        </div>
      </CardHeader>
      <CardBody className="pt-0">
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <EmptyState variant="no-data" title="Nothing upcoming" description="Your schedule is clear for now." />
        ) : (
          <ul className="space-y-3">
            {items.map((item) => (
              <li key={item.id} className="flex gap-3 rounded-[var(--radius-md)] border border-border bg-surface-overlay p-3 transition-colors hover:border-primary/30">
                <Calendar size={16} className="mt-0.5 shrink-0 text-primary" aria-hidden />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-text-primary">{item.title}</p>
                  <p className="text-xs text-text-secondary">
                    {item.type} · {new Date(item.date).toLocaleString()}
                  </p>
                  {item.description && (
                    <p className="mt-1 line-clamp-2 text-xs text-text-secondary">{item.description}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardBody>
    </Card>
  );
}
