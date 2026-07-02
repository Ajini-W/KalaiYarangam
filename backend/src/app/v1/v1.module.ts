import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { NotificationModule } from './notification/notification.module';
import { TrainingModule } from './training/training.module';
import { RbacModule } from './rbac/rbac.module';
import { OnboardingModule } from './onboarding/onboarding.module';
import { ClassModule } from './class/class.module';
import { SecurityModule } from './security/security.module';
import { LeadModule } from './lead/lead.module';
import { InvoiceModule } from './invoice/invoice.module';
import { FeePlanModule } from './fee-plan/fee-plan.module';


@Module({
  imports: [
    AuthModule,
    MailModule,
    NotificationModule,
    TrainingModule,
    RbacModule,
    OnboardingModule,
    ClassModule,
    SecurityModule,
    InvoiceModule,
    FeePlanModule,
  ],
})
export class V1Module { }