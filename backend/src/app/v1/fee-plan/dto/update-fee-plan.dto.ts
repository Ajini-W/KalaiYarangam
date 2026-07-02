import { IsString, IsOptional, IsNumber, IsInt, IsBoolean } from 'class-validator';

export class UpdateFeePlanDto {
  @IsOptional()
  @IsString()
  tenantId?: string;

  @IsOptional()
  @IsString()
  courseId?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  feeType?: string;

  @IsOptional()
  @IsNumber()
  totalAmount?: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsInt()
  installments?: number;

  @IsOptional()
  @IsInt()
  durationMonths?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}