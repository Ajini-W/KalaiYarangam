import { IsNotEmpty, IsUUID, IsOptional, IsString } from 'class-validator';

export class CreateEnrollmentDto {
  @IsNotEmpty()
  @IsUUID()
  studentId!: string;

  @IsNotEmpty()
  @IsUUID()
  batchId!: string;

  @IsNotEmpty()
  @IsUUID()
  tenantId!: string;

  @IsOptional()
  @IsUUID()
  feePlanId?: string;

  @IsOptional()
  @IsString()
  remarks?: string;
}