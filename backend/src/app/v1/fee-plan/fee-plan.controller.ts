import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { FeePlanService } from './fee-plan.service';
import { CreateFeePlanDto } from './dto/create-fee-plan.dto';
import { UpdateFeePlanDto } from './dto/update-fee-plan.dto';

@Controller('fee-plans')
export class FeePlanController {
  constructor(private readonly feePlanService: FeePlanService) {}

  // POST /fee-plans
  @Post()
  create(@Body() dto: CreateFeePlanDto) {
    return this.feePlanService.create(dto);
  }

  // GET /fee-plans
  @Get()
  findAll() {
    return this.feePlanService.findAll();
  }

  // GET /fee-plans/:id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.feePlanService.findOne(id);
  }

  // PATCH /fee-plans/:id
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateFeePlanDto,
  ) {
    return this.feePlanService.update(id, dto);
  }

  // POST /fee-plans/:id/archive
  @Post(':id/archive')
  archive(@Param('id') id: string) {
    return this.feePlanService.archive(id);
  }

  // POST /fee-plans/:id/restore
  @Post(':id/restore')
  restore(@Param('id') id: string) {
    return this.feePlanService.restore(id);
  }

  // POST /fee-plans/:id/duplicate
  @Post(':id/duplicate')
  duplicate(@Param('id') id: string) {
    return this.feePlanService.duplicate(id);
  }
}