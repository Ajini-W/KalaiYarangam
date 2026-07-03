import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '@/common/decorators';
import { AuthenticatedUser } from '@/common/interfaces';
import { WaitlistsService } from './waitlists.service';
import { AddToWaitlistDto, QueryWaitlistDto, UpdateWaitlistDto } from './dto/waitlists.dto';

@ApiTags('training/waitlists')
@ApiBearerAuth()
@Controller('training/waitlists')
export class WaitlistsController {
  constructor(private readonly waitlistsService: WaitlistsService) {}

  @Post()
  add(@CurrentUser() user: AuthenticatedUser, @Body() dto: AddToWaitlistDto) {
    return this.waitlistsService.add(user, dto);
  }

  @Get()
  findAll(@CurrentUser() user: AuthenticatedUser, @Query() query: QueryWaitlistDto) {
    return this.waitlistsService.findAll(user, query);
  }

  @Get(':id')
  findOne(@CurrentUser() user: AuthenticatedUser, @Param('id', ParseUUIDPipe) id: string) {
    return this.waitlistsService.findOne(user, id);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateWaitlistDto,
  ) {
    return this.waitlistsService.update(user, id, dto);
  }

  @Post(':id/promote')
  promote(@CurrentUser() user: AuthenticatedUser, @Param('id', ParseUUIDPipe) id: string) {
    return this.waitlistsService.promote(user, id);
  }

  @Post(':id/withdraw')
  withdraw(@CurrentUser() user: AuthenticatedUser, @Param('id', ParseUUIDPipe) id: string) {
    return this.waitlistsService.withdraw(user, id);
  }
}
