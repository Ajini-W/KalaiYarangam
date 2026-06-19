import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { NotificationModule } from './notification/notification.module';
import { TrainingModule } from './training/training.module';

@Module({
  imports: [AuthModule, MailModule, NotificationModule, TrainingModule],
})
export class V1Module {}
