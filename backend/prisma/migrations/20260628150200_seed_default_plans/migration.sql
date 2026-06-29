-- Seed default subscription plans

INSERT INTO "plans" ("id", "name", "slug", "description", "interval", "price", "currency", "trial_days", "max_users", "max_branches", "max_students", "is_active", "sort_order", "created_at", "updated_at")
VALUES
  (gen_random_uuid(), 'Trial',       'trial',       'Try all features risk-free for 15 days',            'MONTHLY',      0,    'INR', 15, 10,  1,   10,   true, 0, NOW(), NOW()),
  (gen_random_uuid(), 'Starter',     'starter',     'Perfect for small academies',                        'MONTHLY',      999,  'INR', 0,  50,  2,   50,   true, 1, NOW(), NOW()),
  (gen_random_uuid(), 'Professional','professional','For growing institutions',                           'MONTHLY',      2499, 'INR', 0,  200, 5,   200,  true, 2, NOW(), NOW()),
  (gen_random_uuid(), 'Enterprise',  'enterprise',  'For large organizations',                            'MONTHLY',      6999, 'INR', 0,  NULL,NULL,NULL, true, 3, NOW(), NOW())
ON CONFLICT ("slug") DO NOTHING;
