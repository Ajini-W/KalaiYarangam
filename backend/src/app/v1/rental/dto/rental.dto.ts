import { IsDateString, IsEnum, IsInt, IsNumber, IsOptional, IsString, Min, MinLength } from 'class-validator';
import { RentalBookingStatus } from '@prisma/client';
import { Type } from 'class-transformer';

export class CreateInventoryDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsString()
  category!: string;

  @IsOptional()
  @IsString()
  sku?: string;

  @IsNumber()
  dailyRate!: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantity?: number;
}

export class CreateBookingDto {
  @IsString()
  itemId!: string;

  @IsString()
  client!: string;

  @IsDateString()
  startDate!: string;

  @IsDateString()
  endDate!: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantity?: number;

  @IsOptional()
  @IsEnum(RentalBookingStatus)
  status?: RentalBookingStatus;
}

export class QueryPaginationDto {
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
}
