import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/database';
import { AuthenticatedUser } from '@/common/interfaces';
import { paginate, paginationArgs } from '@/common/utils';
import { AttendanceSummaryDto, BulkMarkAttendanceDto, CreateAttendanceDto, QueryAttendanceDto, UpdateAttendanceDto } from './dto/attendance.dto';

@Injectable()
export class AttendanceService {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: AuthenticatedUser, dto: CreateAttendanceDto) {
    if (!user.tenantId) {
      throw new NotFoundException('Tenant not found');
    }

    const batch = await this.prisma.batch.findFirst({
      where: { id: dto.batchId, tenantId: user.tenantId },
    });
    if (!batch) {
      throw new NotFoundException('Batch not found');
    }

    if (dto.classSessionId) {
      const session = await this.prisma.classSession.findFirst({
        where: { id: dto.classSessionId, batch: { tenantId: user.tenantId } },
      });
      if (!session) {
        throw new NotFoundException('Class session not found');
      }
    }

    const result = await this.prisma.$transaction(async (tx) => {
      const attendanceSession = await tx.attendanceSession.create({
        data: {
          tenantId: user.tenantId,
          batchId: dto.batchId,
          classSessionId: dto.classSessionId,
          date: dto.date,
          markedBy: user.id,
          records: {
            create: dto.records.map((r) => ({
              studentId: r.studentId,
              status: r.status,
              remarks: r.remarks,
              checkInTime: r.checkInTime,
            })),
          },
        },
        include: { records: true },
      });

      return attendanceSession;
    });

    return { message: 'Attendance marked successfully', data: result };
  }

  async findAll(user: AuthenticatedUser, query: QueryAttendanceDto) {
    if (!user.tenantId) {
      throw new NotFoundException('Tenant not found');
    }

    const { skip, take, page, pageSize } = paginationArgs(query.page, query.pageSize);

    const where: Record<string, unknown> = { tenantId: user.tenantId };

    if (query.batchId) where.batchId = query.batchId;
    if (query.classSessionId) where.classSessionId = query.classSessionId;
    if (query.dateFrom || query.dateTo) {
      where.date = {};
      if (query.dateFrom) (where.date as Record<string, Date>).gte = query.dateFrom;
      if (query.dateTo) (where.date as Record<string, Date>).lte = query.dateTo;
    }

    const [data, total] = await Promise.all([
      this.prisma.attendanceSession.findMany({
        where,
        skip,
        take,
        orderBy: { date: 'desc' },
        include: { _count: { select: { records: true } } },
      }),
      this.prisma.attendanceSession.count({ where }),
    ]);

    return paginate(data, total, page, pageSize);
  }

  async findOne(user: AuthenticatedUser, id: string) {
    if (!user.tenantId) {
      throw new NotFoundException('Tenant not found');
    }

    const session = await this.prisma.attendanceSession.findFirst({
      where: { id, tenantId: user.tenantId },
      include: {
        records: {
          include: {
            student: { select: { id: true, name: true, phone: true, email: true } },
          },
        },
      },
    });

    if (!session) {
      throw new NotFoundException('Attendance session not found');
    }

    return { message: 'Attendance session retrieved successfully', data: session };
  }

  async update(user: AuthenticatedUser, id: string, dto: UpdateAttendanceDto) {
    if (!user.tenantId) {
      throw new NotFoundException('Tenant not found');
    }

    const session = await this.prisma.attendanceSession.findFirst({
      where: { id, tenantId: user.tenantId },
    });
    if (!session) {
      throw new NotFoundException('Attendance session not found');
    }

    await this.prisma.$transaction(
      dto.records.map((r) =>
        this.prisma.studentAttendance.upsert({
          where: {
            attendanceSessionId_studentId: {
              attendanceSessionId: id,
              studentId: r.studentId,
            },
          },
          create: {
            attendanceSessionId: id,
            studentId: r.studentId,
            status: r.status,
            remarks: r.remarks,
            checkInTime: r.checkInTime,
          },
          update: {
            status: r.status,
            remarks: r.remarks,
            checkInTime: r.checkInTime,
          },
        }),
      ),
    );

    const updated = await this.prisma.attendanceSession.findUnique({
      where: { id },
      include: { records: true },
    });

    return { message: 'Attendance updated successfully', data: updated };
  }

  async bulkMark(user: AuthenticatedUser, dto: BulkMarkAttendanceDto) {
    if (!user.tenantId) {
      throw new NotFoundException('Tenant not found');
    }

    const batch = await this.prisma.batch.findFirst({
      where: { id: dto.batchId, tenantId: user.tenantId },
    });
    if (!batch) {
      throw new NotFoundException('Batch not found');
    }

    if (dto.classSessionId) {
      const session = await this.prisma.classSession.findFirst({
        where: { id: dto.classSessionId, batch: { tenantId: user.tenantId } },
      });
      if (!session) {
        throw new NotFoundException('Class session not found');
      }
    }

    const enrollments = await this.prisma.enrollment.findMany({
      where: { batchId: dto.batchId, status: 'ACTIVE' },
      include: { student: true },
    });

    if (enrollments.length === 0) {
      throw new BadRequestException('No active students in this batch');
    }

    const result = await this.prisma.$transaction(async (tx) => {
      let session = dto.classSessionId
        ? await tx.attendanceSession.findUnique({ where: { classSessionId: dto.classSessionId } })
        : null;

      if (!session) {
        session = await tx.attendanceSession.create({
          data: {
            tenantId: user.tenantId,
            batchId: dto.batchId,
            classSessionId: dto.classSessionId ?? null,
            date: dto.date,
            markedBy: user.id,
          },
        });
      }

      const exceptionMap = new Map(
        (dto.exceptions ?? []).map((e) => [e.studentId, { status: e.status, remarks: e.remarks } as const]),
      );

      for (const enrollment of enrollments) {
        const exception = exceptionMap.get(enrollment.studentId);
        const status = exception ? exception.status : dto.defaultStatus;
        const remarks = exception ? exception.remarks : undefined;

        await tx.studentAttendance.upsert({
          where: {
            attendanceSessionId_studentId: {
              attendanceSessionId: session.id,
              studentId: enrollment.studentId,
            },
          },
          create: {
            attendanceSessionId: session.id,
            studentId: enrollment.studentId,
            status,
            remarks,
          },
          update: {
            status,
            remarks,
          },
        });
      }

      return tx.attendanceSession.findUnique({
        where: { id: session.id },
        include: {
          records: {
            include: {
              student: { select: { id: true, name: true, phone: true } },
            },
          },
        },
      });
    });

    return { message: 'Bulk attendance marked successfully', data: result };
  }

  async summary(user: AuthenticatedUser, query: AttendanceSummaryDto) {
    if (!user.tenantId) {
      throw new NotFoundException('Tenant not found');
    }

    const sessionWhere: Record<string, unknown> = { tenantId: user.tenantId };

    if (query.batchId) sessionWhere.batchId = query.batchId;
    if (query.dateFrom || query.dateTo) {
      sessionWhere.date = {};
      if (query.dateFrom) (sessionWhere.date as Record<string, Date>).gte = query.dateFrom;
      if (query.dateTo) (sessionWhere.date as Record<string, Date>).lte = query.dateTo;
    }

    const sessions = await this.prisma.attendanceSession.findMany({
      where: sessionWhere,
      select: { id: true },
    });

    const sessionIds = sessions.map((s) => s.id);

    if (sessionIds.length === 0) {
      return {
        message: 'Attendance summary retrieved successfully',
        data: { totalSessions: 0, totalRecords: 0, present: 0, absent: 0, late: 0, excused: 0 },
      };
    }

    const recordWhere: Record<string, unknown> = {
      attendanceSessionId: { in: sessionIds },
    };

    if (query.studentId) {
      recordWhere.studentId = query.studentId;
    }

    const statusCounts = await this.prisma.studentAttendance.groupBy({
      by: ['status'],
      where: recordWhere,
      _count: true,
    });

    const summary = {
      totalSessions: sessionIds.length,
      totalRecords: 0,
      present: 0,
      absent: 0,
      late: 0,
      excused: 0,
    };

    for (const sc of statusCounts) {
      summary.totalRecords += sc._count;
      if (sc.status === 'PRESENT') summary.present = sc._count;
      else if (sc.status === 'ABSENT') summary.absent = sc._count;
      else if (sc.status === 'LATE') summary.late = sc._count;
      else if (sc.status === 'EXCUSED') summary.excused = sc._count;
    }

    return { message: 'Attendance summary retrieved successfully', data: summary };
  }
}
