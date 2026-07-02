/*
  Warnings:

  - The values [SETTINGS_CHANGE,WEBHOOK_CHANGE,API_KEY_CHANGE,INVITATION,SUBSCRIPTION_CHANGE,BILLING_CHANGE,DATA_EXPORT,ACCOUNT_LOCK,ACCOUNT_UNLOCK] on the enum `AuditAction` will be removed. If these variants are still used in the database, this will fail.
  - The values [COMPLETED,SUSPENDED,TRANSFERRED] on the enum `EnrollmentStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `action` on the `activity_logs` table. All the data in the column will be lost.
  - You are about to drop the column `correlation_id` on the `activity_logs` table. All the data in the column will be lost.
  - You are about to drop the column `execution_status` on the `activity_logs` table. All the data in the column will be lost.
  - You are about to drop the column `new_values` on the `activity_logs` table. All the data in the column will be lost.
  - You are about to drop the column `previous_values` on the `activity_logs` table. All the data in the column will be lost.
  - You are about to drop the column `project_id` on the `activity_logs` table. All the data in the column will be lost.
  - You are about to drop the column `request_source` on the `activity_logs` table. All the data in the column will be lost.
  - You are about to drop the column `resource` on the `activity_logs` table. All the data in the column will be lost.
  - You are about to drop the column `resource_id` on the `activity_logs` table. All the data in the column will be lost.
  - You are about to drop the column `user_agent` on the `activity_logs` table. All the data in the column will be lost.
  - You are about to drop the column `workspace_id` on the `activity_logs` table. All the data in the column will be lost.
  - You are about to drop the column `correlation_id` on the `api_logs` table. All the data in the column will be lost.
  - You are about to drop the column `request_id` on the `api_logs` table. All the data in the column will be lost.
  - You are about to drop the column `response_body` on the `api_logs` table. All the data in the column will be lost.
  - You are about to drop the column `tenant_id` on the `api_logs` table. All the data in the column will be lost.
  - You are about to drop the column `user_agent` on the `api_logs` table. All the data in the column will be lost.
  - You are about to drop the column `browser` on the `audit_logs` table. All the data in the column will be lost.
  - You are about to drop the column `correlation_id` on the `audit_logs` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `audit_logs` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `audit_logs` table. All the data in the column will be lost.
  - You are about to drop the column `metadata` on the `audit_logs` table. All the data in the column will be lost.
  - You are about to drop the column `os` on the `audit_logs` table. All the data in the column will be lost.
  - You are about to drop the column `request_id` on the `audit_logs` table. All the data in the column will be lost.
  - You are about to drop the column `paused_at` on the `enrollments` table. All the data in the column will be lost.
  - You are about to drop the column `total_paused_days` on the `enrollments` table. All the data in the column will be lost.
  - You are about to drop the column `delivered_at` on the `notification_logs` table. All the data in the column will be lost.
  - You are about to drop the column `event_type` on the `notification_logs` table. All the data in the column will be lost.
  - You are about to drop the column `metadata` on the `notification_logs` table. All the data in the column will be lost.
  - You are about to drop the column `read_at` on the `notification_logs` table. All the data in the column will be lost.
  - You are about to drop the column `retry_count` on the `notification_logs` table. All the data in the column will be lost.
  - You are about to drop the column `browser` on the `security_events` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `security_events` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `security_events` table. All the data in the column will be lost.
  - You are about to drop the column `correlation_id` on the `security_events` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `security_events` table. All the data in the column will be lost.
  - You are about to drop the column `country_code` on the `security_events` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `security_events` table. All the data in the column will be lost.
  - You are about to drop the column `device_type` on the `security_events` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `security_events` table. All the data in the column will be lost.
  - You are about to drop the column `os` on the `security_events` table. All the data in the column will be lost.
  - You are about to drop the column `resolved` on the `security_events` table. All the data in the column will be lost.
  - You are about to drop the column `resolved_at` on the `security_events` table. All the data in the column will be lost.
  - You are about to drop the column `resolved_by` on the `security_events` table. All the data in the column will be lost.
  - You are about to drop the column `browser` on the `sessions` table. All the data in the column will be lost.
  - You are about to drop the column `browser_version` on the `sessions` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `sessions` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `sessions` table. All the data in the column will be lost.
  - You are about to drop the column `country_code` on the `sessions` table. All the data in the column will be lost.
  - You are about to drop the column `device_name` on the `sessions` table. All the data in the column will be lost.
  - You are about to drop the column `device_type` on the `sessions` table. All the data in the column will be lost.
  - You are about to drop the column `latitude` on the `sessions` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `sessions` table. All the data in the column will be lost.
  - You are about to drop the column `login_method` on the `sessions` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `sessions` table. All the data in the column will be lost.
  - You are about to drop the column `os` on the `sessions` table. All the data in the column will be lost.
  - You are about to drop the column `os_version` on the `sessions` table. All the data in the column will be lost.
  - You are about to drop the column `revoke_reason` on the `sessions` table. All the data in the column will be lost.
  - You are about to drop the column `address` on the `tenants` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `tenants` table. All the data in the column will be lost.
  - You are about to drop the column `latitude` on the `tenants` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `tenants` table. All the data in the column will be lost.
  - You are about to drop the column `pincode` on the `tenants` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `tenants` table. All the data in the column will be lost.
  - You are about to drop the column `browser` on the `user_login_log` table. All the data in the column will be lost.
  - You are about to drop the column `browser_version` on the `user_login_log` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `user_login_log` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `user_login_log` table. All the data in the column will be lost.
  - You are about to drop the column `country_code` on the `user_login_log` table. All the data in the column will be lost.
  - You are about to drop the column `device_fingerprint` on the `user_login_log` table. All the data in the column will be lost.
  - You are about to drop the column `device_name` on the `user_login_log` table. All the data in the column will be lost.
  - You are about to drop the column `device_type` on the `user_login_log` table. All the data in the column will be lost.
  - You are about to drop the column `failure_reason` on the `user_login_log` table. All the data in the column will be lost.
  - You are about to drop the column `is_suspicious` on the `user_login_log` table. All the data in the column will be lost.
  - You are about to drop the column `latitude` on the `user_login_log` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `user_login_log` table. All the data in the column will be lost.
  - You are about to drop the column `login_method` on the `user_login_log` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `user_login_log` table. All the data in the column will be lost.
  - You are about to drop the column `metadata` on the `user_login_log` table. All the data in the column will be lost.
  - You are about to drop the column `os` on the `user_login_log` table. All the data in the column will be lost.
  - You are about to drop the column `os_version` on the `user_login_log` table. All the data in the column will be lost.
  - You are about to drop the column `suspicious_reason` on the `user_login_log` table. All the data in the column will be lost.
  - You are about to alter the column `avatar_url` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(500)`.
  - You are about to drop the `renewals` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `transfers` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AuditAction_new" AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'EXPORT', 'IMPORT', 'SESSION_REVOKE', 'PASSWORD_CHANGE', 'ROLE_CHANGE', 'STATUS_CHANGE', 'PERMISSION_CHANGE', 'SECURITY_EVENT', 'TWO_FACTOR_ENABLE', 'TWO_FACTOR_DISABLE');
ALTER TABLE "audit_logs" ALTER COLUMN "action" TYPE "AuditAction_new" USING ("action"::text::"AuditAction_new");
ALTER TYPE "AuditAction" RENAME TO "AuditAction_old";
ALTER TYPE "AuditAction_new" RENAME TO "AuditAction";
DROP TYPE "AuditAction_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "EnrollmentStatus_new" AS ENUM ('ACTIVE', 'PAUSED', 'CANCELLED', 'DROPPED');
ALTER TABLE "enrollments" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "enrollments" ALTER COLUMN "status" TYPE "EnrollmentStatus_new" USING ("status"::text::"EnrollmentStatus_new");
ALTER TYPE "EnrollmentStatus" RENAME TO "EnrollmentStatus_old";
ALTER TYPE "EnrollmentStatus_new" RENAME TO "EnrollmentStatus";
DROP TYPE "EnrollmentStatus_old";
ALTER TABLE "enrollments" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';
COMMIT;

-- DropForeignKey
ALTER TABLE "renewals" DROP CONSTRAINT "renewals_enrollment_id_fkey";

-- DropForeignKey
ALTER TABLE "transfers" DROP CONSTRAINT "transfers_enrollment_id_fkey";

-- DropIndex
DROP INDEX "activity_logs_action_idx";

-- DropIndex
DROP INDEX "activity_logs_correlation_id_idx";

-- DropIndex
DROP INDEX "activity_logs_resource_idx";

-- DropIndex
DROP INDEX "activity_logs_tenant_id_idx";

-- DropIndex
DROP INDEX "api_logs_correlation_id_idx";

-- DropIndex
DROP INDEX "api_logs_status_code_idx";

-- DropIndex
DROP INDEX "api_logs_tenant_id_idx";

-- DropIndex
DROP INDEX "api_logs_user_id_idx";

-- DropIndex
DROP INDEX "audit_logs_action_idx";

-- DropIndex
DROP INDEX "audit_logs_correlation_id_idx";

-- DropIndex
DROP INDEX "audit_logs_tenant_id_idx";

-- DropIndex
DROP INDEX "notification_logs_event_type_idx";

-- DropIndex
DROP INDEX "notification_logs_recipient_idx";

-- DropIndex
DROP INDEX "notification_logs_status_idx";

-- DropIndex
DROP INDEX "security_events_category_idx";

-- DropIndex
DROP INDEX "security_events_correlation_id_idx";

-- DropIndex
DROP INDEX "security_events_resolved_idx";

-- DropIndex
DROP INDEX "sessions_created_at_idx";

-- DropIndex
DROP INDEX "sessions_device_type_idx";

-- DropIndex
DROP INDEX "sessions_ip_address_idx";

-- DropIndex
DROP INDEX "user_login_log_device_fingerprint_idx";

-- DropIndex
DROP INDEX "user_login_log_is_suspicious_idx";

-- DropIndex
DROP INDEX "user_login_log_success_idx";

-- AlterTable
ALTER TABLE "activity_logs" DROP COLUMN "action",
DROP COLUMN "correlation_id",
DROP COLUMN "execution_status",
DROP COLUMN "new_values",
DROP COLUMN "previous_values",
DROP COLUMN "project_id",
DROP COLUMN "request_source",
DROP COLUMN "resource",
DROP COLUMN "resource_id",
DROP COLUMN "user_agent",
DROP COLUMN "workspace_id";

-- AlterTable
ALTER TABLE "api_logs" DROP COLUMN "correlation_id",
DROP COLUMN "request_id",
DROP COLUMN "response_body",
DROP COLUMN "tenant_id",
DROP COLUMN "user_agent";

-- AlterTable
ALTER TABLE "audit_logs" DROP COLUMN "browser",
DROP COLUMN "correlation_id",
DROP COLUMN "description",
DROP COLUMN "location",
DROP COLUMN "metadata",
DROP COLUMN "os",
DROP COLUMN "request_id";

-- AlterTable
ALTER TABLE "enrollments" DROP COLUMN "paused_at",
DROP COLUMN "total_paused_days";

-- AlterTable
ALTER TABLE "notification_logs" DROP COLUMN "delivered_at",
DROP COLUMN "event_type",
DROP COLUMN "metadata",
DROP COLUMN "read_at",
DROP COLUMN "retry_count";

-- AlterTable
ALTER TABLE "security_events" DROP COLUMN "browser",
DROP COLUMN "category",
DROP COLUMN "city",
DROP COLUMN "correlation_id",
DROP COLUMN "country",
DROP COLUMN "country_code",
DROP COLUMN "description",
DROP COLUMN "device_type",
DROP COLUMN "location",
DROP COLUMN "os",
DROP COLUMN "resolved",
DROP COLUMN "resolved_at",
DROP COLUMN "resolved_by";

-- AlterTable
ALTER TABLE "sessions" DROP COLUMN "browser",
DROP COLUMN "browser_version",
DROP COLUMN "city",
DROP COLUMN "country",
DROP COLUMN "country_code",
DROP COLUMN "device_name",
DROP COLUMN "device_type",
DROP COLUMN "latitude",
DROP COLUMN "location",
DROP COLUMN "login_method",
DROP COLUMN "longitude",
DROP COLUMN "os",
DROP COLUMN "os_version",
DROP COLUMN "revoke_reason";

-- AlterTable
ALTER TABLE "tenants" DROP COLUMN "address",
DROP COLUMN "city",
DROP COLUMN "latitude",
DROP COLUMN "longitude",
DROP COLUMN "pincode",
DROP COLUMN "state";

-- AlterTable
ALTER TABLE "user_login_log" DROP COLUMN "browser",
DROP COLUMN "browser_version",
DROP COLUMN "city",
DROP COLUMN "country",
DROP COLUMN "country_code",
DROP COLUMN "device_fingerprint",
DROP COLUMN "device_name",
DROP COLUMN "device_type",
DROP COLUMN "failure_reason",
DROP COLUMN "is_suspicious",
DROP COLUMN "latitude",
DROP COLUMN "location",
DROP COLUMN "login_method",
DROP COLUMN "longitude",
DROP COLUMN "metadata",
DROP COLUMN "os",
DROP COLUMN "os_version",
DROP COLUMN "suspicious_reason";

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "avatar_url" SET DATA TYPE VARCHAR(500);

-- DropTable
DROP TABLE "renewals";

-- DropTable
DROP TABLE "transfers";

-- DropEnum
DROP TYPE "DeviceType";

-- DropEnum
DROP TYPE "FailureReason";

-- DropEnum
DROP TYPE "LoginMethod";

-- DropEnum
DROP TYPE "RenewalStatus";

-- DropEnum
DROP TYPE "TransferStatus";
