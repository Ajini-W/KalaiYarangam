import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '@/common/decorators';
import { AuthenticatedUser } from '@/common/interfaces';
import { RentalService } from './rental.service';
import { CreateBookingDto, CreateInventoryDto, QueryPaginationDto } from './dto/rental.dto';

@ApiTags('rental')
@ApiBearerAuth()
@Controller('rental')
export class RentalController {
  constructor(private readonly rentalService: RentalService) {}

  @Get('inventory')
  findInventory(@CurrentUser() user: AuthenticatedUser, @Query() query: QueryPaginationDto) {
    return this.rentalService.findInventory(user, query);
  }

  @Post('inventory')
  createInventory(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateInventoryDto) {
    return this.rentalService.createInventory(user, dto);
  }

  @Get('bookings')
  findBookings(@CurrentUser() user: AuthenticatedUser, @Query() query: QueryPaginationDto) {
    return this.rentalService.findBookings(user, query);
  }

  @Post('bookings')
  createBooking(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateBookingDto) {
    return this.rentalService.createBooking(user, dto);
  }
}
