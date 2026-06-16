import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database';
import { AuthenticatedUser } from '@/common/interfaces';
import { paginate, paginationArgs } from '@/common/utils';
import { CreateEventDto, QueryEventsDto } from './dto/events.dto';

@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(user: AuthenticatedUser, query: QueryEventsDto) {
    const { skip, take, page, pageSize } = paginationArgs(query.page, query.pageSize);

    const where = {
      tenantId: user.tenantId,
      ...(query.search
        ? {
            OR: [
              { name: { contains: query.search, mode: 'insensitive' as const } },
              { client: { contains: query.search, mode: 'insensitive' as const } },
            ],
          }
        : {}),
    };

    const [data, total] = await Promise.all([
      this.prisma.event.findMany({
        where,
        skip,
        take,
        orderBy: { eventDate: 'asc' },
      }),
      this.prisma.event.count({ where }),
    ]);

    return paginate(data, total, page, pageSize);
  }

  create(user: AuthenticatedUser, dto: CreateEventDto) {
    return this.prisma.event.create({
      data: {
        tenantId: user.tenantId,
        name: dto.name,
        client: dto.client,
        type: dto.type,
        eventDate: new Date(dto.eventDate),
        budget: dto.budget,
        status: dto.status,
      },
    });
  }
}
