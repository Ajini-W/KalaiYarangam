"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, Search, Bell, Sun, Moon, User, Settings, Lock, LogOut, IdCard, CheckCheck, ExternalLink } from "lucide-react";
import { cn } from "@/lib/cn";
import { Breadcrumb } from "./Breadcrumb";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth.store";
import { useNotificationStore } from "@/store/notification.store";
import { notificationService } from "@/services/notification.service";

interface TopbarProps {
  onMenuToggle: () => void;
  className?: string;
}

export function Topbar({ onMenuToggle, className }: TopbarProps) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const [dark, setDark] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [notifOpen, setNotifOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const notifRef = React.useRef<HTMLDivElement>(null);
  const { notifications, unreadCount, fetchNotifications, fetchUnreadCount, markAsRead, markAllAsRead } = useNotificationStore();

  React.useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

  React.useEffect(() => {
    if (notifOpen) fetchNotifications();
  }, [notifOpen, fetchNotifications]);

  React.useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const toggleDark = () => {
    setDark((d) => !d);
    document.documentElement.classList.toggle("dark");
  };

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  const handleSignOut = async () => {
    await logout();
    router.push("/login");
  };

  const handleNotifClick = async (notification: typeof notifications[0]) => {
    if (!notification.isRead) await markAsRead(notification.id);
    setNotifOpen(false);
    if (notification.link) router.push(notification.link);
  };

  const handleMarkAllRead = async () => {
    await markAllAsRead();
  };

  const handleRequestPermission = async () => {
    if (!("Notification" in window)) return;
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (!sub) {
        const newSub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
        });
        await notificationService.registerDevice(JSON.stringify(newSub), "web");
      }
      toast.success("Push notifications enabled!");
    }
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

  return (
    <header
      className={cn(
        "sticky top-0 z-40 flex h-[60px] shrink-0 items-center gap-4 border-b border-border bg-surface/95 px-4 backdrop-blur-sm",
        className,
      )}
    >
      <button
        onClick={onMenuToggle}
        className="rounded-[var(--radius-sm)] p-2 text-text-secondary hover:bg-surface-overlay hover:text-text-primary transition-colors"
        aria-label="Toggle menu"
      >
        <Menu size={20} />
      </button>

      <div className="hidden md:block flex-1">
        <Breadcrumb />
      </div>

      <div className="flex items-center gap-1 ml-auto">
        <button className="rounded-[var(--radius-sm)] p-2 text-text-secondary hover:bg-surface-overlay hover:text-text-primary transition-colors" aria-label="Search">
          <Search size={18} />
        </button>

        <button onClick={toggleDark} className="rounded-[var(--radius-sm)] p-2 text-text-secondary hover:bg-surface-overlay hover:text-text-primary transition-colors" aria-label="Toggle dark mode">
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notification bell */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setNotifOpen((o) => !o)}
            className="relative rounded-[var(--radius-sm)] p-2 text-text-secondary hover:bg-surface-overlay hover:text-text-primary transition-colors"
            aria-label="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-danger text-[10px] font-bold text-white px-1">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-full mt-1 w-80 sm:w-96 rounded-[var(--radius-md)] border border-border bg-surface shadow-lg z-50">
              <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
                <h3 className="text-sm font-semibold text-text-primary">Notifications</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                  >
                    <CheckCheck size={14} />
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-[360px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="px-4 py-8 text-center text-sm text-text-secondary">
                    <Bell size={24} className="mx-auto mb-2 text-text-disabled" />
                    No notifications yet
                  </div>
                ) : (
                  notifications.slice(0, 10).map((n) => (
                    <button
                      key={n.id}
                      onClick={() => handleNotifClick(n)}
                      className={cn(
                        "flex w-full items-start gap-3 border-b border-border px-4 py-3 text-left transition-colors hover:bg-surface-overlay",
                        !n.isRead && "bg-primary/[0.03]"
                      )}
                    >
                      <div className={cn(
                        "mt-1 h-2 w-2 shrink-0 rounded-full",
                        n.isRead ? "bg-transparent" : "bg-primary"
                      )} />
                      <div className="flex-1 min-w-0">
                        <p className={cn("text-sm truncate", n.isRead ? "text-text-secondary" : "font-medium text-text-primary")}>{n.title}</p>
                        <p className="text-xs text-text-secondary line-clamp-2 mt-0.5">{n.body}</p>
                        <p className="text-[10px] text-text-disabled mt-1">{timeAgo(n.createdAt)}</p>
                      </div>
                    </button>
                  ))
                )}
              </div>
              <Link
                href="/notifications"
                onClick={() => setNotifOpen(false)}
                className="flex items-center justify-center gap-1 border-t border-border px-4 py-2 text-xs font-medium text-primary hover:bg-surface-overlay transition-colors"
              >
                View all notifications
                <ExternalLink size={12} />
              </Link>
            </div>
          )}
        </div>

        <div ref={menuRef} className="relative">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="ml-1 flex items-center gap-2 rounded-[var(--radius-md)] px-2 py-1.5 hover:bg-surface-overlay transition-colors"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold">
              {initials}
            </span>
            <span className="hidden md:block text-sm font-medium text-text-primary">
              {user?.name || "User"}
            </span>
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-1 w-56 rounded-[var(--radius-md)] border border-border bg-surface shadow-lg py-1 z-50">
              <div className="px-3 py-2 border-b border-border">
                <p className="text-sm font-medium text-text-primary truncate">{user?.name}</p>
                <p className="text-xs text-text-secondary truncate">{user?.email}</p>
              </div>
              <Link
                href="/dashboard/profile"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-text-primary hover:bg-surface-overlay transition-colors"
              >
                <IdCard size={16} className="text-text-secondary" />
                Profile
              </Link>
              <Link
                href="/dashboard/settings/organisation"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-text-primary hover:bg-surface-overlay transition-colors"
              >
                <Settings size={16} className="text-text-secondary" />
                Settings
              </Link>
              <Link
                href="/dashboard/settings/change-password"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-text-primary hover:bg-surface-overlay transition-colors"
              >
                <Lock size={16} className="text-text-secondary" />
                Change Password
              </Link>
              <hr className="border-border my-1" />
              <button
                onClick={handleSignOut}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-danger hover:bg-surface-overlay transition-colors"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}


