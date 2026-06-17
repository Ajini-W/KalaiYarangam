import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { TrainingModule } from './training/training.module';

@Module({
  imports: [AuthModule, MailModule, TrainingModule],
})
export class V1Module {}
