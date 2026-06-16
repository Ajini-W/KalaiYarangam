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
      this.prisma.trainingBatch.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: { _count: { select: { students: true } } },
      }),
      this.prisma.trainingBatch.count({ where }),
    ]);

    return paginate(data, total, page, pageSize);
  }

  createBatch(user: AuthenticatedUser, dto: CreateBatchDto) {
    return this.prisma.trainingBatch.create({
      data: { ...dto, tenantId: user.tenantId },
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
        include: { batch: { select: { id: true, name: true, course: true } } },
      }),
      this.prisma.student.count({ where }),
    ]);

    return paginate(data, total, page, pageSize);
  }

  createStudent(user: AuthenticatedUser, dto: CreateStudentDto) {
    return this.prisma.student.create({
      data: { ...dto, tenantId: user.tenantId },
    });
  }
}
