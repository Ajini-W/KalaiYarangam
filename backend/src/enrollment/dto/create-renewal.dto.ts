import { IsNotEmpty, IsUUID, IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateRenewalDto {
  @IsNotEmpty()
  @IsUUID()
  enrollmentId!: string;

  @IsNotEmpty()
  @IsUUID()
  tenantId!: string;         

  @IsNotEmpty()
  @IsDateString()
  currentEndDate!: string;   

  @IsNotEmpty()
  @IsDateString()
  extendedEndDate!: string;

  @IsOptional()
  @IsString()
  notes?: string;
}