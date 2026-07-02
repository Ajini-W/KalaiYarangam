import { IsInt, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class AddToWaitlistDto {
  @IsUUID()
  batchId!: string;

  @IsUUID()
  studentId!: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateWaitlistDto {
  @IsOptional()
  @IsString()
  remarks?: string;
}

export class QueryWaitlistDto {
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
  @IsUUID()
  studentId?: string;
}
