import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/database';
import { AuthenticatedUser } from '@/common/interfaces';
import { paginate, paginationArgs } from '@/common/utils';
import { CreateCourseDto, UpdateCourseDto, QueryCourseDto } from './dto/courses.dto';

@Injectable()
export class CoursesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: AuthenticatedUser, dto: CreateCourseDto) {
    if (!user.tenantId) {
      throw new NotFoundException('Tenant not found');
    }

    const course = await this.prisma.course.create({
      data: {
        tenantId: user.tenantId,
        name: dto.name,
        description: dto.description,
        duration: dto.duration,
        fee: dto.fee,
      },
    });

    return { message: 'Course created successfully', data: course };
  }

  async findAll(user: AuthenticatedUser, query: QueryCourseDto) {
    if (!user.tenantId) {
      throw new NotFoundException('Tenant not found');
    }

    const { skip, take, page, pageSize } = paginationArgs(query.page, query.pageSize);

    const where: Record<string, unknown> = {
      tenantId: user.tenantId,
    };

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query.status === 'active') {
      where.isActive = true;
    } else if (query.status === 'archived') {
      where.isActive = false;
    }

    const orderBy = query.sortBy
      ? { [query.sortBy]: query.sortDir === 'asc' ? 'asc' as const : 'desc' as const }
      : { createdAt: 'desc' as const };

    const [data, total] = await Promise.all([
      this.prisma.course.findMany({
        where,
        skip,
        take,
        orderBy,
      }),
      this.prisma.course.count({ where }),
    ]);

    return paginate(data, total, page, pageSize);
  }

  async findOne(user: AuthenticatedUser, id: string) {
    if (!user.tenantId) {
      throw new NotFoundException('Tenant not found');
    }

    const course = await this.prisma.course.findFirst({
      where: { id, tenantId: user.tenantId },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return { message: 'Course fetched successfully', data: course };
  }

  async update(user: AuthenticatedUser, id: string, dto: UpdateCourseDto) {
    if (!user.tenantId) {
      throw new NotFoundException('Tenant not found');
    }

    const existing = await this.prisma.course.findFirst({
      where: { id, tenantId: user.tenantId },
    });

    if (!existing) {
      throw new NotFoundException('Course not found');
    }

    const course = await this.prisma.course.update({
      where: { id },
      data: dto,
    });

    return { message: 'Course updated successfully', data: course };
  }

  async archive(user: AuthenticatedUser, id: string) {
    if (!user.tenantId) {
      throw new NotFoundException('Tenant not found');
    }

    const existing = await this.prisma.course.findFirst({
      where: { id, tenantId: user.tenantId },
    });

    if (!existing) {
      throw new NotFoundException('Course not found');
    }

    await this.prisma.course.update({
      where: { id },
      data: { isActive: false },
    });

    return { message: 'Course archived successfully' };
  }

  async restore(user: AuthenticatedUser, id: string) {
    if (!user.tenantId) {
      throw new NotFoundException('Tenant not found');
    }

    const existing = await this.prisma.course.findFirst({
      where: { id, tenantId: user.tenantId },
    });

    if (!existing) {
      throw new NotFoundException('Course not found');
    }

    await this.prisma.course.update({
      where: { id },
      data: { isActive: true },
    });

    return { message: 'Course restored successfully' };
  }

  async stats(user: AuthenticatedUser) {
    if (!user.tenantId) {
      throw new NotFoundException('Tenant not found');
    }

    const [total, active, totalBatches] = await Promise.all([
      this.prisma.course.count({ where: { tenantId: user.tenantId } }),
      this.prisma.course.count({ where: { tenantId: user.tenantId, isActive: true } }),
      this.prisma.batch.count({ where: { tenantId: user.tenantId } }),
    ]);

    return {
      message: 'Course stats fetched successfully',
      data: { total, active, archived: total - active, totalBatches },
    };
  }
}
