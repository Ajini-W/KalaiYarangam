# KalaiArangam — Prisma Schema Overview

> **Status:** ✅ Validated (`prisma validate` passed)
> **Lines:** 1,639 | **Models:** 72 | **Enums:** 25 | **Table Mappings:** 72

---

## Schema Structure (8 Parts → 1 Merged File)

| Part File | Section | Models |
|-----------|---------|--------|
| `01_config_enums.prisma` | Generator, Datasource, 25 Enums | — |
| `02_auth_tenant.prisma` | Auth & Multi-Tenant | User, UserProfile, UserBranch, UserLoginLog, Permission, RolePermission, UserRoleMapping, Tenant, TenantBrand, TenantInvitation, TenantSetting, Branch |
| `03_subscription_billing.prisma` | SaaS Billing | Plan, PlanFeature, SubscriptionModule, Subscription, SubscriptionUsage, SubscriptionInvoice, SubscriptionPayment, SubscriptionHistory, ModuleInterest |
| `04_student_lead_course.prisma` | Training Core | Student, Lead, LeadFollowup, Enrollment, CourseCategory, Course |
| `05_batch_fee.prisma` | Batch & Fee Mgmt | Batch, BatchTrainer, BatchSchedule, Competition, ClassSession, StudentProgress, AttendanceSession, StudentAttendance, FeePlan, FeeDiscount |
| `06_finance_cert_report.prisma` | Finance & Certs | Invoice, ExpenseCategory, Transaction, CertificateTemplate, Certificate, CertificateVerification, DashboardWidget, AnalyticsSnapshot |
| `07_superadmin_1.prisma` | SA: Notifications, Audit, CRM, Referrals | NotificationTemplate, NotificationPreference, Notification, NotificationLog, AuditLog, ActivityLog, ApiLog, PlatformLead, PlatformFollowup, PlatformCustomer, ReferralProgram, ReferralCode, ReferralReward |
| `08_superadmin_2.prisma` | SA: Billing, Support, CS, Finance | PaymentTransaction, Refund, SupportCategory, SupportTicket, CustomerSuccessManager, CustomerHealthScore, CustomerInteraction, CustomerFeedback, AnnouncementTemplate, PlatformNotification, PlatformExpense, PlatformRevenue, PlatformProfitability, CommissionPayout |

---

## Key Design Decisions

1. **Multi-Tenant Isolation** — `tenantId` FK on all tenant-scoped models with `onDelete: Cascade`
2. **UUID Primary Keys** — All PKs use `@default(uuid()) @db.Uuid`
3. **Snake_case Table Mapping** — Every model uses `@@map("table_name")` and fields use `@map("column_name")`
4. **Composite Unique Constraints** — Tenant-scoped uniqueness (e.g., `@@unique([tenantId, email])`)
5. **Indexed FKs** — All foreign keys and frequently queried fields are indexed
6. **Prisma 7 Compatible** — No `url` in datasource; connection via `prisma.config.ts`

## Files Modified/Created

- [schema.prisma](file:///home/abishek/IdeaProjects/kalai_arangam/backend/prisma/schema.prisma) — Final merged schema
- [prisma.config.ts](file:///home/abishek/IdeaProjects/kalai_arangam/backend/prisma.config.ts) — Prisma 7 config
- [prisma.service.ts](file:///home/abishek/IdeaProjects/kalai_arangam/backend/src/database/prisma.service.ts) — NestJS service
- [prisma.module.ts](file:///home/abishek/IdeaProjects/kalai_arangam/backend/src/database/prisma.module.ts) — Global module
- [parts/](file:///home/abishek/IdeaProjects/kalai_arangam/backend/prisma/parts) — 8 source part files

## Next Steps

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database
npm run db:push

# Or create a migration
npm run db:migrate
```
