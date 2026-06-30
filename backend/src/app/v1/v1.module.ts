import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { NotificationModule } from './notification/notification.module';
import { TrainingModule } from './training/training.module';
import { RbacModule } from './rbac/rbac.module';
import { OnboardingModule } from './onboarding/onboarding.module';
import { ClassModule } from './class/class.module';
// import { BrunoModule } from './bruno/bruno.module';
import { SecurityModule } from './security/security.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ReportsModule } from './reports/reports.module';
import { BulkModule } from './bulk/bulk.module';

@Module({
  imports: [AuthModule, MailModule, NotificationModule, TrainingModule, RbacModule, OnboardingModule, ClassModule, SecurityModule, DashboardModule, ReportsModule, BulkModule],
})
export class V1Module {}
