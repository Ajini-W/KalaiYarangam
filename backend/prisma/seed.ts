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
      industry: 'training',
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
            source: 'Walk-in',
            status: 'NEW',
          },
          {
            name: 'Ravi Kumar',
            phone: '9876543211',
            course: 'Karate',
            source: 'Referral',
            status: 'FOLLOWUP',
          },
        ],
      },
      events: {
        create: [
          {
            name: 'Raj & Priya Wedding',
            client: 'Raj Family',
            type: 'Wedding',
            eventDate: new Date('2026-06-20'),
            budget: 800000,
            status: 'CONFIRMED',
          },
        ],
      },
      trainingBatches: {
        create: [
          {
            name: 'Morning Batch A',
            course: 'Bharatanatyam',
            schedule: 'Mon/Wed/Fri 6–8 AM',
            capacity: 25,
          },
        ],
      },
      rentalItems: {
        create: [
          {
            name: 'LED Par Can',
            category: 'Lighting',
            sku: 'LED-001',
            dailyRate: 500,
            quantity: 20,
            available: 18,
          },
        ],
      },
    },
    include: { branches: true, trainingBatches: true, rentalItems: true },
  });

  const batch = tenant.trainingBatches[0];
  const item = tenant.rentalItems[0];

  if (batch) {
    await prisma.student.create({
      data: {
        tenantId: tenant.id,
        batchId: batch.id,
        name: 'Meena Devi',
        phone: '9876543212',
        email: 'meena@example.com',
      },
    });
  }

  if (item) {
    await prisma.rentalBooking.create({
      data: {
        tenantId: tenant.id,
        itemId: item.id,
        client: 'TechCorp Events',
        startDate: new Date('2026-06-25'),
        endDate: new Date('2026-06-27'),
        quantity: 4,
        status: 'CONFIRMED',
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
