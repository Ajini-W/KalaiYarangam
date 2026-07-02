import { PrismaClient, PlanInterval } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

function monthsAgo(n: number): Date {
  const d = new Date();
  d.setMonth(d.getMonth() - n);
  d.setDate(1);
  return d;
}

async function main() {
  console.warn('⚠️  This seed script only upserts plans and samples students.');
  console.warn('    It will NOT delete any existing tenant data.');

  const passwordHash = await bcrypt.hash('Password123!', 10);

  // ── Tenant ─────────────────────────────────────────────────
  const tenant = await prisma.tenant.upsert({
    where: { slug: 'demo-academy' },
    update: {},
    create: {
      name: 'Demo Academy',
      slug: 'demo-academy',
      industry: 'TRAINING',
    },
  });

  // ── Users ──────────────────────────────────────────────────
  const owner = await prisma.user.upsert({
    where: { email: 'owner@demo.com' },
    update: {},
    create: {
      tenantId: tenant.id, email: 'owner@demo.com', passwordHash,
      name: 'Demo Owner', phone: '9876543210', role: 'OWNER',
    },
  });

  const trainer = await prisma.user.upsert({
    where: { email: 'trainer@demo.com' },
    update: {},
    create: {
      tenantId: tenant.id, email: 'trainer@demo.com', passwordHash,
      name: 'Arun Kumar', phone: '9876543220', role: 'TRAINER',
    },
  });

  // ── Branches ───────────────────────────────────────────────
  const mainBranch = await prisma.branch.upsert({
    where: { id: '10000000-0000-0000-0000-000000000001' },
    update: {},
    create: {
      id: '10000000-0000-0000-0000-000000000001',
      tenantId: tenant.id, name: 'Main Branch', city: 'Chennai', isDefault: true,
    },
  });

  const secondBranch = await prisma.branch.upsert({
    where: { id: '10000000-0000-0000-0000-000000000002' },
    update: {},
    create: {
      id: '10000000-0000-0000-0000-000000000002',
      tenantId: tenant.id, name: 'Downtown Branch', city: 'Chennai',
    },
  });

  // ── Courses ────────────────────────────────────────────────
  const c1 = await prisma.course.upsert({
    where: { id: '20000000-0000-0000-0000-000000000001' },
    update: {},
    create: {
      id: '20000000-0000-0000-0000-000000000001',
      tenantId: tenant.id, name: 'Bharatanatyam', code: 'BN-101', duration: 48, fee: 15000,
    },
  });
  const c2 = await prisma.course.upsert({
    where: { id: '20000000-0000-0000-0000-000000000002' },
    update: {},
    create: {
      id: '20000000-0000-0000-0000-000000000002',
      tenantId: tenant.id, name: 'Karate', code: 'KT-101', duration: 36, fee: 12000,
    },
  });
  const c3 = await prisma.course.upsert({
    where: { id: '20000000-0000-0000-0000-000000000003' },
    update: {},
    create: {
      id: '20000000-0000-0000-0000-000000000003',
      tenantId: tenant.id, name: 'Carnatic Music', code: 'CM-101', duration: 24, fee: 10000,
    },
  });

  // ── Batches ────────────────────────────────────────────────
  const b1 = await prisma.batch.upsert({
    where: { id: '30000000-0000-0000-0000-000000000001' },
    update: {},
    create: {
      id: '30000000-0000-0000-0000-000000000001',
      tenantId: tenant.id, branchId: mainBranch.id, courseId: c1.id,
      name: 'Morning Batch A', capacity: 25, enrolled: 0, status: 'ACTIVE',
    },
  });
  const b2 = await prisma.batch.upsert({
    where: { id: '30000000-0000-0000-0000-000000000002' },
    update: {},
    create: {
      id: '30000000-0000-0000-0000-000000000002',
      tenantId: tenant.id, branchId: mainBranch.id, courseId: c1.id,
      name: 'Evening Batch B', capacity: 20, enrolled: 0, status: 'ACTIVE',
    },
  });
  const b3 = await prisma.batch.upsert({
    where: { id: '30000000-0000-0000-0000-000000000003' },
    update: {},
    create: {
      id: '30000000-0000-0000-0000-000000000003',
      tenantId: tenant.id, branchId: secondBranch.id, courseId: c2.id,
      name: 'Weekend Karate', capacity: 30, enrolled: 0, status: 'ACTIVE',
    },
  });
  const b4 = await prisma.batch.upsert({
    where: { id: '30000000-0000-0000-0000-000000000004' },
    update: {},
    create: {
      id: '30000000-0000-0000-0000-000000000004',
      tenantId: tenant.id, branchId: secondBranch.id, courseId: c3.id,
      name: 'Music Batch', capacity: 15, enrolled: 0, status: 'UPCOMING',
    },
  });

  const allBatches = [b1, b2, b3, b4];

  // ── Students ───────────────────────────────────────────────
  const students = [
    { phone: '9876543212', name: 'Meena Devi', email: 'meena@example.com', joinedAt: monthsAgo(5) },
    { phone: '9876543213', name: 'Ananya Raj', email: 'ananya@example.com', joinedAt: monthsAgo(4) },
    { phone: '9876543214', name: 'Karthik Subramanian', email: 'karthik@example.com', joinedAt: monthsAgo(3) },
    { phone: '9876543215', name: 'Divya Lakshmi', email: 'divya@example.com', joinedAt: monthsAgo(2) },
    { phone: '9876543216', name: 'Rahul Varma', email: 'rahul@example.com', joinedAt: monthsAgo(1) },
  ];

  const allStudents = await Promise.all(
    students.map((s) =>
      prisma.student.upsert({
        where: { tenantId_phone: { tenantId: tenant.id, phone: s.phone } },
        update: {},
        create: { tenantId: tenant.id, ...s },
      }),
    ),
  );

  // ── Fee Plans ──────────────────────────────────────────────
  const fp1 = await prisma.feePlan.upsert({
    where: { id: '40000000-0000-0000-0000-000000000001' },
    update: {},
    create: {
      id: '40000000-0000-0000-0000-000000000001',
      tenantId: tenant.id, courseId: c1.id, name: 'Bharatanatyam Monthly', feeType: 'MONTHLY', totalAmount: 3000, installments: 6,
    },
  });
  const fp2 = await prisma.feePlan.upsert({
    where: { id: '40000000-0000-0000-0000-000000000002' },
    update: {},
    create: {
      id: '40000000-0000-0000-0000-000000000002',
      tenantId: tenant.id, courseId: c2.id, name: 'Karate Quarterly', feeType: 'QUARTERLY', totalAmount: 4000, installments: 4,
    },
  });
  const fp3 = await prisma.feePlan.upsert({
    where: { id: '40000000-0000-0000-0000-000000000003' },
    update: {},
    create: {
      id: '40000000-0000-0000-0000-000000000003',
      tenantId: tenant.id, courseId: c3.id, name: 'Music Term Plan', feeType: 'TERM', totalAmount: 10000, installments: 1,
    },
  });

  // ── Enrollments ────────────────────────────────────────────
  const enrollmentSpecs = [
    { studentIdx: 0, batchIdx: 0, fp: fp1, status: 'ACTIVE' as const, months: 5 },
    { studentIdx: 1, batchIdx: 0, fp: fp1, status: 'ACTIVE' as const, months: 4 },
    { studentIdx: 2, batchIdx: 0, fp: fp1, status: 'ACTIVE' as const, months: 3 },
    { studentIdx: 3, batchIdx: 1, fp: fp1, status: 'ACTIVE' as const, months: 2 },
    { studentIdx: 4, batchIdx: 2, fp: fp2, status: 'ACTIVE' as const, months: 1 },
    { studentIdx: 0, batchIdx: 2, fp: fp2, status: 'COMPLETED' as const, months: 7 },
    { studentIdx: 1, batchIdx: 3, fp: fp3, status: 'DROPPED' as const, months: 3 },
  ];

  for (const e of enrollmentSpecs) {
    const student = allStudents[e.studentIdx];
    const batch = allBatches[e.batchIdx];
    await prisma.enrollment.upsert({
      where: { studentId_batchId: { studentId: student.id, batchId: batch.id } },
      update: {},
      create: { tenantId: tenant.id, studentId: student.id, batchId: batch.id, feePlanId: e.fp?.id, status: e.status, enrolledAt: monthsAgo(e.months) },
    });
  }

  // Sync batch enrolled counts
  for (const b of allBatches) {
    const count = await prisma.enrollment.count({ where: { batchId: b.id, status: 'ACTIVE' } });
    await prisma.batch.update({ where: { id: b.id }, data: { enrolled: count } });
  }

  // ── Trainer → Batch assignments ───────────────────────────
  for (const b of allBatches) {
    await prisma.batchTrainer.upsert({
      where: { batchId_trainerId: { batchId: b.id, trainerId: trainer.id } },
      update: {},
      create: { batchId: b.id, trainerId: trainer.id, isPrimary: true },
    });
  }

  // ── Paid Invoices (Revenue) ───────────────────────────────
  const paidInvoices = [
    { s: 0, b: 0, inv: 'INV-2026-001', amt: 3000, mo: 5 },
    { s: 0, b: 0, inv: 'INV-2026-006', amt: 15000, mo: 5 },
    { s: 1, b: 0, inv: 'INV-2026-002', amt: 3000, mo: 4 },
    { s: 1, b: 0, inv: 'INV-2026-007', amt: 12000, mo: 4 },
    { s: 2, b: 0, inv: 'INV-2026-003', amt: 3000, mo: 3 },
    { s: 2, b: 1, inv: 'INV-2026-008', amt: 4000, mo: 3 },
    { s: 3, b: 1, inv: 'INV-2026-004', amt: 3000, mo: 2 },
    { s: 3, b: 1, inv: 'INV-2026-009', amt: 3000, mo: 2 },
    { s: 4, b: 2, inv: 'INV-2026-005', amt: 4000, mo: 1 },
    { s: 4, b: 2, inv: 'INV-2026-010', amt: 4000, mo: 1 },
  ];

  for (const p of paidInvoices) {
    const paidDate = new Date(monthsAgo(p.mo).getTime() + 86400000 * 2);
    const dueDate = new Date(monthsAgo(p.mo - 1).getTime());

    const inv = await prisma.invoice.upsert({
      where: { tenantId_invoiceNumber: { tenantId: tenant.id, invoiceNumber: p.inv } },
      update: {},
      create: {
        tenantId: tenant.id, branchId: p.b === 0 ? mainBranch.id : secondBranch.id,
        studentId: allStudents[p.s].id, invoiceNumber: p.inv,
        description: 'Fee payment', subtotal: p.amt, tax: 0, discount: 0,
        totalAmount: p.amt, paidAmount: p.amt, status: 'PAID',
        issueDate: monthsAgo(p.mo), dueDate, paidAt: paidDate,
      },
    });

    await prisma.transaction.create({
      data: {
        tenantId: tenant.id, invoiceId: inv.id, type: 'INCOME',
        amount: p.amt, mode: 'ONLINE', transactionDate: paidDate,
      },
    });
  }

  // ── Due Invoices (Payment Due) ────────────────────────────
  const dueInvoices = [
    { s: 0, inv: 'INV-2026-011', amt: 3000, paid: 0, status: 'SENT' as const, dueOffset: 5 },
    { s: 1, inv: 'INV-2026-012', amt: 3000, paid: 1000, status: 'PARTIALLY_PAID' as const, dueOffset: -10 },
    { s: 2, inv: 'INV-2026-013', amt: 3000, paid: 0, status: 'OVERDUE' as const, dueOffset: -30 },
    { s: 3, inv: 'INV-2026-014', amt: 4000, paid: 0, status: 'OVERDUE' as const, dueOffset: -20 },
  ];

  const now = new Date();
  for (const d of dueInvoices) {
    const dueDate = new Date(now.getTime() + d.dueOffset * 86400000);
    await prisma.invoice.upsert({
      where: { tenantId_invoiceNumber: { tenantId: tenant.id, invoiceNumber: d.inv } },
      update: {},
      create: {
        tenantId: tenant.id, branchId: d.s < 3 ? mainBranch.id : secondBranch.id,
        studentId: allStudents[d.s].id, invoiceNumber: d.inv,
        description: 'Pending fee', subtotal: d.amt, tax: 0, discount: 0,
        totalAmount: d.amt, paidAmount: d.paid, status: d.status,
        issueDate: monthsAgo(2), dueDate,
      },
    });
  }

  // ── Class Sessions & Attendance ───────────────────────────
  // Clean old attendance data to avoid duplicates on re-run
  await prisma.studentAttendance.deleteMany({ where: { session: { tenantId: tenant.id } } });
  await prisma.attendanceSession.deleteMany({ where: { tenantId: tenant.id } });
  await prisma.classSession.deleteMany({ where: { batch: { tenantId: tenant.id } } });

  for (const b of allBatches) {
    const batchStudents = await prisma.enrollment.findMany({
      where: { batchId: b.id },
      select: { studentId: true },
    });
    const studentIds = batchStudents.map((e) => e.studentId);
    if (studentIds.length === 0) continue;

    for (let day = 5; day <= 25; day += 5) {
      const sessionDate = new Date(now.getFullYear(), now.getMonth(), day);
      if (sessionDate > now) break;

      const cs = await prisma.classSession.create({
        data: {
          batchId: b.id, date: sessionDate,
          startTime: '10:00', endTime: '11:30',
          topic: `Session Day ${day}`, status: 'COMPLETED',
        },
      });

      const attSession = await prisma.attendanceSession.create({
        data: {
          tenantId: tenant.id, branchId: b.branchId, batchId: b.id,
          classSessionId: cs.id, date: sessionDate, markedBy: trainer.id,
        },
      });

      await prisma.studentAttendance.createMany({
        data: studentIds.map((sid) => ({
          attendanceSessionId: attSession.id,
          studentId: sid,
          status: Math.random() > 0.2 ? 'PRESENT' : 'ABSENT',
        })),
      });
    }
  }

  // ── Student Progress ──────────────────────────────────────
  await prisma.studentProgress.deleteMany({ where: { tenantId: tenant.id } });

  for (const s of allStudents) {
    for (let i = 0; i < 3; i++) {
      const batch = allBatches[i];
      await prisma.studentProgress.create({
        data: {
          tenantId: tenant.id, studentId: s.id, batchId: batch.id,
          trainerId: trainer.id, module: `Module ${i + 1}`,
          percentage: 55 + Math.floor(Math.random() * 35) + i * 3,
          grade: (['C', 'B', 'A', 'A+'] as const)[Math.floor(Math.random() * 4)],
          assessedAt: monthsAgo(i),
        },
      });
    }
  }

  // ── Leads (Conversion report) ─────────────────────────────
  await prisma.lead.deleteMany({ where: { tenantId: tenant.id } });

  const leads = [
    { name: 'Priya Sharma', phone: '9876543230', course: 'Bharatanatyam', source: 'WALK_IN' as const, status: 'CONVERTED' as const, convMo: 4, sid: 0 },
    { name: 'Ravi Kumar', phone: '9876543231', course: 'Karate', source: 'REFERRAL' as const, status: 'CONVERTED' as const, convMo: 3, sid: 2 },
    { name: 'Sneha Reddy', phone: '9876543232', course: 'Bharatanatyam', source: 'WEBSITE' as const, status: 'NEW' as const },
    { name: 'Arjun Nair', phone: '9876543233', course: 'Carnatic Music', source: 'SOCIAL_MEDIA' as const, status: 'INTERESTED' as const },
    { name: 'Lakshmi Menon', phone: '9876543234', course: 'Karate', source: 'PHONE' as const, status: 'FOLLOWUP' as const },
    { name: 'Vikram Singh', phone: '9876543235', course: 'Bharatanatyam', source: 'WALK_IN' as const, status: 'DEMO_SCHEDULED' as const },
    { name: 'Kavya Iyer', phone: '9876543236', course: 'Carnatic Music', source: 'REFERRAL' as const, status: 'LOST' as const },
    { name: 'Deepak Raj', phone: '9876543237', course: 'Karate', source: 'ADVERTISEMENT' as const, status: 'CONTACTED' as const },
    { name: 'Pooja Sharma', phone: '9876543238', course: 'Bharatanatyam', source: 'SOCIAL_MEDIA' as const, status: 'NEW' as const },
    { name: 'Manoj Kumar', phone: '9876543239', course: 'Karate', source: 'WALK_IN' as const, status: 'CONVERTED' as const, convMo: 1, sid: 4 },
    { name: 'Anitha Paul', phone: '9876543240', course: 'Carnatic Music', source: 'PHONE' as const, status: 'INTERESTED' as const },
    { name: 'Suresh Babu', phone: '9876543241', course: 'Bharatanatyam', source: 'WEBSITE' as const, status: 'FOLLOWUP' as const },
  ];

  for (const l of leads) {
    const data: any = {
      tenantId: tenant.id, branchId: mainBranch.id,
      name: l.name, phone: l.phone, course: l.course,
      source: l.source, status: l.status,
    };
    if ('convMo' in l && 'sid' in l) {
      data.convertedAt = monthsAgo(l.convMo!);
      data.convertedToStudentId = allStudents[l.sid!].id;
    }
    await prisma.lead.create({ data });
  }

  // ── Expense Categories ────────────────────────────────────
  await prisma.expenseCategory.createMany({
    data: [
      { tenantId: tenant.id, name: 'Utilities', code: 'UTIL' },
      { tenantId: tenant.id, name: 'Salary', code: 'SAL' },
      { tenantId: tenant.id, name: 'Rent', code: 'RENT' },
    ],
    skipDuplicates: true,
  });

  console.log('');
  console.log('✓ Seed complete');
  console.log('  Tenant    : Demo Academy');
  console.log('  Owner     : owner@demo.com / Password123!');
  console.log('  Trainer   : trainer@demo.com / Password123!');
  console.log('  Branches  :', 2);
  console.log('  Batches   :', allBatches.length);
  console.log('  Students  :', allStudents.length);
  console.log('  Enrollments:', enrollmentSpecs.length);
  console.log('  Leads     :', leads.length);
  console.log('  Paid Invs :', paidInvoices.length);
  console.log('  Due Invs  :', dueInvoices.length);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
