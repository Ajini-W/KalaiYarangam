-- AlterEnum: Add new values to UserStatus
ALTER TYPE "UserStatus" ADD VALUE IF NOT EXISTS 'NEW_USER';
ALTER TYPE "UserStatus" ADD VALUE IF NOT EXISTS 'REGISTERED';
ALTER TYPE "UserStatus" ADD VALUE IF NOT EXISTS 'PROFILE_COMPLETED';
ALTER TYPE "UserStatus" ADD VALUE IF NOT EXISTS 'ACCESS_REQUESTED';
ALTER TYPE "UserStatus" ADD VALUE IF NOT EXISTS 'PENDING_APPROVAL';
ALTER TYPE "UserStatus" ADD VALUE IF NOT EXISTS 'APPROVED';

-- CreateEnum: AuthProviderType
CREATE TYPE "AuthProviderType" AS ENUM ('EMAIL', 'GOOGLE');

-- CreateEnum: AccessRequestStatus
CREATE TYPE "AccessRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'BLOCKED');

-- CreateEnum: OnboardingStep
CREATE TYPE "OnboardingStep" AS ENUM ('ROLE_SELECTION', 'PROFILE_SETUP', 'TENANT_SETUP', 'BRANCH_SETUP', 'MODULE_SELECTION', 'SUBSCRIPTION', 'SEARCH_TENANT', 'SELECT_BRANCH', 'SKILLS_SETUP', 'COURSE_SELECTION', 'COMPLETED');

-- CreateTable: auth_providers
CREATE TABLE "auth_providers" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "provider" "AuthProviderType" NOT NULL,
    "provider_id" VARCHAR(255),
    "email" VARCHAR(255),
    "linked_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auth_providers_pkey" PRIMARY KEY ("id")
);

-- CreateTable: auth_error_logs
CREATE TABLE "auth_error_logs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "error_code" VARCHAR(100) NOT NULL,
    "error_message" TEXT NOT NULL,
    "provider" VARCHAR(50),
    "user_id" UUID,
    "timestamp" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB,

    CONSTRAINT "auth_error_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable: tenant_modules
CREATE TABLE "tenant_modules" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" UUID NOT NULL,
    "module" "IndustryType" NOT NULL,
    "is_enabled" BOOLEAN NOT NULL DEFAULT false,
    "enabled_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tenant_modules_pkey" PRIMARY KEY ("id")
);

-- CreateTable: tenant_access_requests
CREATE TABLE "tenant_access_requests" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" UUID,
    "branch_id" UUID,
    "user_id" UUID NOT NULL,
    "role" "UserRole" NOT NULL,
    "status" "AccessRequestStatus" NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "preferred_branch_id" UUID,
    "skills" VARCHAR(100)[] DEFAULT ARRAY[]::VARCHAR(100)[],
    "specialization" VARCHAR(200),
    "course_id" UUID,
    "reviewed_by" UUID,
    "reviewed_at" TIMESTAMPTZ,
    "rejection_reason" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tenant_access_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable: staff_branch_mappings
CREATE TABLE "staff_branch_mappings" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "branch_id" UUID,
    "tenant_id" UUID,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "staff_branch_mappings_pkey" PRIMARY KEY ("id")
);

-- CreateTable: onboarding_progress
CREATE TABLE "onboarding_progress" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "selected_role" "UserRole",
    "current_step" "OnboardingStep" NOT NULL DEFAULT 'ROLE_SELECTION',
    "is_completed" BOOLEAN NOT NULL DEFAULT false,
    "completed_at" TIMESTAMPTZ,
    "metadata" JSONB,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "onboarding_progress_pkey" PRIMARY KEY ("id")
);

-- CreateIndexes
CREATE UNIQUE INDEX "auth_providers_user_id_provider_key" ON "auth_providers"("user_id", "provider");
CREATE INDEX "auth_providers_provider_provider_id_idx" ON "auth_providers"("provider", "provider_id");
CREATE UNIQUE INDEX "tenant_modules_tenant_id_module_key" ON "tenant_modules"("tenant_id", "module");
CREATE INDEX "tenant_access_requests_tenant_id_idx" ON "tenant_access_requests"("tenant_id");
CREATE INDEX "tenant_access_requests_user_id_idx" ON "tenant_access_requests"("user_id");
CREATE INDEX "tenant_access_requests_status_idx" ON "tenant_access_requests"("status");
CREATE UNIQUE INDEX "staff_branch_mappings_user_id_branch_id_key" ON "staff_branch_mappings"("user_id", "branch_id");
CREATE UNIQUE INDEX "onboarding_progress_user_id_key" ON "onboarding_progress"("user_id");

-- AddForeignKeys
ALTER TABLE "auth_providers" ADD CONSTRAINT "auth_providers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "tenant_modules" ADD CONSTRAINT "tenant_modules_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "tenant_access_requests" ADD CONSTRAINT "tenant_access_requests_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "tenant_access_requests" ADD CONSTRAINT "tenant_access_requests_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "tenant_access_requests" ADD CONSTRAINT "tenant_access_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "tenant_access_requests" ADD CONSTRAINT "tenant_access_requests_reviewed_by_fkey" FOREIGN KEY ("reviewed_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "staff_branch_mappings" ADD CONSTRAINT "staff_branch_mappings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "staff_branch_mappings" ADD CONSTRAINT "staff_branch_mappings_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "staff_branch_mappings" ADD CONSTRAINT "staff_branch_mappings_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "onboarding_progress" ADD CONSTRAINT "onboarding_progress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
