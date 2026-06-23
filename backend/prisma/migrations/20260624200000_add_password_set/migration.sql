ALTER TABLE "users" ADD COLUMN "password_set" BOOLEAN NOT NULL DEFAULT false;

-- Existing users who registered normally already have a password
UPDATE "users" SET "password_set" = true
WHERE "password_hash" IS NOT NULL
  AND "id" NOT IN (
    SELECT DISTINCT "user_id" FROM "auth_providers" WHERE "provider" = 'GOOGLE'
  );
