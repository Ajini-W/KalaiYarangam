import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/database';
import { AuthenticatedUser } from '@/common/interfaces';
import { paginate, paginationArgs } from '@/common/utils';
import { CalendarQueryDto, CreateScheduleDto, QueryScheduleDto, RescheduleDto, UpdateScheduleDto } from './dto/schedules.dto';

@Injectable()
export class SchedulesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: AuthenticatedUser, dto: CreateScheduleDto) {
    if (!user.tenantId) {
      throw new NotFoundException('Tenant not found');
    }

    const batch = await this.prisma.batch.findFirst({
      where: { id: dto.batchId, tenantId: user.tenantId },
    });

    if (!batch) {
      throw new NotFoundException('Batch not found');
    }

    const session = await this.prisma.classSession.create({
      data: {
        batchId: dto.batchId,
        date: dto.date,
        startTime: dto.startTime,
        endTime: dto.endTime,
        topic: dto.topic,
        notes: dto.notes,
      },
    });

    return { message: 'Schedule created successfully', data: session };
  }

  async findAll(user: AuthenticatedUser, query: QueryScheduleDto) {
    if (!user.tenantId) {
      throw new NotFoundException('Tenant not found');
    }

    const { skip, take, page, pageSize } = paginationArgs(query.page, query.pageSize);

    const where: Record<string, unknown> = {
      batch: { tenantId: user.tenantId },
    };

    if (query.batchId) where.batchId = query.batchId;
    if (query.status) where.status = query.status;
    if (query.dateFrom || query.dateTo) {
      const dateFilter: Record<string, Date> = {};
      if (query.dateFrom) dateFilter.gte = query.dateFrom;
      if (query.dateTo) dateFilter.lte = query.dateTo;
      where.date = dateFilter;
    }

    const [data, total] = await Promise.all([
      this.prisma.classSession.findMany({
        where,
        skip,
        take,
        orderBy: [{ date: 'desc' }, { startTime: 'asc' }],
        include: { batch: { select: { id: true, name: true } } },
      }),
      this.prisma.classSession.count({ where }),
    ]);

    return paginate(data, total, page, pageSize);
  }

  async calendar(user: AuthenticatedUser, query: CalendarQueryDto) {
    if (!user.tenantId) {
      throw new NotFoundException('Tenant not found');
    }

    const now = new Date();
    const month = query.month ?? now.getMonth() + 1;
    const year = query.year ?? now.getFullYear();

    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59, 999);

    const where: Record<string, unknown> = {
      batch: { tenantId: user.tenantId },
      date: { gte: start, lte: end },
    };

    if (query.batchId) where.batchId = query.batchId;

    const sessions = await this.prisma.classSession.findMany({
      where,
      orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
      include: { batch: { select: { id: true, name: true } } },
    });

    const grouped: Record<string, typeof sessions> = {};
    for (const s of sessions) {
      const key = s.date.toISOString().slice(0, 10);
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(s);
    }

    return { message: 'Calendar retrieved successfully', data: grouped };
  }

  async upcoming(user: AuthenticatedUser) {
    if (!user.tenantId) {
      throw new NotFoundException('Tenant not found');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sessions = await this.prisma.classSession.findMany({
      where: {
        batch: { tenantId: user.tenantId },
        date: { gte: today },
        status: { not: 'CANCELLED' },
      },
      orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
      include: { batch: { select: { id: true, name: true } } },
      take: 50,
    });

    return { message: 'Upcoming schedules retrieved successfully', data: sessions };
  }

  async today(user: AuthenticatedUser) {
    if (!user.tenantId) {
      throw new NotFoundException('Tenant not found');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    const sessions = await this.prisma.classSession.findMany({
      where: {
        batch: { tenantId: user.tenantId },
        date: { gte: today, lte: endOfDay },
      },
      orderBy: { startTime: 'asc' },
      include: { batch: { select: { id: true, name: true } } },
    });

    return { message: "Today's schedules retrieved successfully", data: sessions };
  }

  async findOne(user: AuthenticatedUser, id: string) {
    if (!user.tenantId) {
      throw new NotFoundException('Tenant not found');
    }

    const session = await this.prisma.classSession.findFirst({
      where: { id, batch: { tenantId: user.tenantId } },
      include: {
        batch: { select: { id: true, name: true } },
        attendanceSession: { include: { records: true } },
      },
    });

    if (!session) {
      throw new NotFoundException('Schedule not found');
    }

    return { message: 'Schedule retrieved successfully', data: session };
  }

  async update(user: AuthenticatedUser, id: string, dto: UpdateScheduleDto) {
    if (!user.tenantId) {
      throw new NotFoundException('Tenant not found');
    }

    const session = await this.prisma.classSession.findFirst({
      where: { id, batch: { tenantId: user.tenantId } },
    });

    if (!session) {
      throw new NotFoundException('Schedule not found');
    }

    const updated = await this.prisma.classSession.update({
      where: { id },
      data: {
        ...(dto.date !== undefined && { date: dto.date }),
        ...(dto.startTime !== undefined && { startTime: dto.startTime }),
        ...(dto.endTime !== undefined && { endTime: dto.endTime }),
        ...(dto.topic !== undefined && { topic: dto.topic }),
        ...(dto.notes !== undefined && { notes: dto.notes }),
      },
    });

    return { message: 'Schedule updated successfully', data: updated };
  }

  async cancel(user: AuthenticatedUser, id: string) {
    if (!user.tenantId) {
      throw new NotFoundException('Tenant not found');
    }

    const session = await this.prisma.classSession.findFirst({
      where: { id, batch: { tenantId: user.tenantId } },
    });

    if (!session) {
      throw new NotFoundException('Schedule not found');
    }

    const updated = await this.prisma.classSession.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });

    return { message: 'Schedule cancelled successfully', data: updated };
  }

  async reschedule(user: AuthenticatedUser, id: string, dto: RescheduleDto) {
    if (!user.tenantId) {
      throw new NotFoundException('Tenant not found');
    }

    const session = await this.prisma.classSession.findFirst({
      where: { id, batch: { tenantId: user.tenantId } },
    });

    if (!session) {
      throw new NotFoundException('Schedule not found');
    }

    const updated = await this.prisma.classSession.update({
      where: { id },
      data: {
        ...(dto.date !== undefined && { date: dto.date }),
        ...(dto.startTime !== undefined && { startTime: dto.startTime }),
        ...(dto.endTime !== undefined && { endTime: dto.endTime }),
      },
    });

    return { message: 'Schedule rescheduled successfully', data: updated };
  }
}
