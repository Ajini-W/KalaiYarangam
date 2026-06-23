/*
  Warnings:

  - You are about to drop the column `current_step` on the `onboarding_progress` table. All the data in the column will be lost.
  - You are about to drop the column `selected_role` on the `onboarding_progress` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "auth_error_logs" ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "timestamp" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "auth_providers" ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "linked_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "onboarding_progress" DROP COLUMN "current_step",
DROP COLUMN "selected_role",
ADD COLUMN     "currentStep" "OnboardingStep" NOT NULL DEFAULT 'ROLE_SELECTION',
ADD COLUMN     "selectedRole" "UserRole",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "completed_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updated_at" DROP DEFAULT,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "staff_branch_mappings" ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "tenant_access_requests" ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "skills" DROP DEFAULT,
ALTER COLUMN "reviewed_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updated_at" DROP DEFAULT,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "tenant_modules" ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "enabled_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3);
