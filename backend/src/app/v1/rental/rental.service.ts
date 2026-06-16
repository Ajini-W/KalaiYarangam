import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database';
import { AuthenticatedUser } from '@/common/interfaces';
import { paginate, paginationArgs } from '@/common/utils';
import { CreateBookingDto, CreateInventoryDto, QueryPaginationDto } from './dto/rental.dto';

@Injectable()
export class RentalService {
  constructor(private readonly prisma: PrismaService) {}

  async findInventory(user: AuthenticatedUser, query: QueryPaginationDto) {
    const { skip, take, page, pageSize } = paginationArgs(query.page, query.pageSize);
    const where = { tenantId: user.tenantId };

    const [data, total] = await Promise.all([
      this.prisma.rentalItem.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.rentalItem.count({ where }),
    ]);

    return paginate(data, total, page, pageSize);
  }

  createInventory(user: AuthenticatedUser, dto: CreateInventoryDto) {
    const quantity = dto.quantity ?? 1;
    return this.prisma.rentalItem.create({
      data: {
        ...dto,
        tenantId: user.tenantId,
        quantity,
        available: quantity,
      },
    });
  }

  async findBookings(user: AuthenticatedUser, query: QueryPaginationDto) {
    const { skip, take, page, pageSize } = paginationArgs(query.page, query.pageSize);
    const where = { tenantId: user.tenantId };

    const [data, total] = await Promise.all([
      this.prisma.rentalBooking.findMany({
        where,
        skip,
        take,
        orderBy: { startDate: 'desc' },
        include: { item: { select: { id: true, name: true, category: true } } },
      }),
      this.prisma.rentalBooking.count({ where }),
    ]);

    return paginate(data, total, page, pageSize);
  }

  createBooking(user: AuthenticatedUser, dto: CreateBookingDto) {
    return this.prisma.rentalBooking.create({
      data: {
        tenantId: user.tenantId,
        itemId: dto.itemId,
        client: dto.client,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        quantity: dto.quantity ?? 1,
        status: dto.status,
      },
      include: { item: true },
    });
  }
}
