import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { NotificationModule } from './notification/notification.module';
import { TrainingModule } from './training/training.module';
import { RbacModule } from './rbac/rbac.module';
import { OnboardingModule } from './onboarding/onboarding.module';
// import { BrunoModule } from './bruno/bruno.module';
import { SecurityModule } from './security/security.module';

@Module({
  imports: [AuthModule, MailModule, NotificationModule, TrainingModule, RbacModule, OnboardingModule, SecurityModule],
})
export class V1Module {}
