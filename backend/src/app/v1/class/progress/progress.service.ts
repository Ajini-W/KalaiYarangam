import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/database';
import { AuthenticatedUser } from '@/common/interfaces';
import { paginate, paginationArgs } from '@/common/utils';
import { CreateProgressDto, ProgressSummaryDto, QueryProgressDto, RecalculateProgressDto, UpdateProgressDto } from './dto/progress.dto';

@Injectable()
export class ProgressService {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: AuthenticatedUser, dto: CreateProgressDto) {
    if (!user.tenantId) {
      throw new NotFoundException('Tenant not found');
    }

    const student = await this.prisma.student.findFirst({
      where: { id: dto.studentId, tenantId: user.tenantId },
    });
    if (!student) {
      throw new NotFoundException('Student not found');
    }

    if (dto.batchId) {
      const batch = await this.prisma.batch.findFirst({
        where: { id: dto.batchId, tenantId: user.tenantId },
      });
      if (!batch) {
        throw new NotFoundException('Batch not found');
      }
    }

    const progress = await this.prisma.studentProgress.create({
      data: {
        tenantId: user.tenantId,
        studentId: dto.studentId,
        batchId: dto.batchId,
        module: dto.module,
        percentage: dto.percentage,
        grade: dto.grade,
        remarks: dto.remarks,
        trainerId: user.id,
      },
    });

    return { message: 'Progress record created successfully', data: progress };
  }

  async findAll(user: AuthenticatedUser, query: QueryProgressDto) {
    if (!user.tenantId) {
      throw new NotFoundException('Tenant not found');
    }

    const { skip, take, page, pageSize } = paginationArgs(query.page, query.pageSize);

    const where: Record<string, unknown> = { tenantId: user.tenantId };

    if (query.studentId) where.studentId = query.studentId;
    if (query.batchId) where.batchId = query.batchId;

    const [data, total] = await Promise.all([
      this.prisma.studentProgress.findMany({
        where,
        skip,
        take,
        orderBy: { assessedAt: 'desc' },
        include: {
          student: { select: { id: true, name: true, phone: true } },
        },
      }),
      this.prisma.studentProgress.count({ where }),
    ]);

    return paginate(data, total, page, pageSize);
  }

  async findOne(user: AuthenticatedUser, id: string) {
    if (!user.tenantId) {
      throw new NotFoundException('Tenant not found');
    }

    const progress = await this.prisma.studentProgress.findFirst({
      where: { id, tenantId: user.tenantId },
      include: {
        student: { select: { id: true, name: true, phone: true, email: true } },
        batch: { select: { id: true, name: true } },
      },
    });
    if (!progress) {
      throw new NotFoundException('Progress record not found');
    }

    return { message: 'Progress record retrieved successfully', data: progress };
  }

  async update(user: AuthenticatedUser, id: string, dto: UpdateProgressDto) {
    if (!user.tenantId) {
      throw new NotFoundException('Tenant not found');
    }

    const progress = await this.prisma.studentProgress.findFirst({
      where: { id, tenantId: user.tenantId },
    });
    if (!progress) {
      throw new NotFoundException('Progress record not found');
    }

    const updated = await this.prisma.studentProgress.update({
      where: { id },
      data: {
        ...(dto.module !== undefined && { module: dto.module }),
        ...(dto.percentage !== undefined && { percentage: dto.percentage }),
        ...(dto.grade !== undefined && { grade: dto.grade }),
        ...(dto.remarks !== undefined && { remarks: dto.remarks }),
        trainerId: user.id,
        assessedAt: new Date(),
      },
    });

    return { message: 'Progress record updated successfully', data: updated };
  }

  async summary(user: AuthenticatedUser, query: ProgressSummaryDto) {
    if (!user.tenantId) {
      throw new NotFoundException('Tenant not found');
    }

    const where: Record<string, unknown> = { tenantId: user.tenantId };

    if (query.studentId) where.studentId = query.studentId;
    if (query.batchId) where.batchId = query.batchId;

    const aggregate = await this.prisma.studentProgress.aggregate({
      where,
      _count: true,
      _avg: { percentage: true },
      _min: { percentage: true },
      _max: { percentage: true },
    });

    const data = {
      totalRecords: aggregate._count,
      averagePercentage: aggregate._avg.percentage ?? 0,
      minPercentage: aggregate._min.percentage ?? 0,
      maxPercentage: aggregate._max.percentage ?? 0,
    };

    return { message: 'Progress summary retrieved successfully', data };
  }

  async recalculate(user: AuthenticatedUser, dto: RecalculateProgressDto) {
    if (!user.tenantId) {
      throw new NotFoundException('Tenant not found');
    }

    const enrollmentWhere: Record<string, unknown> = {
      tenantId: user.tenantId,
      status: 'ACTIVE',
    };

    if (dto.studentId) enrollmentWhere.studentId = dto.studentId;
    if (dto.batchId) enrollmentWhere.batchId = dto.batchId;

    const enrollments = await this.prisma.enrollment.findMany({
      where: enrollmentWhere,
      select: { studentId: true, batchId: true },
    });

    if (enrollments.length === 0) {
      throw new BadRequestException('No active enrollments found for recalculation');
    }

    const results: Record<string, unknown>[] = [];

    for (const enrollment of enrollments) {
      const sessionIds = await this.prisma.attendanceSession
        .findMany({
          where: { tenantId: user.tenantId, batchId: enrollment.batchId },
          select: { id: true },
        })
        .then((s) => s.map((s) => s.id));

      const totalSessions = sessionIds.length;
      let attendanceRate: number;

      if (totalSessions === 0) {
        attendanceRate = 100;
      } else {
        const records = await this.prisma.studentAttendance.findMany({
          where: {
            attendanceSessionId: { in: sessionIds },
            studentId: enrollment.studentId,
          },
          select: { status: true },
        });
        const presentCount = records.filter((r) => r.status === 'PRESENT').length;
        attendanceRate = (presentCount / totalSessions) * 100;
      }

      const tasks = await this.prisma.task.findMany({
        where: {
          batchId: enrollment.batchId,
          status: { in: ['ACTIVE', 'SUBMISSION_CLOSED'] },
        },
        select: { id: true, maxScore: true },
      });
      const taskIds = tasks.map((t) => t.id);
      const totalTasks = taskIds.length;
      let taskAverage: number;

      if (totalTasks === 0) {
        taskAverage = 100;
      } else {
        const submissions = await this.prisma.studentTaskSubmission.findMany({
          where: {
            taskId: { in: taskIds },
            studentId: enrollment.studentId,
            status: 'GRADED',
            score: { not: null },
          },
          select: { score: true, taskId: true },
        });

        if (submissions.length === 0) {
          taskAverage = 0;
        } else {
          let totalScorePercent = 0;
          for (const sub of submissions) {
            const task = tasks.find((t) => t.id === sub.taskId);
            const maxScore = task?.maxScore;
            const score = sub.score;
            if (score != null) {
              if (maxScore != null && maxScore > 0) {
                totalScorePercent += (score / maxScore) * 100;
              } else {
                totalScorePercent += 100;
              }
            }
          }
          taskAverage = totalScorePercent / submissions.length;
        }
      }

      const percentage = Math.round((attendanceRate + taskAverage) / 2);

      const progress = await this.prisma.$transaction(async (tx) => {
        const existing = await tx.studentProgress.findFirst({
          where: {
            studentId: enrollment.studentId,
            batchId: enrollment.batchId,
          },
          orderBy: { assessedAt: 'desc' },
        });

        if (existing) {
          return tx.studentProgress.update({
            where: { id: existing.id },
            data: {
              percentage,
              trainerId: user.id,
              assessedAt: new Date(),
            },
          });
        }

        return tx.studentProgress.create({
          data: {
            tenantId: user.tenantId,
            studentId: enrollment.studentId,
            batchId: enrollment.batchId,
            percentage,
            trainerId: user.id,
            assessedAt: new Date(),
          },
        });
      });

      results.push({
        studentId: enrollment.studentId,
        batchId: enrollment.batchId,
        progress,
        aggregates: {
          attendanceRate: Math.round(attendanceRate * 100) / 100,
          taskAverage: Math.round(taskAverage * 100) / 100,
          totalSessions,
          totalTasks,
        },
      });
    }

    return { message: 'Progress recalculated successfully', data: results };
  }
}
