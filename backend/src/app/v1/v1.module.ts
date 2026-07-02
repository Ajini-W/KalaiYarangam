import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { NotificationModule } from './notification/notification.module';
import { TrainingModule } from './training/training.module';
import { RbacModule } from './rbac/rbac.module';
import { OnboardingModule } from './onboarding/onboarding.module';
import { ClassModule } from './class/class.module';
import { SecurityModule } from './security/security.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ReportsModule } from './reports/reports.module';
import { BulkModule } from './bulk/bulk.module';
import { LeadModule } from './lead/lead.module';
import { InvoiceModule } from './invoice/invoice.module';
import { FeePlanModule } from './fee-plan/fee-plan.module';
import { SearchModule } from './reporting/search/search.module';
import { StudentsModule } from './students/students.module';


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
    DashboardModule,
    ReportsModule,
    BulkModule,
    SearchModule,
    StudentsModule,
  ],
})
export class V1Module { }