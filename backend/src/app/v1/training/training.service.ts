import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database';
import { AuthenticatedUser } from '@/common/interfaces';
import { paginate, paginationArgs } from '@/common/utils';
import { CreateBatchDto, CreateStudentDto, QueryPaginationDto } from './dto/training.dto';

@Injectable()
export class TrainingService {
  constructor(private readonly prisma: PrismaService) {}

  async findBatches(user: AuthenticatedUser, query: QueryPaginationDto) {
    const { skip, take, page, pageSize } = paginationArgs(query.page, query.pageSize);
    const where = { tenantId: user.tenantId };

    const [data, total] = await Promise.all([
      this.prisma.batch.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: { _count: { select: { enrollments: true } } },
      }),
      this.prisma.batch.count({ where }),
    ]);

    return paginate(data, total, page, pageSize);
  }

  createBatch(user: AuthenticatedUser, dto: CreateBatchDto) {
    return this.prisma.batch.create({
      data: {
        tenantId: user.tenantId,
        name: dto.name,
        capacity: dto.capacity ?? 30,
      },
    });
  }

  async findStudents(user: AuthenticatedUser, query: QueryPaginationDto) {
    const { skip, take, page, pageSize } = paginationArgs(query.page, query.pageSize);
    const where = { tenantId: user.tenantId };

    const [data, total] = await Promise.all([
      this.prisma.student.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: { enrollments: { include: { batch: { select: { id: true, name: true } } } } },
      }),
      this.prisma.student.count({ where }),
    ]);

    return paginate(data, total, page, pageSize);
  }

  createStudent(user: AuthenticatedUser, dto: CreateStudentDto) {
    return this.prisma.student.create({
      data: {
        tenantId: user.tenantId,
        name: dto.name,
        phone: dto.phone,
        ...(dto.email ? { email: dto.email } : {}),
      },
    });
  }
}
