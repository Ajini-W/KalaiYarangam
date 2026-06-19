import { BadGatewayException, Injectable, OnModuleInit } from '@nestjs/common';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getMessaging, Message } from 'firebase-admin/messaging';
import { env } from '@/config';
import { SendPushDto } from './dto/notification.dto';

@Injectable()
export class NotificationService implements OnModuleInit {
  onModuleInit() {
    if (!getApps().length) {
      const serviceAccount = JSON.parse(env.FIREBASE_SERVICE_ACCOUNT_JSON);
      initializeApp({ credential: cert(serviceAccount) });
    }
  }

  async sendPush(dto: SendPushDto) {
    const message: Message = {
      token: dto.token,
      notification: { title: dto.title, body: dto.body },
      ...(dto.data && { data: dto.data }),
    };

    try {
      const response = await getMessaging().send(message);
      return {
        message: `Push notification sent to ${dto.token.slice(0, 12)}...`,
        data: { messageId: response },
      };
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Unknown error';
      throw new BadGatewayException(`FCM send failed: ${msg}`);
    }
  }
}
