import http from "./http";

export interface NotificationItem {
  id: string;
  userId: string;
  tenantId: string | null;
  channel: string;
  title: string;
  body: string;
  link: string | null;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
}

export interface NotificationListResponse {
  items: NotificationItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface NotificationPreference {
  id: string;
  userId: string;
  channel: string;
  eventType: string;
  enabled: boolean;
}

export const notificationService = {
  async list(page = 1, limit = 20): Promise<NotificationListResponse> {
    const { data } = await http.get(`/notification?page=${page}&limit=${limit}`);
    return data.data;
  },

  async unreadCount(): Promise<number> {
    const { data } = await http.get("/notification/unread-count");
    return data.data.count;
  },

  async markRead(id: string): Promise<void> {
    await http.put(`/notification/${id}/read`);
  },

  async markAllRead(): Promise<void> {
    await http.put("/notification/read-all");
  },

  async getPreferences(): Promise<NotificationPreference[]> {
    const { data } = await http.get("/notification/preferences");
    return data.data;
  },

  async updatePreference(channel: string, eventType: string, enabled: boolean): Promise<void> {
    await http.put("/notification/preferences", { channel, eventType, enabled });
  },

  async registerDevice(token: string, platform?: string): Promise<void> {
    await http.post("/notification/register-device", { token, platform });
  },

  async sendNotification(title: string, body: string, link?: string, userIds?: string[]): Promise<void> {
    await http.post("/notification/send", { title, body, link, userIds });
  },
};
