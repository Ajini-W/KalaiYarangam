-- CreateEnum
CREATE TYPE "TransferStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "RenewalStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "EnrollmentStatus" ADD VALUE 'PAUSED';
ALTER TYPE "EnrollmentStatus" ADD VALUE 'CANCELLED';

-- AlterTable
ALTER TABLE "enrollments" ADD COLUMN     "paused_at" TIMESTAMP(3),
ADD COLUMN     "total_paused_days" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "transfers" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "enrollment_id" UUID NOT NULL,
    "from_batch_id" UUID NOT NULL,
    "to_batch_id" UUID NOT NULL,
    "status" "TransferStatus" NOT NULL DEFAULT 'PENDING',
    "reason" TEXT,
    "approved_at" TIMESTAMP(3),
    "rejected_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transfers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "renewals" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "enrollment_id" UUID NOT NULL,
    "current_end_date" DATE NOT NULL,
    "extended_end_date" DATE NOT NULL,
    "status" "RenewalStatus" NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "approved_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "renewals_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "transfers_enrollment_id_idx" ON "transfers"("enrollment_id");

-- CreateIndex
CREATE INDEX "transfers_status_idx" ON "transfers"("status");

-- CreateIndex
CREATE INDEX "renewals_enrollment_id_idx" ON "renewals"("enrollment_id");

-- CreateIndex
CREATE INDEX "renewals_status_idx" ON "renewals"("status");

-- AddForeignKey
ALTER TABLE "transfers" ADD CONSTRAINT "transfers_enrollment_id_fkey" FOREIGN KEY ("enrollment_id") REFERENCES "enrollments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "renewals" ADD CONSTRAINT "renewals_enrollment_id_fkey" FOREIGN KEY ("enrollment_id") REFERENCES "enrollments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
