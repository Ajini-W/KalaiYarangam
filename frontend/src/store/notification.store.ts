import { create } from "zustand";
import { notificationService, type NotificationItem } from "@/services/notification.service";

interface NotificationState {
  notifications: NotificationItem[];
  unreadCount: number;
  total: number;
  page: number;
  loading: boolean;

  fetchNotifications: (page?: number) => Promise<void>;
  fetchUnreadCount: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  total: 0,
  page: 1,
  loading: false,

  fetchNotifications: async (page = 1) => {
    set({ loading: true });
    try {
      const res = await notificationService.list(page, 20);
      set({
        notifications: page === 1 ? res.items : [...get().notifications, ...res.items],
        total: res.total,
        page,
        loading: false,
      });
    } catch {
      set({ loading: false });
    }
  },

  fetchUnreadCount: async () => {
    try {
      const count = await notificationService.unreadCount();
      set({ unreadCount: count });
    } catch {
      // ignore
    }
  },

  markAsRead: async (id) => {
    await notificationService.markRead(id);
    set((s) => ({
      notifications: s.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true, readAt: new Date().toISOString() } : n
      ),
      unreadCount: Math.max(0, s.unreadCount - 1),
    }));
  },

  markAllAsRead: async () => {
    await notificationService.markAllRead();
    set((s) => ({
      notifications: s.notifications.map((n) => ({ ...n, isRead: true, readAt: new Date().toISOString() })),
      unreadCount: 0,
    }));
  },
}));
