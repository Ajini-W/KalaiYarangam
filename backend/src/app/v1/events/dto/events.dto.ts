import { IsDateString, IsEnum, IsNumber, IsOptional, IsString, MinLength } from 'class-validator';
import { EventStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class CreateEventDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsString()
  client!: string;

  @IsString()
  type!: string;

  @IsDateString()
  eventDate!: string;

  @IsOptional()
  @IsNumber()
  budget?: number;

  @IsOptional()
  @IsEnum(EventStatus)
  status?: EventStatus;
}

export class QueryEventsDto {
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
  @IsString()
  search?: string;
}
