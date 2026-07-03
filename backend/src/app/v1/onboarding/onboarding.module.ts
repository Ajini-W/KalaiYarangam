import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { env } from '@/config';
import { AuditService } from '@/app/v1/security/audit.service';
import { OnboardingController } from './onboarding.controller';
import { OnboardingService } from './onboarding.service';
import { NotificationModule } from '@/app/v1/notification/notification.module';
import { MailModule } from '@/app/v1/mail/mail.module';

@Module({
  imports: [
    JwtModule.register({
      secret: env.JWT_SECRET,
      signOptions: { expiresIn: env.JWT_EXPIRES_IN as any },
    }),
    NotificationModule,
    MailModule,
  ],
  controllers: [OnboardingController],
  providers: [OnboardingService, AuditService],
  exports: [OnboardingService],
})
export class OnboardingModule {}
