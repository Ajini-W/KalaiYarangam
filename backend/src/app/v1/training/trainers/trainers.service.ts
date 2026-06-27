import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '@/database';
import { AuthenticatedUser } from '@/common/interfaces';
import { paginate, paginationArgs } from '@/common/utils';
import { CreateTrainerDto, QueryTrainerDto, UpdateTrainerDto, UpdateTrainerStatusDto } from './dto/trainers.dto';

@Injectable()
export class TrainersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: AuthenticatedUser, dto: CreateTrainerDto) {
    if (!user.tenantId) {
      throw new NotFoundException('Tenant not found');
    }

    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) {
      throw new BadRequestException('Email already in use');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const trainer = await this.prisma.user.create({
      data: {
        tenantId: user.tenantId,
        email: dto.email,
        passwordHash,
        name: dto.name,
        phone: dto.phone,
        role: 'TRAINER',
        status: 'ACTIVE',
        userRoles: {
          create: { role: 'TRAINER', tenantId: user.tenantId },
        },
      },
    });

    return { message: 'Trainer created successfully', data: { id: trainer.id, name: trainer.name, email: trainer.email, phone: trainer.phone } };
  }

  async findAll(user: AuthenticatedUser, query: QueryTrainerDto) {
    if (!user.tenantId) {
      throw new NotFoundException('Tenant not found');
    }

    const { skip, take, page, pageSize } = paginationArgs(query.page, query.pageSize);

    const where: Record<string, unknown> = {
      tenantId: user.tenantId,
      role: 'TRAINER',
    };

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { email: { contains: query.search, mode: 'insensitive' } },
        { phone: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.branchId) {
      where.userBranches = { some: { branchId: query.branchId } };
    }

    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          _count: { select: { batchTrainers: true } },
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return paginate(data, total, page, pageSize);
  }

  async findOne(user: AuthenticatedUser, id: string) {
    if (!user.tenantId) {
      throw new NotFoundException('Tenant not found');
    }

    const trainer = await this.prisma.user.findFirst({
      where: { id, tenantId: user.tenantId, role: 'TRAINER' },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        _count: { select: { batchTrainers: true } },
      },
    });

    if (!trainer) {
      throw new NotFoundException('Trainer not found');
    }

    return { message: 'Trainer retrieved successfully', data: trainer };
  }

  async update(user: AuthenticatedUser, id: string, dto: UpdateTrainerDto) {
    if (!user.tenantId) {
      throw new NotFoundException('Tenant not found');
    }

    const trainer = await this.prisma.user.findFirst({
      where: { id, tenantId: user.tenantId, role: 'TRAINER' },
    });

    if (!trainer) {
      throw new NotFoundException('Trainer not found');
    }

    if (dto.email && dto.email !== trainer.email) {
      const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
      if (existing) {
        throw new BadRequestException('Email already in use');
      }
    }

    const updated = await this.prisma.user.update({
      where: { id },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.email !== undefined && { email: dto.email }),
        ...(dto.phone !== undefined && { phone: dto.phone }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        status: true,
      },
    });

    return { message: 'Trainer updated successfully', data: updated };
  }

  async updateStatus(user: AuthenticatedUser, id: string, dto: UpdateTrainerStatusDto) {
    if (!user.tenantId) {
      throw new NotFoundException('Tenant not found');
    }

    const trainer = await this.prisma.user.findFirst({
      where: { id, tenantId: user.tenantId, role: 'TRAINER' },
    });

    if (!trainer) {
      throw new NotFoundException('Trainer not found');
    }

    const updated = await this.prisma.user.update({
      where: { id },
      data: { status: dto.isActive ? 'ACTIVE' : 'INACTIVE' },
      select: { id: true, name: true, status: true },
    });

    return { message: `Trainer ${dto.isActive ? 'activated' : 'deactivated'} successfully`, data: updated };
  }

  async archive(user: AuthenticatedUser, id: string) {
    if (!user.tenantId) {
      throw new NotFoundException('Tenant not found');
    }

    const trainer = await this.prisma.user.findFirst({
      where: { id, tenantId: user.tenantId, role: 'TRAINER' },
    });

    if (!trainer) {
      throw new NotFoundException('Trainer not found');
    }

    const updated = await this.prisma.user.update({
      where: { id },
      data: { status: 'SUSPENDED' },
      select: { id: true, name: true, status: true },
    });

    return { message: 'Trainer archived successfully', data: updated };
  }

  async restore(user: AuthenticatedUser, id: string) {
    if (!user.tenantId) {
      throw new NotFoundException('Tenant not found');
    }

    const trainer = await this.prisma.user.findFirst({
      where: { id, tenantId: user.tenantId, role: 'TRAINER' },
    });

    if (!trainer) {
      throw new NotFoundException('Trainer not found');
    }

    const updated = await this.prisma.user.update({
      where: { id },
      data: { status: 'ACTIVE' },
      select: { id: true, name: true, status: true },
    });

    return { message: 'Trainer restored successfully', data: updated };
  }

  async findBatches(user: AuthenticatedUser, id: string) {
    if (!user.tenantId) {
      throw new NotFoundException('Tenant not found');
    }

    const trainer = await this.prisma.user.findFirst({
      where: { id, tenantId: user.tenantId, role: 'TRAINER' },
    });

    if (!trainer) {
      throw new NotFoundException('Trainer not found');
    }

    const batchTrainers = await this.prisma.batchTrainer.findMany({
      where: { trainerId: id },
      include: {
        batch: {
          select: { id: true, name: true, status: true, _count: { select: { enrollments: true } } },
        },
      },
      orderBy: { assignedAt: 'desc' },
    });

    return { message: 'Batches retrieved successfully', data: batchTrainers };
  }

  async findSchedule(user: AuthenticatedUser, id: string) {
    if (!user.tenantId) {
      throw new NotFoundException('Tenant not found');
    }

    const trainer = await this.prisma.user.findFirst({
      where: { id, tenantId: user.tenantId, role: 'TRAINER' },
    });

    if (!trainer) {
      throw new NotFoundException('Trainer not found');
    }

    const batchIds = await this.prisma.batchTrainer.findMany({
      where: { trainerId: id },
      select: { batchId: true },
    });

    const sessions = await this.prisma.classSession.findMany({
      where: {
        batchId: { in: batchIds.map((b) => b.batchId) },
        date: { gte: new Date() },
      },
      include: {
        batch: { select: { id: true, name: true } },
      },
      orderBy: { date: 'asc' },
      take: 50,
    });

    return { message: 'Schedule retrieved successfully', data: sessions };
  }

  async findAttendance(user: AuthenticatedUser, id: string) {
    if (!user.tenantId) {
      throw new NotFoundException('Tenant not found');
    }

    const trainer = await this.prisma.user.findFirst({
      where: { id, tenantId: user.tenantId, role: 'TRAINER' },
    });

    if (!trainer) {
      throw new NotFoundException('Trainer not found');
    }

    const attendanceSessions = await this.prisma.attendanceSession.findMany({
      where: { markedBy: id, tenantId: user.tenantId },
      include: {
        records: true,
        classSession: { select: { id: true, topic: true, date: true } },
      },
      orderBy: { date: 'desc' },
      take: 50,
    });

    return { message: 'Attendance records retrieved successfully', data: attendanceSessions };
  }

  async findWorkload(user: AuthenticatedUser, id: string) {
    if (!user.tenantId) {
      throw new NotFoundException('Tenant not found');
    }

    const trainer = await this.prisma.user.findFirst({
      where: { id, tenantId: user.tenantId, role: 'TRAINER' },
    });

    if (!trainer) {
      throw new NotFoundException('Trainer not found');
    }

    const [batchCount, upcomingSessions, totalStudents] = await Promise.all([
      this.prisma.batchTrainer.count({ where: { trainerId: id } }),
      this.prisma.classSession.count({
        where: {
          batch: { trainers: { some: { trainerId: id } } },
          date: { gte: new Date() },
        },
      }),
      this.prisma.enrollment.count({
        where: {
          batch: { trainers: { some: { trainerId: id } } },
          status: 'ACTIVE',
        },
      }),
    ]);

    return {
      message: 'Workload retrieved successfully',
      data: { batchCount, upcomingSessions, totalStudents },
    };
  }
}
