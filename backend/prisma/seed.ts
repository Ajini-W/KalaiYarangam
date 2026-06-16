import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('Password123!', 10);

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
