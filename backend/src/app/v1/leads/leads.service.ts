import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database';
import { AuthenticatedUser } from '@/common/interfaces';
import { paginate, paginationArgs } from '@/common/utils';
import { CreateLeadDto, QueryLeadsDto } from './dto/leads.dto';

@Injectable()
export class LeadsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(user: AuthenticatedUser, query: QueryLeadsDto) {
    const { skip, take, page, pageSize } = paginationArgs(query.page, query.pageSize);

    const where = {
      tenantId: user.tenantId,
      ...(query.status ? { status: query.status } : {}),
      ...(query.search
        ? {
            OR: [
              { name: { contains: query.search, mode: 'insensitive' as const } },
              { course: { contains: query.search, mode: 'insensitive' as const } },
            ],
          }
        : {}),
    };

    const [data, total] = await Promise.all([
      this.prisma.lead.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.lead.count({ where }),
    ]);

    return paginate(data, total, page, pageSize);
  }

  create(user: AuthenticatedUser, dto: CreateLeadDto) {
    return this.prisma.lead.create({
      data: { ...dto, tenantId: user.tenantId },
    });
  }
}
