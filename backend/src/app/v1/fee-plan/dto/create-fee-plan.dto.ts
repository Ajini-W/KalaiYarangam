import { IsString, IsNumber, IsOptional, IsInt } from 'class-validator';

export class CreateFeePlanDto {
  @IsString()
  tenantId!: string;

  @IsOptional()
  @IsString()
  courseId?: string;

  @IsString()
  name!: string;

  @IsString()
  feeType!: string;

  @IsNumber()
  totalAmount!: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsInt()
  installments?: number;

  @IsOptional()
  @IsInt()
  durationMonths?: number;
}