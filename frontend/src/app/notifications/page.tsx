"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Bell, CheckCheck, ExternalLink, Loader2, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/cn";
import { useNotificationStore } from "@/store/notification.store";
import { Button } from "@/components/ui/Button";

export default function NotificationsPage() {
  const router = useRouter();
  const { notifications, loading, fetchNotifications, markAsRead, markAllAsRead } = useNotificationStore();

  React.useEffect(() => {
    fetchNotifications(1);
  }, [fetchNotifications]);

  const handleClick = async (n: typeof notifications[0]) => {
    if (!n.isRead) await markAsRead(n.id);
    if (n.link) router.push(n.link);
  };

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(date).toLocaleDateString();
  };

  if (loading && notifications.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-surface/95 px-4 backdrop-blur-sm">
        <button onClick={() => router.back()} className="rounded-[var(--radius-sm)] p-1.5 text-text-secondary hover:bg-surface-overlay transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-bold text-text-primary flex-1">Notifications</h1>
        {notifications.some((n) => !n.isRead) && (
          <button onClick={markAllAsRead} className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
            <CheckCheck size={14} />
            <span className="hidden sm:inline">Mark all read</span>
          </button>
        )}
      </header>

      {/* Content */}
      <div className="mx-auto max-w-2xl">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-text-secondary">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-surface-raised">
              <Bell size={28} className="text-text-disabled" />
            </div>
            <p className="text-base font-medium">No notifications yet</p>
            <p className="text-sm mt-1">We&apos;ll notify you when something arrives</p>
          </div>
        ) : (
          <>
            <div className="px-4 py-3 border-b border-border/50">
              <p className="text-xs font-medium text-text-secondary">
                {notifications.length} notification{notifications.length !== 1 ? "s" : ""}
              </p>
            </div>
            {notifications.map((n) => (
              <button
                key={n.id}
                onClick={() => handleClick(n)}
                className={cn(
                  "flex w-full items-start gap-3 px-4 py-4 text-left transition-colors border-b border-border/50 active:bg-surface-overlay sm:hover:bg-surface-overlay",
                  !n.isRead && "bg-primary/[0.04]"
                )}
              >
                <span className={cn(
                  "mt-1.5 h-3 w-3 shrink-0 rounded-full ring-2 ring-surface",
                  n.isRead ? "bg-border ring-surface" : "bg-primary ring-primary/20"
                )} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={cn("text-sm leading-snug", n.isRead ? "text-text-secondary" : "font-semibold text-text-primary")}>{n.title}</p>
                    {n.link && <ExternalLink size={12} className="shrink-0 mt-1 text-text-disabled" />}
                  </div>
                  <p className="text-xs text-text-secondary mt-0.5 line-clamp-3 leading-relaxed">{n.body}</p>
                  <p className="text-[10px] text-text-disabled mt-1.5">{timeAgo(n.createdAt)}</p>
                </div>
              </button>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
