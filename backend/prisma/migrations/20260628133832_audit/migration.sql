-- CreateEnum
CREATE TYPE "LoginMethod" AS ENUM ('PASSWORD', 'SSO', 'OAUTH_GOOGLE', 'MAGIC_LINK', 'API_KEY');

-- CreateEnum
CREATE TYPE "FailureReason" AS ENUM ('INVALID_CREDENTIALS', 'ACCOUNT_LOCKED', 'ACCOUNT_SUSPENDED', 'EMAIL_NOT_VERIFIED', 'MFA_FAILED', 'MFA_REQUIRED', 'TOKEN_EXPIRED', 'TOKEN_REVOKED', 'RATE_LIMITED', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "DeviceType" AS ENUM ('DESKTOP', 'MOBILE', 'TABLET', 'SMART_TV', 'WEARABLE', 'UNKNOWN');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "AuditAction" ADD VALUE 'SETTINGS_CHANGE';
ALTER TYPE "AuditAction" ADD VALUE 'WEBHOOK_CHANGE';
ALTER TYPE "AuditAction" ADD VALUE 'API_KEY_CHANGE';
ALTER TYPE "AuditAction" ADD VALUE 'INVITATION';
ALTER TYPE "AuditAction" ADD VALUE 'SUBSCRIPTION_CHANGE';
ALTER TYPE "AuditAction" ADD VALUE 'BILLING_CHANGE';
ALTER TYPE "AuditAction" ADD VALUE 'DATA_EXPORT';
ALTER TYPE "AuditAction" ADD VALUE 'ACCOUNT_LOCK';
ALTER TYPE "AuditAction" ADD VALUE 'ACCOUNT_UNLOCK';

-- AlterTable
ALTER TABLE "activity_logs" ADD COLUMN     "action" VARCHAR(50),
ADD COLUMN     "correlation_id" VARCHAR(100),
ADD COLUMN     "execution_status" VARCHAR(20),
ADD COLUMN     "new_values" JSONB,
ADD COLUMN     "previous_values" JSONB,
ADD COLUMN     "project_id" UUID,
ADD COLUMN     "request_source" VARCHAR(50),
ADD COLUMN     "resource" VARCHAR(100),
ADD COLUMN     "resource_id" VARCHAR(100),
ADD COLUMN     "user_agent" VARCHAR(500),
ADD COLUMN     "workspace_id" UUID;

-- AlterTable
ALTER TABLE "api_logs" ADD COLUMN     "correlation_id" VARCHAR(100),
ADD COLUMN     "request_id" VARCHAR(100),
ADD COLUMN     "response_body" JSONB,
ADD COLUMN     "tenant_id" UUID,
ADD COLUMN     "user_agent" VARCHAR(500);

-- AlterTable
ALTER TABLE "audit_logs" ADD COLUMN     "browser" VARCHAR(100),
ADD COLUMN     "correlation_id" VARCHAR(100),
ADD COLUMN     "description" TEXT,
ADD COLUMN     "location" VARCHAR(255),
ADD COLUMN     "metadata" JSONB,
ADD COLUMN     "os" VARCHAR(100),
ADD COLUMN     "request_id" VARCHAR(100);

-- AlterTable
ALTER TABLE "notification_logs" ADD COLUMN     "delivered_at" TIMESTAMP(3),
ADD COLUMN     "event_type" VARCHAR(100),
ADD COLUMN     "metadata" JSONB,
ADD COLUMN     "read_at" TIMESTAMP(3),
ADD COLUMN     "retry_count" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "security_events" ADD COLUMN     "browser" VARCHAR(100),
ADD COLUMN     "category" VARCHAR(50),
ADD COLUMN     "city" VARCHAR(100),
ADD COLUMN     "correlation_id" VARCHAR(100),
ADD COLUMN     "country" VARCHAR(100),
ADD COLUMN     "country_code" VARCHAR(5),
ADD COLUMN     "description" TEXT,
ADD COLUMN     "device_type" "DeviceType",
ADD COLUMN     "location" VARCHAR(255),
ADD COLUMN     "os" VARCHAR(100),
ADD COLUMN     "resolved" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "resolved_at" TIMESTAMP(3),
ADD COLUMN     "resolved_by" UUID;

-- AlterTable
ALTER TABLE "sessions" ADD COLUMN     "browser" VARCHAR(100),
ADD COLUMN     "browser_version" VARCHAR(50),
ADD COLUMN     "city" VARCHAR(100),
ADD COLUMN     "country" VARCHAR(100),
ADD COLUMN     "country_code" VARCHAR(5),
ADD COLUMN     "device_name" VARCHAR(200),
ADD COLUMN     "device_type" "DeviceType" NOT NULL DEFAULT 'UNKNOWN',
ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "location" VARCHAR(255),
ADD COLUMN     "login_method" "LoginMethod" NOT NULL DEFAULT 'PASSWORD',
ADD COLUMN     "longitude" DOUBLE PRECISION,
ADD COLUMN     "os" VARCHAR(100),
ADD COLUMN     "os_version" VARCHAR(50),
ADD COLUMN     "revoke_reason" VARCHAR(255);

-- AlterTable
ALTER TABLE "user_login_log" ADD COLUMN     "browser" VARCHAR(100),
ADD COLUMN     "browser_version" VARCHAR(50),
ADD COLUMN     "city" VARCHAR(100),
ADD COLUMN     "country" VARCHAR(100),
ADD COLUMN     "country_code" VARCHAR(5),
ADD COLUMN     "device_fingerprint" VARCHAR(255),
ADD COLUMN     "device_name" VARCHAR(200),
ADD COLUMN     "device_type" "DeviceType" NOT NULL DEFAULT 'UNKNOWN',
ADD COLUMN     "failure_reason" "FailureReason",
ADD COLUMN     "is_suspicious" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "location" VARCHAR(255),
ADD COLUMN     "login_method" "LoginMethod" NOT NULL DEFAULT 'PASSWORD',
ADD COLUMN     "longitude" DOUBLE PRECISION,
ADD COLUMN     "metadata" JSONB,
ADD COLUMN     "os" VARCHAR(100),
ADD COLUMN     "os_version" VARCHAR(50),
ADD COLUMN     "suspicious_reason" VARCHAR(255);

-- CreateIndex
CREATE INDEX "activity_logs_resource_idx" ON "activity_logs"("resource");

-- CreateIndex
CREATE INDEX "activity_logs_action_idx" ON "activity_logs"("action");

-- CreateIndex
CREATE INDEX "activity_logs_tenant_id_idx" ON "activity_logs"("tenant_id");

-- CreateIndex
CREATE INDEX "activity_logs_correlation_id_idx" ON "activity_logs"("correlation_id");

-- CreateIndex
CREATE INDEX "api_logs_status_code_idx" ON "api_logs"("status_code");

-- CreateIndex
CREATE INDEX "api_logs_user_id_idx" ON "api_logs"("user_id");

-- CreateIndex
CREATE INDEX "api_logs_tenant_id_idx" ON "api_logs"("tenant_id");

-- CreateIndex
CREATE INDEX "api_logs_correlation_id_idx" ON "api_logs"("correlation_id");

-- CreateIndex
CREATE INDEX "audit_logs_action_idx" ON "audit_logs"("action");

-- CreateIndex
CREATE INDEX "audit_logs_correlation_id_idx" ON "audit_logs"("correlation_id");

-- CreateIndex
CREATE INDEX "audit_logs_tenant_id_idx" ON "audit_logs"("tenant_id");

-- CreateIndex
CREATE INDEX "notification_logs_recipient_idx" ON "notification_logs"("recipient");

-- CreateIndex
CREATE INDEX "notification_logs_status_idx" ON "notification_logs"("status");

-- CreateIndex
CREATE INDEX "notification_logs_event_type_idx" ON "notification_logs"("event_type");

-- CreateIndex
CREATE INDEX "security_events_correlation_id_idx" ON "security_events"("correlation_id");

-- CreateIndex
CREATE INDEX "security_events_category_idx" ON "security_events"("category");

-- CreateIndex
CREATE INDEX "security_events_resolved_idx" ON "security_events"("resolved");

-- CreateIndex
CREATE INDEX "sessions_created_at_idx" ON "sessions"("created_at");

-- CreateIndex
CREATE INDEX "sessions_ip_address_idx" ON "sessions"("ip_address");

-- CreateIndex
CREATE INDEX "sessions_device_type_idx" ON "sessions"("device_type");

-- CreateIndex
CREATE INDEX "user_login_log_success_idx" ON "user_login_log"("success");

-- CreateIndex
CREATE INDEX "user_login_log_is_suspicious_idx" ON "user_login_log"("is_suspicious");

-- CreateIndex
CREATE INDEX "user_login_log_device_fingerprint_idx" ON "user_login_log"("device_fingerprint");
