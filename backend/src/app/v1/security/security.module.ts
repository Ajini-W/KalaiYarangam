import { Module, Global } from '@nestjs/common';
import { SecurityController } from './security.controller';
import { SecurityService } from './security.service';
import { AuditService } from './audit.service';
import { SecurityNotificationService } from './security-notification.service';
import { MailModule } from '@/app/v1/mail/mail.module';

@Global()
@Module({
  imports: [MailModule],
  controllers: [SecurityController],
  providers: [SecurityService, AuditService, SecurityNotificationService],
  exports: [AuditService, SecurityService, SecurityNotificationService],
})
export class SecurityModule {}
