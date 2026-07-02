import { Injectable } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { PrismaService } from '@/database';
import { AuthenticatedUser } from '@/common/interfaces';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async summary(user: AuthenticatedUser) {
    const isSuperAdmin = user.role === UserRole.SUPER_ADMIN;
    const tenantFilter = isSuperAdmin ? {} : { tenantId: user.tenantId };

    const [
      totalStudents,
      activeBranches,
      revenueMTD,
      pendingPayments,
      activeBatches,
      totalEnrollments,
    ] = await Promise.all([
      this.prisma.student.count({ where: { ...tenantFilter, isActive: true } }),
      isSuperAdmin
        ? this.prisma.branch.count({ where: { isActive: true } })
        : this.prisma.branch.count({ where: { ...tenantFilter, isActive: true } }),
      this.monthlyRevenue(user),
      this.prisma.invoice.count({
        where: { ...tenantFilter, status: { in: ['SENT', 'OVERDUE', 'PARTIALLY_PAID'] } },
      }),
      this.prisma.batch.count({ where: { ...tenantFilter, status: 'ACTIVE' } }),
      this.prisma.enrollment.count({ where: { ...tenantFilter, status: 'ACTIVE' } }),
    ]);

    return {
      totalStudents,
      activeBranches,
      revenueMTD: revenueMTD ?? 0,
      pendingPayments,
      activeBatches,
      totalEnrollments,
    };
  }

  async metrics(user: AuthenticatedUser) {
    const isSuperAdmin = user.role === UserRole.SUPER_ADMIN;
    const tenantFilter = isSuperAdmin ? {} : { tenantId: user.tenantId };

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - 7);

    const [
      newStudentsThisMonth,
      totalLeads,
      newLeadsThisMonth,
      convertedLeads,
      totalAttendance,
      presentAttendance,
      batchCapacity,
    ] = await Promise.all([
      this.prisma.student.count({
        where: { ...tenantFilter, joinedAt: { gte: startOfMonth } },
      }),
      this.prisma.lead.count({ where: tenantFilter }),
      this.prisma.lead.count({
        where: { ...tenantFilter, createdAt: { gte: startOfMonth } },
      }),
      this.prisma.lead.count({
        where: { ...tenantFilter, status: 'CONVERTED', convertedAt: { gte: startOfMonth } },
      }),
      this.prisma.studentAttendance.count({
        where: {
          session: {
            date: { gte: startOfWeek },
            ...(isSuperAdmin ? {} : { tenantId: user.tenantId }),
          },
        },
      }),
      this.prisma.studentAttendance.count({
        where: {
          status: { in: ['PRESENT', 'LATE'] },
          session: {
            date: { gte: startOfWeek },
            ...(isSuperAdmin ? {} : { tenantId: user.tenantId }),
          },
        },
      }),
      this.prisma.batch.aggregate({
        where: { ...tenantFilter, status: 'ACTIVE' },
        _sum: { capacity: true },
        _avg: { enrolled: true },
      }),
    ]);

    const attendanceRate = totalAttendance > 0 ? Math.round((presentAttendance / totalAttendance) * 100) : 0;
    const conversionRate = totalLeads > 0 ? Math.round((convertedLeads / totalLeads) * 100) : 0;

    return {
      newStudentsThisMonth,
      totalLeads,
      newLeadsThisMonth,
      convertedLeads,
      conversionRate,
      attendanceRate,
      totalAttendanceRecords: totalAttendance,
      avgBatchUtilization: batchCapacity._avg?.enrolled
        ? Math.round((batchCapacity._avg.enrolled / (batchCapacity._sum?.capacity ?? 1)) * 100)
        : 0,
    };
  }

  async upcoming(user: AuthenticatedUser) {
    const isSuperAdmin = user.role === UserRole.SUPER_ADMIN;
    const tenantFilter = isSuperAdmin ? {} : { tenantId: user.tenantId };

    const now = new Date();
    const weekEnd = new Date(now);
    weekEnd.setDate(now.getDate() + 7);

    const [sessions, tasks, followups] = await Promise.all([
      this.prisma.classSession.findMany({
        where: {
          date: { gte: now, lte: weekEnd },
          batch: tenantFilter,
        },
        include: {
          batch: { select: { id: true, name: true } },
          attendanceSession: { select: { id: true } },
        },
        orderBy: { date: 'asc' },
        take: 10,
      }),
      this.prisma.task.findMany({
        where: {
          dueDate: { gte: now, lte: weekEnd },
          status: { in: ['PENDING', 'ACTIVE'] },
          ...tenantFilter,
        },
        include: {
          batch: { select: { id: true, name: true } },
        },
        orderBy: { dueDate: 'asc' },
        take: 10,
      }),
      this.prisma.lead.findMany({
        where: {
          nextFollowUp: { gte: now, lte: weekEnd },
          ...tenantFilter,
        },
        select: {
          id: true,
          name: true,
          phone: true,
          course: true,
          status: true,
          nextFollowUp: true,
        },
        orderBy: { nextFollowUp: 'asc' },
        take: 10,
      }),
    ]);

    return { sessions, tasks, followups };
  }

  async alerts(user: AuthenticatedUser) {
    const isSuperAdmin = user.role === UserRole.SUPER_ADMIN;
    const tenantFilter = isSuperAdmin ? {} : { tenantId: user.tenantId };

    const now = new Date();
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() - 7);

    const [
      overdueInvoices,
      pendingFollowups,
      overdueTasks,
    ] = await Promise.all([
      this.prisma.invoice.findMany({
        where: {
          ...tenantFilter,
          status: { in: ['OVERDUE', 'SENT'] },
          dueDate: { lt: now },
        },
        include: {
          student: { select: { id: true, name: true, phone: true } },
        },
        orderBy: { dueDate: 'asc' },
        take: 10,
      }),
      this.prisma.lead.findMany({
        where: {
          ...tenantFilter,
          status: { notIn: ['CONVERTED', 'LOST'] },
          OR: [
            { nextFollowUp: { lte: now } },
            { nextFollowUp: null, createdAt: { lte: sevenDaysAgo } },
          ],
        },
        select: {
          id: true,
          name: true,
          phone: true,
          course: true,
          status: true,
          nextFollowUp: true,
          createdAt: true,
        },
        orderBy: { nextFollowUp: 'asc' },
        take: 10,
      }),
      this.prisma.task.findMany({
        where: {
          ...tenantFilter,
          dueDate: { lt: now },
          status: { in: ['PENDING', 'ACTIVE'] },
        },
        include: {
          batch: { select: { id: true, name: true } },
        },
        orderBy: { dueDate: 'asc' },
        take: 10,
      }),
    ]);

    return {
      overdueInvoices: overdueInvoices.map((inv) => ({
        id: inv.id,
        invoiceNumber: inv.invoiceNumber,
        totalAmount: inv.totalAmount,
        paidAmount: inv.paidAmount,
        dueDate: inv.dueDate,
        student: inv.student,
        status: inv.status,
      })),
      pendingFollowups,
      overdueTasks,
    };
  }

  private async monthlyRevenue(user: AuthenticatedUser) {
    const isSuperAdmin = user.role === UserRole.SUPER_ADMIN;
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const result = await this.prisma.invoice.aggregate({
      where: {
        ...(isSuperAdmin ? {} : { tenantId: user.tenantId }),
        status: 'PAID',
        paidAt: { gte: startOfMonth },
      },
      _sum: { totalAmount: true },
    });

    return Number(result._sum.totalAmount ?? 0);
  }
}
