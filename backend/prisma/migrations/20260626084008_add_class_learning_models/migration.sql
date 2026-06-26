/*
  Warnings:

  - Added the required column `tenant_id` to the `student_progress` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `student_progress` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TaskType" AS ENUM ('HOMEWORK', 'ASSIGNMENT', 'QUIZ', 'PROJECT', 'EXAM');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('PENDING', 'ACTIVE', 'SUBMISSION_CLOSED', 'GRADED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('NOT_SUBMITTED', 'SUBMITTED', 'LATE', 'GRADED', 'RETURNED');

-- AlterTable
ALTER TABLE "student_progress" ADD COLUMN     "tenant_id" UUID NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "tasks" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "batch_id" UUID NOT NULL,
    "created_by" UUID NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "type" "TaskType" NOT NULL,
    "status" "TaskStatus" NOT NULL DEFAULT 'PENDING',
    "due_date" DATE,
    "max_score" INTEGER,
    "allow_late_submission" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_task_submissions" (
    "id" UUID NOT NULL,
    "task_id" UUID NOT NULL,
    "student_id" UUID NOT NULL,
    "submitted_at" TIMESTAMP(3),
    "content" TEXT,
    "file_url" VARCHAR(500),
    "score" INTEGER,
    "feedback" TEXT,
    "status" "SubmissionStatus" NOT NULL DEFAULT 'NOT_SUBMITTED',
    "graded_by" UUID,
    "graded_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "student_task_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "tasks_tenant_id_idx" ON "tasks"("tenant_id");

-- CreateIndex
CREATE INDEX "tasks_batch_id_idx" ON "tasks"("batch_id");

-- CreateIndex
CREATE INDEX "tasks_batch_id_status_idx" ON "tasks"("batch_id", "status");

-- CreateIndex
CREATE INDEX "tasks_due_date_idx" ON "tasks"("due_date");

-- CreateIndex
CREATE INDEX "student_task_submissions_task_id_idx" ON "student_task_submissions"("task_id");

-- CreateIndex
CREATE INDEX "student_task_submissions_student_id_idx" ON "student_task_submissions"("student_id");

-- CreateIndex
CREATE INDEX "student_task_submissions_status_idx" ON "student_task_submissions"("status");

-- CreateIndex
CREATE UNIQUE INDEX "student_task_submissions_task_id_student_id_key" ON "student_task_submissions"("task_id", "student_id");

-- CreateIndex
CREATE INDEX "student_progress_tenant_id_idx" ON "student_progress"("tenant_id");

-- CreateIndex
CREATE INDEX "student_progress_batch_id_idx" ON "student_progress"("batch_id");

-- CreateIndex
CREATE INDEX "student_progress_trainer_id_idx" ON "student_progress"("trainer_id");

-- CreateIndex
CREATE INDEX "student_progress_student_id_batch_id_idx" ON "student_progress"("student_id", "batch_id");

-- AddForeignKey
ALTER TABLE "student_progress" ADD CONSTRAINT "student_progress_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_progress" ADD CONSTRAINT "student_progress_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "batches"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "batches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_task_submissions" ADD CONSTRAINT "student_task_submissions_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_task_submissions" ADD CONSTRAINT "student_task_submissions_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_task_submissions" ADD CONSTRAINT "student_task_submissions_graded_by_fkey" FOREIGN KEY ("graded_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
