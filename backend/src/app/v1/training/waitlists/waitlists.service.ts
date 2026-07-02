import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/database';
import { AuthenticatedUser } from '@/common/interfaces';
import { paginate, paginationArgs } from '@/common/utils';
import { AddToWaitlistDto, QueryWaitlistDto, UpdateWaitlistDto } from './dto/waitlists.dto';

@Injectable()
export class WaitlistsService {
  constructor(private readonly prisma: PrismaService) {}

  async add(user: AuthenticatedUser, dto: AddToWaitlistDto) {
    if (!user.tenantId) {
      throw new NotFoundException('Tenant not found');
    }

    const batch = await this.prisma.batch.findFirst({
      where: { id: dto.batchId, tenantId: user.tenantId },
    });

    if (!batch) {
      throw new NotFoundException('Batch not found');
    }

    const student = await this.prisma.student.findFirst({
      where: { id: dto.studentId, tenantId: user.tenantId },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    const existing = await this.prisma.enrollment.findUnique({
      where: { studentId_batchId: { studentId: dto.studentId, batchId: dto.batchId } },
    });

    if (existing) {
      throw new BadRequestException('Student already has an enrollment in this batch');
    }

    const maxPosition = await this.prisma.enrollment.aggregate({
      where: { batchId: dto.batchId, status: 'WAITING' },
      _max: { waitlistPosition: true },
    });

    const nextPosition = (maxPosition._max.waitlistPosition ?? 0) + 1;

    const enrollment = await this.prisma.enrollment.create({
      data: {
        tenantId: user.tenantId,
        studentId: dto.studentId,
        batchId: dto.batchId,
        status: 'WAITING',
        waitlistPosition: nextPosition,
        remarks: dto.notes,
      },
      include: { student: true },
    });

    return { message: 'Added to waitlist successfully', data: enrollment };
  }

  async findAll(user: AuthenticatedUser, query: QueryWaitlistDto) {
    if (!user.tenantId) {
      throw new NotFoundException('Tenant not found');
    }

    const { skip, take, page, pageSize } = paginationArgs(query.page, query.pageSize);

    const where: Record<string, unknown> = {
      tenantId: user.tenantId,
      status: 'WAITING',
    };

    if (query.batchId) where.batchId = query.batchId;
    if (query.studentId) where.studentId = query.studentId;

    const [data, total] = await Promise.all([
      this.prisma.enrollment.findMany({
        where,
        skip,
        take,
        orderBy: [{ waitlistPosition: 'asc' }, { enrolledAt: 'asc' }],
        include: {
          student: true,
          batch: { select: { id: true, name: true } },
        },
      }),
      this.prisma.enrollment.count({ where }),
    ]);

    return paginate(data, total, page, pageSize);
  }

  async findOne(user: AuthenticatedUser, id: string) {
    if (!user.tenantId) {
      throw new NotFoundException('Tenant not found');
    }

    const enrollment = await this.prisma.enrollment.findFirst({
      where: { id, tenantId: user.tenantId, status: 'WAITING' },
      include: {
        student: true,
        batch: { select: { id: true, name: true, capacity: true } },
      },
    });

    if (!enrollment) {
      throw new NotFoundException('Waitlist entry not found');
    }

    return { message: 'Waitlist entry retrieved successfully', data: enrollment };
  }

  async update(user: AuthenticatedUser, id: string, dto: UpdateWaitlistDto) {
    if (!user.tenantId) {
      throw new NotFoundException('Tenant not found');
    }

    const enrollment = await this.prisma.enrollment.findFirst({
      where: { id, tenantId: user.tenantId, status: 'WAITING' },
    });

    if (!enrollment) {
      throw new NotFoundException('Waitlist entry not found');
    }

    const updated = await this.prisma.enrollment.update({
      where: { id },
      data: { remarks: dto.remarks },
      include: { student: true },
    });

    return { message: 'Waitlist entry updated successfully', data: updated };
  }

  async promote(user: AuthenticatedUser, id: string) {
    if (!user.tenantId) {
      throw new NotFoundException('Tenant not found');
    }

    const enrollment = await this.prisma.enrollment.findFirst({
      where: { id, tenantId: user.tenantId, status: 'WAITING' },
    });

    if (!enrollment) {
      throw new NotFoundException('Waitlist entry not found');
    }

    const [updated] = await this.prisma.$transaction([
      this.prisma.enrollment.update({
        where: { id },
        data: {
          status: 'ACTIVE',
          promotedAt: new Date(),
          waitlistPosition: null,
        },
        include: { student: true, batch: { select: { id: true, name: true } } },
      }),
      this.prisma.batch.update({
        where: { id: enrollment.batchId },
        data: { enrolled: { increment: 1 } },
      }),
    ]);

    return { message: 'Student promoted from waitlist successfully', data: updated };
  }

  async withdraw(user: AuthenticatedUser, id: string) {
    if (!user.tenantId) {
      throw new NotFoundException('Tenant not found');
    }

    const enrollment = await this.prisma.enrollment.findFirst({
      where: { id, tenantId: user.tenantId, status: 'WAITING' },
    });

    if (!enrollment) {
      throw new NotFoundException('Waitlist entry not found');
    }

    const updated = await this.prisma.enrollment.update({
      where: { id },
      data: {
        status: 'WITHDRAWN',
        waitlistPosition: null,
      },
      include: { student: true },
    });

    return { message: 'Student withdrawn from waitlist successfully', data: updated };
  }
}
