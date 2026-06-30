-- Add address, city, state, pincode, latitude, longitude columns to tenants table
ALTER TABLE "tenants"
  ADD COLUMN "address" VARCHAR(500),
  ADD COLUMN "city" VARCHAR(100),
  ADD COLUMN "state" VARCHAR(100),
  ADD COLUMN "pincode" VARCHAR(20),
  ADD COLUMN "latitude" DOUBLE PRECISION,
  ADD COLUMN "longitude" DOUBLE PRECISION;
