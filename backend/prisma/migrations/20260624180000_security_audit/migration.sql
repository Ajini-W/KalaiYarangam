-- CreateEnum: Add new AuditAction values
ALTER TYPE "AuditAction" ADD VALUE IF NOT EXISTS 'SESSION_REVOKE';
ALTER TYPE "AuditAction" ADD VALUE IF NOT EXISTS 'PASSWORD_CHANGE';
ALTER TYPE "AuditAction" ADD VALUE IF NOT EXISTS 'ROLE_CHANGE';
ALTER TYPE "AuditAction" ADD VALUE IF NOT EXISTS 'STATUS_CHANGE';
ALTER TYPE "AuditAction" ADD VALUE IF NOT EXISTS 'PERMISSION_CHANGE';
ALTER TYPE "AuditAction" ADD VALUE IF NOT EXISTS 'SECURITY_EVENT';
ALTER TYPE "AuditAction" ADD VALUE IF NOT EXISTS 'TWO_FACTOR_ENABLE';
ALTER TYPE "AuditAction" ADD VALUE IF NOT EXISTS 'TWO_FACTOR_DISABLE';

-- CreateTable: sessions
CREATE TABLE "sessions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "token" TEXT NOT NULL,
    "refresh_token" TEXT,
    "ip_address" VARCHAR(45),
    "user_agent" VARCHAR(500),
    "device_info" VARCHAR(500),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "last_activity" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revoked_at" TIMESTAMP(3),

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "sessions_token_key" UNIQUE ("token")
);

CREATE INDEX "sessions_user_id_idx" ON "sessions"("user_id");
CREATE INDEX "sessions_token_idx" ON "sessions"("token");
CREATE INDEX "sessions_is_active_idx" ON "sessions"("is_active");

ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable: security_events
CREATE TABLE "security_events" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID,
    "tenant_id" UUID,
    "event_type" VARCHAR(100) NOT NULL,
    "severity" VARCHAR(20) NOT NULL DEFAULT 'INFO',
    "message" TEXT NOT NULL,
    "ip_address" VARCHAR(45),
    "user_agent" VARCHAR(500),
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "security_events_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "security_events_user_id_idx" ON "security_events"("user_id");
CREATE INDEX "security_events_tenant_id_idx" ON "security_events"("tenant_id");
CREATE INDEX "security_events_event_type_idx" ON "security_events"("event_type");
CREATE INDEX "security_events_severity_idx" ON "security_events"("severity");
CREATE INDEX "security_events_created_at_idx" ON "security_events"("created_at");

ALTER TABLE "security_events" ADD CONSTRAINT "security_events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "security_events" ADD CONSTRAINT "security_events_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
