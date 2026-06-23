-- Add preferences JSON column to users table
ALTER TABLE "users" ADD COLUMN "preferences" JSONB DEFAULT '{}'::jsonb;

-- Create user_devices table for FCM push tokens
CREATE TABLE "user_devices" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "token" TEXT NOT NULL,
    "platform" VARCHAR(20),
    "user_agent" VARCHAR(500),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_devices_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "user_devices_user_id_token_key" UNIQUE ("user_id", "token"),
    CONSTRAINT "user_devices_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
);

CREATE INDEX "user_devices_user_id_idx" ON "user_devices" ("user_id");
