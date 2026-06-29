import { BadGatewayException, Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getMessaging, Message } from 'firebase-admin/messaging';
import { PrismaService } from '@/database';
import { env } from '@/config';
import {
  RegisterDeviceDto,
  SendNotificationDto,
  UpdateNotificationPreferenceDto,
} from './dto/notification.dto';

@Injectable()
export class NotificationService implements OnModuleInit {
  private readonly logger = new Logger(NotificationService.name);

  constructor(private readonly prisma: PrismaService) {}

  onModuleInit() {
    if (getApps().length) return;
    try {
      const serviceAccount = JSON.parse(env.FIREBASE_SERVICE_ACCOUNT_JSON);
      initializeApp({ credential: cert(serviceAccount) });
    } catch (error) {
      this.logger.warn('Firebase init skipped:', (error as Error).message);
    }
  }

  async list(userId: string, tenantId: string | null, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.notification.count({ where: { userId } }),
    ]);
    return {
      message: 'Notifications retrieved',
      data: { items, total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async unreadCount(userId: string) {
    const count = await this.prisma.notification.count({ where: { userId, isRead: false } });
    return { message: 'Unread count retrieved', data: { count } };
  }

  async markRead(id: string, userId: string) {
    const notification = await this.prisma.notification.findFirst({ where: { id, userId } });
    if (!notification) throw new NotFoundException('Notification not found');
    await this.prisma.notification.update({
      where: { id },
      data: { isRead: true, readAt: new Date() },
    });
    return { message: 'Notification marked as read' };
  }

  async markAllRead(userId: string) {
    await this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true, readAt: new Date() },
    });
    return { message: 'All notifications marked as read' };
  }

  async getPreferences(userId: string) {
    const prefs = await this.prisma.notificationPreference.findMany({
      where: { userId },
    });
    return { message: 'Notification preferences retrieved', data: prefs };
  }

  async updatePreference(userId: string, dto: UpdateNotificationPreferenceDto) {
    const pref = await this.prisma.notificationPreference.upsert({
      where: { userId_channel_eventType: { userId, channel: dto.channel as any, eventType: dto.eventType } },
      update: { enabled: dto.enabled },
      create: { userId, channel: dto.channel as any, eventType: dto.eventType, enabled: dto.enabled },
    });
    return { message: 'Notification preference updated', data: pref };
  }

  async registerDevice(userId: string, dto: RegisterDeviceDto, userAgent?: string) {
    const device = await this.prisma.userDevice.upsert({
      where: { userId_token: { userId, token: dto.token } },
      update: { platform: dto.platform, userAgent },
      create: { userId, token: dto.token, platform: dto.platform, userAgent },
    });
    return { message: 'Device registered', data: { id: device.id } };
  }

  async sendNotification(dto: SendNotificationDto, tenantId?: string | null) {
    const where: Record<string, unknown> = {};
    if (dto.userIds && dto.userIds.length > 0) {
      where.id = { in: dto.userIds };
    } else if (tenantId) {
      where.tenantId = tenantId;
    }

    const users = await this.prisma.user.findMany({
      where: where as any,
      select: { id: true },
    });

    const notifications = users.map((u) => ({
      userId: u.id,
      tenantId: tenantId || undefined,
      title: dto.title,
      body: dto.body,
      link: dto.link,
    }));

    if (notifications.length > 0) {
      await this.prisma.notification.createMany({ data: notifications as any });
    }

    // Send push to all devices of these users
    const devices = await this.prisma.userDevice.findMany({
      where: { userId: { in: users.map((u) => u.id) } },
    });

    for (const device of devices) {
      try {
        const message: Message = {
          token: device.token,
          notification: { title: dto.title, body: dto.body },
          ...(dto.link && { data: { link: dto.link } }),
        };
        await getMessaging().send(message);
      } catch (error) {
        this.logger.warn(`FCM send failed for device ${device.id}: ${(error as Error).message}`);
      }
    }

    return {
      message: `Notification sent to ${notifications.length} users`,
      data: { userCount: notifications.length, pushSent: devices.length },
    };
  }
}
