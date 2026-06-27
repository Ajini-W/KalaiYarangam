import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/database';
import { AuthenticatedUser } from '@/common/interfaces';
import { paginate, paginationArgs } from '@/common/utils';
import { AssignTrainerDto, CreateBatchDto, DuplicateBatchDto, QueryBatchDto, UpdateBatchDto, UpdateBatchStatusDto } from './dto/batches.dto';

@Injectable()
export class BatchesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: AuthenticatedUser, dto: CreateBatchDto) {
    if (!user.tenantId) {
      throw new NotFoundException('Tenant not found');
    }

    const batch = await this.prisma.batch.create({
      data: {
        tenantId: user.tenantId,
        name: dto.name,
        code: dto.code,
        courseId: dto.courseId,
        branchId: dto.branchId,
        capacity: dto.capacity ?? 30,
        startDate: dto.startDate,
        endDate: dto.endDate,
      },
    });

    return { message: 'Batch created successfully', data: batch };
  }

  async findAll(user: AuthenticatedUser, query: QueryBatchDto) {
    if (!user.tenantId) {
      throw new NotFoundException('Tenant not found');
    }

    const { skip, take, page, pageSize } = paginationArgs(query.page, query.pageSize);

    const where: Record<string, unknown> = { tenantId: user.tenantId };

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { code: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query.status) where.status = query.status;
    if (query.courseId) where.courseId = query.courseId;
    if (query.branchId) where.branchId = query.branchId;

    const [data, total] = await Promise.all([
      this.prisma.batch.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: { select: { enrollments: true, trainers: true, sessions: true } },
        },
      }),
      this.prisma.batch.count({ where }),
    ]);

    return paginate(data, total, page, pageSize);
  }

  async statistics(user: AuthenticatedUser) {
    if (!user.tenantId) {
      throw new NotFoundException('Tenant not found');
    }

    const all = await this.prisma.batch.findMany({
      where: { tenantId: user.tenantId },
      select: { status: true, capacity: true, enrolled: true },
    });

    const statusCounts: Record<string, number> = {};
    let totalCapacity = 0;
    let totalEnrolled = 0;

    for (const b of all) {
      statusCounts[b.status] = (statusCounts[b.status] ?? 0) + 1;
      totalCapacity += b.capacity;
      totalEnrolled += b.enrolled;
    }

    return {
      message: 'Statistics retrieved successfully',
      data: {
        total: all.length,
        statusCounts,
        totalCapacity,
        totalEnrolled,
        enrollmentRate: totalCapacity > 0 ? Math.round((totalEnrolled / totalCapacity) * 100) : 0,
      },
    };
  }

  async findOne(user: AuthenticatedUser, id: string) {
    if (!user.tenantId) {
      throw new NotFoundException('Tenant not found');
    }

    const batch = await this.prisma.batch.findFirst({
      where: { id, tenantId: user.tenantId },
      include: {
        trainers: { include: { trainer: { select: { id: true, name: true, email: true } } } },
        schedules: true,
        _count: { select: { enrollments: true, sessions: true, tasks: true } },
      },
    });

    if (!batch) {
      throw new NotFoundException('Batch not found');
    }

    return { message: 'Batch retrieved successfully', data: batch };
  }

  async update(user: AuthenticatedUser, id: string, dto: UpdateBatchDto) {
    if (!user.tenantId) {
      throw new NotFoundException('Tenant not found');
    }

    const batch = await this.prisma.batch.findFirst({
      where: { id, tenantId: user.tenantId },
    });

    if (!batch) {
      throw new NotFoundException('Batch not found');
    }

    const updated = await this.prisma.batch.update({
      where: { id },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.code !== undefined && { code: dto.code }),
        ...(dto.courseId !== undefined && { courseId: dto.courseId }),
        ...(dto.branchId !== undefined && { branchId: dto.branchId }),
        ...(dto.capacity !== undefined && { capacity: dto.capacity }),
        ...(dto.startDate !== undefined && { startDate: dto.startDate }),
        ...(dto.endDate !== undefined && { endDate: dto.endDate }),
      },
    });

    return { message: 'Batch updated successfully', data: updated };
  }

  async updateStatus(user: AuthenticatedUser, id: string, dto: UpdateBatchStatusDto) {
    if (!user.tenantId) {
      throw new NotFoundException('Tenant not found');
    }

    const batch = await this.prisma.batch.findFirst({
      where: { id, tenantId: user.tenantId },
    });

    if (!batch) {
      throw new NotFoundException('Batch not found');
    }

    const updated = await this.prisma.batch.update({
      where: { id },
      data: { status: dto.status },
    });

    return { message: 'Batch status updated successfully', data: updated };
  }

  async archive(user: AuthenticatedUser, id: string) {
    if (!user.tenantId) {
      throw new NotFoundException('Tenant not found');
    }

    const batch = await this.prisma.batch.findFirst({
      where: { id, tenantId: user.tenantId },
    });

    if (!batch) {
      throw new NotFoundException('Batch not found');
    }

    const updated = await this.prisma.batch.update({
      where: { id },
      data: { isActive: false },
    });

    return { message: 'Batch archived successfully', data: updated };
  }

  async restore(user: AuthenticatedUser, id: string) {
    if (!user.tenantId) {
      throw new NotFoundException('Tenant not found');
    }

    const batch = await this.prisma.batch.findFirst({
      where: { id, tenantId: user.tenantId },
    });

    if (!batch) {
      throw new NotFoundException('Batch not found');
    }

    const updated = await this.prisma.batch.update({
      where: { id },
      data: { isActive: true },
    });

    return { message: 'Batch restored successfully', data: updated };
  }

  async duplicate(user: AuthenticatedUser, id: string, dto: DuplicateBatchDto) {
    if (!user.tenantId) {
      throw new NotFoundException('Tenant not found');
    }

    const source = await this.prisma.batch.findFirst({
      where: { id, tenantId: user.tenantId },
      include: { schedules: true },
    });

    if (!source) {
      throw new NotFoundException('Batch not found');
    }

    const batch = await this.prisma.batch.create({
      data: {
        tenantId: user.tenantId,
        name: dto.name,
        code: source.code ? `${source.code}-copy` : undefined,
        courseId: source.courseId,
        branchId: source.branchId,
        capacity: source.capacity,
        startDate: source.startDate,
        endDate: source.endDate,
        schedules: {
          create: source.schedules.map((s) => ({
            dayOfWeek: s.dayOfWeek,
            startTime: s.startTime,
            endTime: s.endTime,
            room: s.room,
          })),
        },
      },
      include: { schedules: true },
    });

    return { message: 'Batch duplicated successfully', data: batch };
  }

  async assignTrainer(user: AuthenticatedUser, id: string, dto: AssignTrainerDto) {
    if (!user.tenantId) {
      throw new NotFoundException('Tenant not found');
    }

    const batch = await this.prisma.batch.findFirst({
      where: { id, tenantId: user.tenantId },
    });

    if (!batch) {
      throw new NotFoundException('Batch not found');
    }

    const trainer = await this.prisma.user.findFirst({
      where: { id: dto.trainerId, tenantId: user.tenantId, role: 'TRAINER' },
    });

    if (!trainer) {
      throw new NotFoundException('Trainer not found');
    }

    const result = await this.prisma.batchTrainer.upsert({
      where: { batchId_trainerId: { batchId: id, trainerId: dto.trainerId } },
      create: {
        batchId: id,
        trainerId: dto.trainerId,
        isPrimary: dto.isPrimary ?? false,
      },
      update: {
        isPrimary: dto.isPrimary,
      },
      include: {
        trainer: { select: { id: true, name: true, email: true } },
      },
    });

    return { message: 'Trainer assigned successfully', data: result };
  }

  async findStudents(user: AuthenticatedUser, id: string) {
    if (!user.tenantId) {
      throw new NotFoundException('Tenant not found');
    }

    const batch = await this.prisma.batch.findFirst({
      where: { id, tenantId: user.tenantId },
    });

    if (!batch) {
      throw new NotFoundException('Batch not found');
    }

    const enrollments = await this.prisma.enrollment.findMany({
      where: { batchId: id },
      include: {
        student: true,
      },
      orderBy: { enrolledAt: 'desc' },
    });

    return { message: 'Students retrieved successfully', data: enrollments };
  }

  async findSchedules(user: AuthenticatedUser, id: string) {
    if (!user.tenantId) {
      throw new NotFoundException('Tenant not found');
    }

    const batch = await this.prisma.batch.findFirst({
      where: { id, tenantId: user.tenantId },
    });

    if (!batch) {
      throw new NotFoundException('Batch not found');
    }

    const schedules = await this.prisma.batchSchedule.findMany({
      where: { batchId: id },
      orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
    });

    return { message: 'Schedules retrieved successfully', data: schedules };
  }

  async findAttendance(user: AuthenticatedUser, id: string) {
    if (!user.tenantId) {
      throw new NotFoundException('Tenant not found');
    }

    const batch = await this.prisma.batch.findFirst({
      where: { id, tenantId: user.tenantId },
    });

    if (!batch) {
      throw new NotFoundException('Batch not found');
    }

    const sessions = await this.prisma.attendanceSession.findMany({
      where: { batchId: id, tenantId: user.tenantId },
      include: {
        records: true,
        classSession: { select: { id: true, topic: true, date: true, startTime: true, endTime: true } },
      },
      orderBy: { date: 'desc' },
    });

    return { message: 'Attendance records retrieved successfully', data: sessions };
  }

  async findProgress(user: AuthenticatedUser, id: string) {
    if (!user.tenantId) {
      throw new NotFoundException('Tenant not found');
    }

    const batch = await this.prisma.batch.findFirst({
      where: { id, tenantId: user.tenantId },
    });

    if (!batch) {
      throw new NotFoundException('Batch not found');
    }

    const progress = await this.prisma.studentProgress.findMany({
      where: { batchId: id },
      include: {
        student: { select: { id: true, name: true, phone: true } },
      },
      orderBy: { assessedAt: 'desc' },
    });

    return { message: 'Progress records retrieved successfully', data: progress };
  }

  async findWaitlist(user: AuthenticatedUser, id: string) {
    if (!user.tenantId) {
      throw new NotFoundException('Tenant not found');
    }

    const batch = await this.prisma.batch.findFirst({
      where: { id, tenantId: user.tenantId },
    });

    if (!batch) {
      throw new NotFoundException('Batch not found');
    }

    const waitlist = await this.prisma.enrollment.findMany({
      where: { batchId: id, status: 'WAITING' },
      include: { student: true },
      orderBy: [{ waitlistPosition: 'asc' }, { enrolledAt: 'asc' }],
    });

    return { message: 'Waitlist retrieved successfully', data: waitlist };
  }

  async capacity(user: AuthenticatedUser, id: string) {
    if (!user.tenantId) {
      throw new NotFoundException('Tenant not found');
    }

    const batch = await this.prisma.batch.findFirst({
      where: { id, tenantId: user.tenantId },
    });

    if (!batch) {
      throw new NotFoundException('Batch not found');
    }

    const [enrolled, waitlistCount] = await Promise.all([
      this.prisma.enrollment.count({ where: { batchId: id, status: 'ACTIVE' } }),
      this.prisma.enrollment.count({ where: { batchId: id, status: 'WAITING' } }),
    ]);

    return {
      message: 'Capacity retrieved successfully',
      data: {
        capacity: batch.capacity,
        enrolled,
        available: Math.max(0, batch.capacity - enrolled),
        waitlistCount,
      },
    };
  }
}
