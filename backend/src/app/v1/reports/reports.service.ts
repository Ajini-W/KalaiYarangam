import { Injectable } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { PrismaService } from '@/database';
import { AuthenticatedUser } from '@/common/interfaces';
import { ReportQueryDto } from './dto/reports.dto';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  private getTenantFilter(user: AuthenticatedUser) {
    return user.role === UserRole.SUPER_ADMIN ? {} : { tenantId: user.tenantId };
  }

  private getDateFilter(startDate?: string, endDate?: string) {
    const filter: Record<string, Date> = {};
    if (startDate) filter.gte = new Date(startDate);
    if (endDate) filter.lte = new Date(endDate);
    return Object.keys(filter).length ? filter : undefined;
  }

  async revenue(user: AuthenticatedUser, query: ReportQueryDto) {
    const tenantFilter = this.getTenantFilter(user);
    const dateFilter = this.getDateFilter(query.startDate, query.endDate);

    const where: any = { ...tenantFilter, status: 'PAID' };
    if (dateFilter) where.paidAt = dateFilter;

    const [aggregated, statusBreakdown, paidInvoices] = await Promise.all([
      this.prisma.invoice.aggregate({
        where,
        _sum: { totalAmount: true, paidAmount: true },
        _count: true,
      }),
      this.prisma.invoice.groupBy({
        by: ['status'],
        where: { ...tenantFilter, ...(dateFilter ? { paidAt: dateFilter } : {}) },
        _sum: { totalAmount: true },
        _count: true,
      }),
      this.prisma.invoice.findMany({
        where,
        select: { totalAmount: true, paidAt: true },
        orderBy: { paidAt: 'desc' },
      }),
    ]);

    const monthlyMap: Record<string, { revenue: number; invoices: number }> = {};
    for (const inv of paidInvoices) {
      if (!inv.paidAt) continue;
      const month = inv.paidAt.toISOString().slice(0, 7);
      if (!monthlyMap[month]) monthlyMap[month] = { revenue: 0, invoices: 0 };
      monthlyMap[month].revenue += Number(inv.totalAmount);
      monthlyMap[month].invoices++;
    }

    const monthlyTrend = Object.entries(monthlyMap)
      .map(([month, data]) => ({ month, ...data }))
      .sort((a, b) => b.month.localeCompare(a.month))
      .slice(0, 12);

    return {
      message: 'Revenue report retrieved successfully',
      data: {
        totalRevenue: Number(aggregated._sum.totalAmount ?? 0),
        totalPaid: Number(aggregated._sum.paidAmount ?? 0),
        totalInvoices: aggregated._count,
        statusBreakdown: statusBreakdown.map((s) => ({
          status: s.status,
          amount: Number(s._sum.totalAmount ?? 0),
          count: s._count,
        })),
        monthlyTrend,
      },
    };
  }

  async enrollment(user: AuthenticatedUser, query: ReportQueryDto) {
    const tenantFilter = this.getTenantFilter(user);
    const dateFilter = this.getDateFilter(query.startDate, query.endDate);

    const enrollmentWhere: any = { ...tenantFilter };
    if (dateFilter) enrollmentWhere.enrolledAt = dateFilter;
    if (query.batchId) enrollmentWhere.batchId = query.batchId;

    const [totalEnrollments, statusBreakdown, batchBreakdown, enrollments] =
      await Promise.all([
        this.prisma.enrollment.count({ where: enrollmentWhere }),
        this.prisma.enrollment.groupBy({
          by: ['status'],
          where: enrollmentWhere,
          _count: true,
        }),
        this.prisma.enrollment.groupBy({
          by: ['batchId'],
          where: enrollmentWhere,
          _count: true,
          _max: { enrolledAt: true },
        }),
        this.prisma.enrollment.findMany({
          where: enrollmentWhere,
          select: { enrolledAt: true, status: true },
          orderBy: { enrolledAt: 'desc' },
        }),
      ]);

    const monthlyMap: Record<string, { enrollments: number; active: number }> = {};
    for (const e of enrollments) {
      const month = e.enrolledAt.toISOString().slice(0, 7);
      if (!monthlyMap[month]) monthlyMap[month] = { enrollments: 0, active: 0 };
      monthlyMap[month].enrollments++;
      if (e.status === 'ACTIVE') monthlyMap[month].active++;
    }

    const monthlyTrend = Object.entries(monthlyMap)
      .map(([month, data]) => ({ month, ...data }))
      .sort((a, b) => b.month.localeCompare(a.month))
      .slice(0, 12);

    return {
      message: 'Enrollment report retrieved successfully',
      data: {
        totalEnrollments,
        statusBreakdown: statusBreakdown.map((s) => ({
          status: s.status,
          count: s._count,
        })),
        batchBreakdown: batchBreakdown.map((b) => ({
          batchId: b.batchId,
          count: b._count,
        })),
        monthlyTrend,
      },
    };
  }

  async attendance(user: AuthenticatedUser, query: ReportQueryDto) {
    const tenantFilter = this.getTenantFilter(user);
    const dateFilter = this.getDateFilter(query.startDate, query.endDate);

    const sessionWhere: any = { ...tenantFilter };
    if (dateFilter) sessionWhere.date = dateFilter;

    const sessions = await this.prisma.attendanceSession.findMany({
      where: sessionWhere,
      include: {
        records: true,
      },
    });

    const totalSessions = sessions.length;
    const totalRecords = sessions.reduce((sum, s) => sum + s.records.length, 0);
    const presentRecords = sessions.reduce(
      (sum, s) => sum + s.records.filter((r) => r.status === 'PRESENT' || r.status === 'LATE').length,
      0,
    );
    const absentRecords = sessions.reduce(
      (sum, s) => sum + s.records.filter((r) => r.status === 'ABSENT').length,
      0,
    );
    const excusedRecords = sessions.reduce(
      (sum, s) => sum + s.records.filter((r) => r.status === 'EXCUSED').length,
      0,
    );

    const attendanceRate = totalRecords > 0
      ? Math.round((presentRecords / totalRecords) * 100)
      : 0;

    const attWhere: any = {
      session: { ...tenantFilter, ...(dateFilter ? { date: dateFilter } : {}) },
    };

    const statusBreakdown = await this.prisma.studentAttendance.groupBy({
      by: ['status'],
      where: attWhere,
      _count: true,
    });

    return {
      message: 'Attendance report retrieved successfully',
      data: {
        totalSessions,
        totalRecords,
        presentRecords,
        absentRecords,
        excusedRecords,
        attendanceRate,
        statusBreakdown: statusBreakdown.map((s) => ({
          status: s.status,
          count: s._count,
        })),
      },
    };
  }

  async paymentDue(user: AuthenticatedUser, query: ReportQueryDto) {
    const tenantFilter = this.getTenantFilter(user);

    const where: any = {
      ...tenantFilter,
      status: { in: ['SENT', 'OVERDUE', 'PARTIALLY_PAID'] },
    };

    const [invoices, aggregation] = await Promise.all([
      this.prisma.invoice.findMany({
        where,
        include: {
          student: { select: { id: true, name: true, phone: true, email: true } },
          branch: { select: { id: true, name: true } },
        },
        orderBy: { dueDate: 'asc' },
      }),
      this.prisma.invoice.aggregate({
        where,
        _sum: { totalAmount: true, paidAmount: true },
        _count: true,
      }),
    ]);

    const totalDue = Number(aggregation._sum.totalAmount ?? 0);
    const totalPaid = Number(aggregation._sum.paidAmount ?? 0);
    const pendingAmount = totalDue - totalPaid;

    return {
      message: 'Payment due report retrieved successfully',
      data: {
        totalDue,
        totalPaid,
        pendingAmount,
        totalInvoices: aggregation._count,
        invoices: invoices.map((inv) => ({
          id: inv.id,
          invoiceNumber: inv.invoiceNumber,
          totalAmount: Number(inv.totalAmount),
          paidAmount: Number(inv.paidAmount),
          dueAmount: Number(inv.totalAmount) - Number(inv.paidAmount),
          dueDate: inv.dueDate,
          status: inv.status,
          student: inv.student,
          branch: inv.branch,
        })),
      },
    };
  }

  async conversion(user: AuthenticatedUser, query: ReportQueryDto) {
    const tenantFilter = this.getTenantFilter(user);
    const dateFilter = this.getDateFilter(query.startDate, query.endDate);

    const leadWhere: any = { ...tenantFilter };
    if (dateFilter) leadWhere.createdAt = dateFilter;

    const [totalLeads, statusBreakdown, sourceBreakdown, leads] =
      await Promise.all([
        this.prisma.lead.count({ where: leadWhere }),
        this.prisma.lead.groupBy({
          by: ['status'],
          where: leadWhere,
          _count: true,
        }),
        this.prisma.lead.groupBy({
          by: ['source'],
          where: leadWhere,
          _count: true,
        }),
        this.prisma.lead.findMany({
          where: leadWhere,
          select: { createdAt: true, status: true },
          orderBy: { createdAt: 'desc' },
        }),
      ]);

    const monthlyMap: Record<string, { leads: number; converted: number }> = {};
    for (const l of leads) {
      const month = l.createdAt.toISOString().slice(0, 7);
      if (!monthlyMap[month]) monthlyMap[month] = { leads: 0, converted: 0 };
      monthlyMap[month].leads++;
      if (l.status === 'CONVERTED') monthlyMap[month].converted++;
    }

    const monthlyTrend = Object.entries(monthlyMap)
      .map(([month, data]) => ({ month, ...data }))
      .sort((a, b) => b.month.localeCompare(a.month))
      .slice(0, 12);

    const converted = statusBreakdown.find((s) => s.status === 'CONVERTED')?._count ?? 0;
    const conversionRate = totalLeads > 0
      ? Math.round((converted / totalLeads) * 100)
      : 0;

    return {
      message: 'Conversion report retrieved successfully',
      data: {
        totalLeads,
        convertedLeads: converted,
        conversionRate,
        statusBreakdown: statusBreakdown.map((s) => ({
          status: s.status,
          count: s._count,
        })),
        sourceBreakdown: sourceBreakdown.map((s) => ({
          source: s.source,
          count: s._count,
        })),
        monthlyTrend,
      },
    };
  }

  async trainerPerformance(user: AuthenticatedUser, query: ReportQueryDto) {
    const tenantFilter = this.getTenantFilter(user);
    const dateFilter = this.getDateFilter(query.startDate, query.endDate);

    const trainers = await this.prisma.user.findMany({
      where: {
        role: UserRole.TRAINER,
        ...tenantFilter,
      },
      select: {
        id: true,
        name: true,
        email: true,
        batchTrainers: {
          include: {
            batch: {
              select: { id: true, name: true, enrolled: true, capacity: true, status: true },
            },
          },
        },
      },
    });

    const performance = await Promise.all(
      trainers.map(async (trainer) => {
        const batchIds = trainer.batchTrainers.map((bt) => bt.batch.id);

        const [totalStudents, averageProgress, totalSessions] = await Promise.all([
          this.prisma.enrollment.count({
            where: {
              batchId: { in: batchIds },
              status: 'ACTIVE',
              ...tenantFilter,
            },
          }),
          this.prisma.studentProgress.aggregate({
            where: {
              trainerId: trainer.id,
              ...(dateFilter ? { assessedAt: dateFilter } : {}),
              ...tenantFilter,
            },
            _avg: { percentage: true },
          }),
          this.prisma.attendanceSession.count({
            where: {
              batchId: { in: batchIds },
              ...(dateFilter ? { date: dateFilter } : {}),
              ...tenantFilter,
            },
          }),
        ]);

        const batches = trainer.batchTrainers.map((bt) => ({
          id: bt.batch.id,
          name: bt.batch.name,
          enrolled: bt.batch.enrolled,
          capacity: bt.batch.capacity,
          status: bt.batch.status,
          utilization: bt.batch.capacity > 0
            ? Math.round((bt.batch.enrolled / bt.batch.capacity) * 100)
            : 0,
        }));

        return {
          trainerId: trainer.id,
          name: trainer.name,
          email: trainer.email,
          totalBatches: trainer.batchTrainers.length,
          totalStudents,
          averageProgress: Math.round(averageProgress._avg.percentage ?? 0),
          totalSessions,
          batches,
        };
      }),
    );

    return {
      message: 'Trainer performance report retrieved successfully',
      data: performance,
    };
  }

  async studentProgress(user: AuthenticatedUser, query: ReportQueryDto) {
    const tenantFilter = this.getTenantFilter(user);

    const where: any = { ...tenantFilter };
    if (query.batchId) where.batchId = query.batchId;

    const [progressRecords, gradeDistribution, batchAverages] = await Promise.all([
      this.prisma.studentProgress.findMany({
        where,
        include: {
          student: { select: { id: true, name: true, phone: true } },
          batch: { select: { id: true, name: true } },
        },
        orderBy: { assessedAt: 'desc' },
        take: 500,
      }),
      this.prisma.studentProgress.groupBy({
        by: ['grade'],
        where: { ...where, grade: { not: null } },
        _count: true,
        _avg: { percentage: true },
      }),
      this.prisma.studentProgress.groupBy({
        by: ['batchId'],
        where,
        _avg: { percentage: true },
        _count: true,
      }),
    ]);

    const totalRecords = progressRecords.length;
    const avgPercentage =
      totalRecords > 0
        ? Math.round(
            progressRecords.reduce((sum, r) => sum + r.percentage, 0) / totalRecords,
          )
        : 0;

    const rangeBreakdown = [
      { range: '90-100%', count: 0 },
      { range: '75-89%', count: 0 },
      { range: '50-74%', count: 0 },
      { range: '0-49%', count: 0 },
    ];

    for (const r of progressRecords) {
      if (r.percentage >= 90) rangeBreakdown[0].count++;
      else if (r.percentage >= 75) rangeBreakdown[1].count++;
      else if (r.percentage >= 50) rangeBreakdown[2].count++;
      else rangeBreakdown[3].count++;
    }

    return {
      message: 'Student progress report retrieved successfully',
      data: {
        totalRecords,
        averagePercentage: avgPercentage,
        gradeDistribution: gradeDistribution.map((g) => ({
          grade: g.grade,
          count: g._count,
          averagePercentage: Math.round(g._avg.percentage ?? 0),
        })),
        rangeBreakdown,
        batchAverages: batchAverages.map((b) => ({
          batchId: b.batchId,
          averagePercentage: Math.round(b._avg.percentage ?? 0),
          studentCount: b._count,
        })),
        recentRecords: progressRecords.slice(0, 50).map((r) => ({
          id: r.id,
          student: r.student,
          batch: r.batch,
          percentage: r.percentage,
          grade: r.grade,
          module: r.module,
          assessedAt: r.assessedAt,
        })),
      },
    };
  }

  async batchUtilization(user: AuthenticatedUser, query: ReportQueryDto) {
    const tenantFilter = this.getTenantFilter(user);

    const where: any = { ...tenantFilter, isActive: true };
    if (query.branchId) where.branchId = query.branchId;

    const [batches, branchStats] = await Promise.all([
      this.prisma.batch.findMany({
        where,
        include: {
          branch: { select: { id: true, name: true } },
          course: { select: { id: true, name: true } },
          _count: { select: { enrollments: true, sessions: true, trainers: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.batch.groupBy({
        by: ['branchId'],
        where,
        _avg: { enrolled: true, capacity: true },
        _sum: { enrolled: true, capacity: true },
        _count: true,
      }),
    ]);

    const totalCapacity = batches.reduce((sum, b) => sum + b.capacity, 0);
    const totalEnrolled = batches.reduce((sum, b) => sum + b.enrolled, 0);
    const overallUtilization =
      totalCapacity > 0 ? Math.round((totalEnrolled / totalCapacity) * 100) : 0;

    return {
      message: 'Batch utilization report retrieved successfully',
      data: {
        totalBatches: batches.length,
        totalCapacity,
        totalEnrolled,
        overallUtilization,
        branchBreakdown: branchStats.map((b) => ({
          branchId: b.branchId,
          batchCount: b._count,
          totalCapacity: b._sum.capacity ?? 0,
          totalEnrolled: b._sum.enrolled ?? 0,
          utilization:
            (b._sum.capacity ?? 0) > 0
              ? Math.round(((b._sum.enrolled ?? 0) / (b._sum.capacity ?? 1)) * 100)
              : 0,
        })),
        batches: batches.map((b) => ({
          id: b.id,
          name: b.name,
          code: b.code,
          branch: b.branch,
          course: b.course,
          capacity: b.capacity,
          enrolled: b.enrolled,
          utilization:
            b.capacity > 0 ? Math.round((b.enrolled / b.capacity) * 100) : 0,
          status: b.status,
          enrollments: b._count.enrollments,
          sessions: b._count.sessions,
          trainers: b._count.trainers,
        })),
      },
    };
  }

  async revenueExport(user: AuthenticatedUser, query: ReportQueryDto) {
    const tenantFilter = this.getTenantFilter(user);
    const dateFilter = this.getDateFilter(query.startDate, query.endDate);

    const where: any = { ...tenantFilter, status: 'PAID' };
    if (dateFilter) where.paidAt = dateFilter;

    const invoices = await this.prisma.invoice.findMany({
      where,
      include: {
        student: { select: { id: true, name: true, phone: true } },
        branch: { select: { id: true, name: true } },
      },
      orderBy: { paidAt: 'desc' },
    });

    return {
      message: 'Revenue export data retrieved successfully',
      data: invoices.map((inv) => ({
        invoiceNumber: inv.invoiceNumber,
        studentName: inv.student?.name ?? '',
        studentPhone: inv.student?.phone ?? '',
        branch: inv.branch?.name ?? '',
        totalAmount: Number(inv.totalAmount),
        paidAmount: Number(inv.paidAmount),
        status: inv.status,
        issueDate: inv.issueDate,
        dueDate: inv.dueDate,
        paidAt: inv.paidAt,
      })),
    };
  }

  async attendanceExport(user: AuthenticatedUser, query: ReportQueryDto) {
    const tenantFilter = this.getTenantFilter(user);
    const dateFilter = this.getDateFilter(query.startDate, query.endDate);

    const sessionWhere: any = { ...tenantFilter };
    if (dateFilter) sessionWhere.date = dateFilter;

    const sessions = await this.prisma.attendanceSession.findMany({
      where: sessionWhere,
      include: {
        records: {
          include: {
            student: { select: { id: true, name: true, phone: true } },
          },
        },
        classSession: {
          include: {
            batch: { select: { id: true, name: true } },
          },
        },
      },
      orderBy: { date: 'desc' },
      take: 1000,
    });

    const records: Array<Record<string, unknown>> = [];
    for (const session of sessions) {
      for (const record of session.records) {
        records.push({
          date: session.date,
          batchName: session.classSession?.batch?.name ?? '',
          studentName: record.student.name,
          studentPhone: record.student.phone,
          status: record.status,
          remarks: record.remarks,
          checkInTime: record.checkInTime,
        });
      }
    }

    return {
      message: 'Attendance export data retrieved successfully',
      data: records,
    };
  }

  async enrollmentExport(user: AuthenticatedUser, query: ReportQueryDto) {
    const tenantFilter = this.getTenantFilter(user);
    const dateFilter = this.getDateFilter(query.startDate, query.endDate);

    const where: any = { ...tenantFilter };
    if (dateFilter) where.enrolledAt = dateFilter;
    if (query.batchId) where.batchId = query.batchId;

    const enrollments = await this.prisma.enrollment.findMany({
      where,
      include: {
        student: { select: { id: true, name: true, phone: true, email: true } },
        batch: { select: { id: true, name: true, code: true } },
        feePlan: { select: { id: true, name: true, totalAmount: true } },
      },
      orderBy: { enrolledAt: 'desc' },
      take: 1000,
    });

    return {
      message: 'Enrollment export data retrieved successfully',
      data: enrollments.map((e) => ({
        studentName: e.student.name,
        studentPhone: e.student.phone,
        studentEmail: e.student.email ?? '',
        batchName: e.batch.name,
        batchCode: e.batch.code ?? '',
        feePlan: e.feePlan?.name ?? '',
        feeAmount: e.feePlan ? Number(e.feePlan.totalAmount) : 0,
        status: e.status,
        enrolledAt: e.enrolledAt,
        completedAt: e.completedAt,
      })),
    };
  }

  async progressExport(user: AuthenticatedUser, query: ReportQueryDto) {
    const tenantFilter = this.getTenantFilter(user);

    const where: any = { ...tenantFilter };
    if (query.batchId) where.batchId = query.batchId;
    if (query.trainerId) where.trainerId = query.trainerId;

    const progressRecords = await this.prisma.studentProgress.findMany({
      where,
      include: {
        student: { select: { id: true, name: true, phone: true } },
        batch: { select: { id: true, name: true } },
        trainer: { select: { id: true, name: true } },
      },
      orderBy: { assessedAt: 'desc' },
      take: 1000,
    });

    return {
      message: 'Progress export data retrieved successfully',
      data: progressRecords.map((p) => ({
        studentName: p.student.name,
        studentPhone: p.student.phone,
        batchName: p.batch?.name ?? '',
        trainerName: p.trainer?.name ?? '',
        module: p.module ?? '',
        percentage: p.percentage,
        grade: p.grade ?? '',
        remarks: p.remarks ?? '',
        assessedAt: p.assessedAt,
      })),
    };
  }
}
