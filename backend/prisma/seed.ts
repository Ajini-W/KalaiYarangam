import { PrismaClient, PlanInterval } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const DEFAULT_PLANS = [
  {
    name: 'Trial',
    slug: 'trial',
    description: 'Try all features risk-free for 15 days',
    interval: PlanInterval.MONTHLY,
    price: 0,
    trialDays: 15,
    maxUsers: 10,
    maxBranches: 1,
    maxStudents: 10,
    sortOrder: 0,
  },
  {
    name: 'Starter',
    slug: 'starter',
    description: 'Perfect for small academies',
    interval: PlanInterval.MONTHLY,
    price: 999,
    trialDays: 0,
    maxUsers: 50,
    maxBranches: 2,
    maxStudents: 50,
    sortOrder: 1,
  },
  {
    name: 'Professional',
    slug: 'professional',
    description: 'For growing institutions',
    interval: PlanInterval.MONTHLY,
    price: 2499,
    trialDays: 0,
    maxUsers: 200,
    maxBranches: 5,
    maxStudents: 200,
    sortOrder: 2,
  },
  {
    name: 'Enterprise',
    slug: 'enterprise',
    description: 'For large organizations',
    interval: PlanInterval.MONTHLY,
    price: 6999,
    trialDays: 0,
    maxUsers: null,
    maxBranches: null,
    maxStudents: null,
    sortOrder: 3,
  },
];

async function main() {
  const passwordHash = await bcrypt.hash('Password123!', 10);

  // Seed default plans
  for (const plan of DEFAULT_PLANS) {
    await prisma.plan.upsert({
      where: { slug: plan.slug },
      update: {},
      create: plan,
    });
  }
  console.log(`Seeded ${DEFAULT_PLANS.length} plans.`);

  const tenant = await prisma.tenant.upsert({
    where: { slug: 'demo-academy' },
    update: {},
    create: {
      name: 'Demo Academy',
      slug: 'demo-academy',
      industry: 'TRAINING',
      branches: {
        create: { name: 'Main Branch', city: 'Chennai', isDefault: true },
      },
      users: {
        create: {
          email: 'owner@demo.com',
          passwordHash,
          name: 'Demo Owner',
          phone: '9876543210',
          role: 'OWNER',
        },
      },
      leads: {
        create: [
          {
            name: 'Priya Sharma',
            phone: '9876543210',
            course: 'Bharatanatyam',
            source: 'WALK_IN',
            status: 'NEW',
          },
          {
            name: 'Ravi Kumar',
            phone: '9876543211',
            course: 'Karate',
            source: 'REFERRAL',
            status: 'FOLLOWUP',
          },
        ],
      },
      batches: {
        create: [
          {
            name: 'Morning Batch A',
            capacity: 25,
          },
        ],
      },
    },
    include: { branches: true, batches: true },
  });

  const batch = tenant.batches[0];

  if (batch) {
    await prisma.student.create({
      data: {
        tenantId: tenant.id,
        name: 'Meena Devi',
        phone: '9876543212',
        email: 'meena@example.com',
      },
    });
  }

  console.log('Seed complete. Login: owner@demo.com / Password123!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
