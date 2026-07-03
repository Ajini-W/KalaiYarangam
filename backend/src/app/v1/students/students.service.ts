import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/database';
import { AuthenticatedUser } from '@/common/interfaces';

@Injectable()
export class StudentsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(user: AuthenticatedUser, search?: string) {
    if (!user.tenantId) {
      throw new NotFoundException('Tenant not found');
    }

    const where: Record<string, unknown> = { tenantId: user.tenantId };
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.student.findMany({
        where,
        orderBy: { name: 'asc' },
        take: 100,
      }),
      this.prisma.student.count({ where }),
    ]);

    return {
      message: 'Students retrieved successfully',
      data: {
        items: data,
        total,
        page: 1,
        pageSize: 100,
        totalPages: Math.ceil(total / 100),
      },
    };
  }
}
