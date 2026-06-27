import { IsInt, IsOptional, IsString, IsUUID, Max, MaxLength, Min, MinLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProgressDto {
  @IsUUID()
  studentId!: string;

  @IsOptional()
  @IsUUID()
  batchId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  module?: string;

  @IsInt()
  @Min(0)
  @Max(100)
  percentage!: number;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(10)
  grade?: string;

  @IsOptional()
  @IsString()
  remarks?: string;
}

export class UpdateProgressDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  module?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  percentage?: number;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(10)
  grade?: string;

  @IsOptional()
  @IsString()
  remarks?: string;
}

export class QueryProgressDto {
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
  studentId?: string;

  @IsOptional()
  @IsUUID()
  batchId?: string;
}

export class ProgressSummaryDto {
  @IsOptional()
  @IsUUID()
  studentId?: string;

  @IsOptional()
  @IsUUID()
  batchId?: string;
}

export class RecalculateProgressDto {
  @IsOptional()
  @IsUUID()
  studentId?: string;

  @IsOptional()
  @IsUUID()
  batchId?: string;
}
