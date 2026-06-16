"use client";

import * as React from "react";
import { Bell, Users, CreditCard, BookOpen, Calendar, AlertCircle, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { Badge } from "@/components/ui/Badge";

export type NotificationType = "lead" | "payment" | "booking" | "reminder" | "system";

export interface Notification {
  id: string | number;
  type: NotificationType;
  title: string;
  body?: string;
  timestamp: Date | string;
  read: boolean;
  actionLabel?: string;
  onAction?: () => void;
}

const typeConfig: Record<NotificationType, { icon: React.ElementType; color: string }> = {
  lead:     { icon: Users,        color: "text-brand-500 bg-brand-50" },
  payment:  { icon: CreditCard,   color: "text-success bg-success-light" },
  booking:  { icon: BookOpen,     color: "text-info bg-info-light" },
  reminder: { icon: Calendar,     color: "text-warning bg-warning-light" },
  system:   { icon: AlertCircle,  color: "text-text-secondary bg-surface-overlay" },
};

function formatRelative(ts: Date | string) {
  const date = ts instanceof Date ? ts : new Date(ts);
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return date.toLocaleDateString();
}

/* ─── NotificationItem ────────────────────────────────────────────────────── */
export interface NotificationItemProps {
  notification: Notification;
  onMarkRead?: (id: string | number) => void;
  className?: string;
}

export function NotificationItem({ notification: n, onMarkRead, className }: NotificationItemProps) {
  const { icon: Icon, color } = typeConfig[n.type];
  return (
    <div className={cn(
      "flex gap-3 px-4 py-3 transition-colors hover:bg-surface-raised",
      !n.read && "bg-brand-50/50",
      className,
    )}>
      <span className={cn("mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm", color)}>
        <Icon size={15} />
      </span>
      <div className="flex-1 min-w-0">
        <p className={cn("text-sm", !n.read ? "font-semibold text-text-primary" : "font-medium text-text-primary")}>{n.title}</p>
        {n.body && <p className="text-xs text-text-secondary truncate">{n.body}</p>}
        <div className="mt-1 flex items-center gap-3">
          <span className="text-xs text-text-disabled">{formatRelative(n.timestamp)}</span>
          {n.actionLabel && (
            <button onClick={n.onAction} className="text-xs font-medium text-brand-600 hover:underline">{n.actionLabel}</button>
          )}
        </div>
      </div>
      {!n.read && onMarkRead && (
        <button
          onClick={() => onMarkRead(n.id)}
          className="mt-0.5 shrink-0 rounded p-0.5 text-text-disabled hover:text-text-secondary"
          aria-label="Mark as read"
        >
          <X size={12} />
        </button>
      )}
    </div>
  );
}

/* ─── NotificationBell ────────────────────────────────────────────────────── */
export interface NotificationBellProps {
  notifications: Notification[];
  onMarkRead?: (id: string | number) => void;
  onMarkAllRead?: () => void;
  onViewAll?: () => void;
}

export function NotificationBell({ notifications, onMarkRead, onMarkAllRead, onViewAll }: NotificationBellProps) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  const unread = notifications.filter((n) => !n.read).length;
  const recent = notifications.slice(0, 5);

  // Close on outside click
  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative rounded-[var(--radius-sm)] p-2 text-text-secondary hover:bg-surface-overlay hover:text-text-primary transition-colors"
        aria-label={`Notifications${unread ? ` (${unread} unread)` : ""}`}
        aria-expanded={open}
        aria-haspopup="true"
      >
        <Bell size={18} />
        {unread > 0 && (
          <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-0.5 text-[10px] font-bold text-white">
            {unread > 99 ? "99+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 rounded-[var(--radius-lg)] border border-border bg-surface shadow-[var(--shadow-3)] z-50">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-text-primary">Notifications</span>
              {unread > 0 && <Badge variant="danger" size="sm">{unread}</Badge>}
            </div>
            {unread > 0 && (
              <button onClick={onMarkAllRead} className="text-xs text-brand-600 hover:underline">Mark all read</button>
            )}
          </div>

          {/* Items */}
          <div className="divide-y divide-border-subtle max-h-80 overflow-y-auto">
            {recent.length === 0 ? (
              <p className="py-8 text-center text-sm text-text-secondary">No notifications</p>
            ) : (
              recent.map((n) => (
                <NotificationItem key={n.id} notification={n} onMarkRead={onMarkRead} />
              ))
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-border px-4 py-2.5 text-center">
            <button onClick={() => { setOpen(false); onViewAll?.(); }} className="text-xs font-medium text-brand-600 hover:underline">
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
