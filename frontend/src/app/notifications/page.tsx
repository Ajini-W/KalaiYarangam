"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Bell, CheckCheck, ExternalLink, Loader2 } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { useNotificationStore } from "@/store/notification.store";

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
    return `${Math.floor(hrs / 24)}d ago`;
  };

  if (loading && notifications.length === 0) {
    return (
      <PageContainer title="Notifications">
        <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Notifications">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-text-secondary">{notifications.length} notification(s)</p>
        <Button variant="ghost" size="sm" onClick={markAllAsRead}>
          <CheckCheck size={16} className="mr-1" /> Mark all read
        </Button>
      </div>

      <Card>
        <CardBody className="p-0">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-text-secondary">
              <Bell size={32} className="mb-2 text-text-disabled" />
              <p className="text-sm">No notifications yet</p>
            </div>
          ) : (
            notifications.map((n) => (
              <button
                key={n.id}
                onClick={() => handleClick(n)}
                className={cn(
                  "flex w-full items-start gap-3 border-b border-border px-4 py-3.5 text-left transition-colors hover:bg-surface-overlay last:border-b-0",
                  !n.isRead && "bg-primary/[0.03]"
                )}
              >
                <div className={cn("mt-1.5 h-2 w-2 shrink-0 rounded-full", n.isRead ? "bg-text-disabled" : "bg-primary")} />
                <div className="flex-1 min-w-0">
                  <p className={cn("text-sm", n.isRead ? "text-text-secondary" : "font-medium text-text-primary")}>{n.title}</p>
                  <p className="text-xs text-text-secondary mt-0.5">{n.body}</p>
                  <p className="text-[10px] text-text-disabled mt-1">{timeAgo(n.createdAt)}</p>
                </div>
                {n.link && <ExternalLink size={14} className="shrink-0 mt-1 text-text-disabled" />}
              </button>
            ))
          )}
        </CardBody>
      </Card>
    </PageContainer>
  );
}
