import { IsDate, IsEnum, IsInt, IsOptional, IsString, IsUUID, Min, MinLength } from 'class-validator';
import { Type } from 'class-transformer';
import { SessionStatus } from '@prisma/client';

export class CreateScheduleDto {
  @IsUUID()
  batchId!: string;

  @Type(() => Date)
  @IsDate()
  date!: Date;

  @IsString()
  @MinLength(4)
  startTime!: string;

  @IsString()
  @MinLength(4)
  endTime!: string;

  @IsOptional()
  @IsString()
  topic?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateScheduleDto {
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  date?: Date;

  @IsOptional()
  @IsString()
  @MinLength(4)
  startTime?: string;

  @IsOptional()
  @IsString()
  @MinLength(4)
  endTime?: string;

  @IsOptional()
  @IsString()
  topic?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class RescheduleDto {
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  date?: Date;

  @IsOptional()
  @IsString()
  @MinLength(4)
  startTime?: string;

  @IsOptional()
  @IsString()
  @MinLength(4)
  endTime?: string;
}

export class QueryScheduleDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageSize?: number = 10;

  @IsOptional()
  @IsUUID()
  batchId?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dateFrom?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dateTo?: Date;

  @IsOptional()
  @IsEnum(SessionStatus)
  status?: SessionStatus;
}

export class CalendarQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  month?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  year?: number;

  @IsOptional()
  @IsUUID()
  batchId?: string;
}
