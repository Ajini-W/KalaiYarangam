"use client";

import * as React from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { NotificationItem, type Notification } from "@/components/shared/Notifications";

const MOCK: Notification[] = [
  { id: 1, type: "lead",     title: "New lead: Priya Sharma",         body: "Enquired about Bharatanatyam class",  timestamp: new Date(Date.now() - 2*60000),      read: false },
  { id: 2, type: "payment",  title: "Payment received ₹3,600",        body: "Meena Devi — Yoga batch fee",         timestamp: new Date(Date.now() - 60*60000),     read: false },
  { id: 3, type: "reminder", title: "Rental return due today",         body: "LED Wall — Priya Events booking",     timestamp: new Date(Date.now() - 3*3600000),    read: false },
  { id: 4, type: "booking",  title: "New rental booking confirmed",    body: "#BK0001 — Raj Weddings",              timestamp: new Date(Date.now() - 6*3600000),    read: true  },
  { id: 5, type: "system",   title: "Subscription renews in 5 days",  body: "Training module — Monthly plan",       timestamp: new Date(Date.now() - 24*3600000),   read: true  },
  { id: 6, type: "lead",     title: "Follow-up reminder: Ravi Kumar", body: "Karate — scheduled for today",         timestamp: new Date(Date.now() - 2*86400000),   read: true  },
];

export default function NotificationsPage() {
  const [items, setItems] = React.useState(MOCK);
  const unread = items.filter((n) => !n.read).length;

  const markRead = (id: string | number) =>
    setItems((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));

  const markAllRead = () => setItems((prev) => prev.map((n) => ({ ...n, read: true })));

  const today = items.filter((n) => new Date(n.timestamp).toDateString() === new Date().toDateString());
  const earlier = items.filter((n) => new Date(n.timestamp).toDateString() !== new Date().toDateString());

  return (
    <PageContainer
      title="Notifications"
      subtitle={unread > 0 ? `${unread} unread` : "All caught up!"}
      actions={unread > 0 ? <Button variant="outline" size="sm" onClick={markAllRead}>Mark all read</Button> : undefined}
    >
      <div className="max-w-2xl rounded-[var(--radius-md)] border border-border overflow-hidden bg-surface">
        {today.length > 0 && (
          <>
            <div className="px-4 py-2 bg-surface-raised border-b border-border">
              <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">Today</p>
            </div>
            <div className="divide-y divide-border-subtle">
              {today.map((n) => <NotificationItem key={n.id} notification={n} onMarkRead={markRead} />)}
            </div>
          </>
        )}
        {earlier.length > 0 && (
          <>
            <div className="px-4 py-2 bg-surface-raised border-t border-b border-border">
              <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">Earlier</p>
            </div>
            <div className="divide-y divide-border-subtle">
              {earlier.map((n) => <NotificationItem key={n.id} notification={n} onMarkRead={markRead} />)}
            </div>
          </>
        )}
      </div>
    </PageContainer>
  );
}
