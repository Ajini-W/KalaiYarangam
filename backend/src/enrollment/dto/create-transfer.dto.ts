import { IsNotEmpty, IsUUID, IsOptional, IsString } from 'class-validator';

export class CreateTransferDto {
  @IsNotEmpty()
  @IsUUID()
  enrollmentId!: string;

  @IsNotEmpty()
  @IsUUID()
  tenantId!: string;
  
  @IsNotEmpty()
  @IsUUID()
  fromBatchId!: string;
  
  @IsNotEmpty()
  @IsUUID()
  toBatchId!: string;

  @IsOptional()
  @IsString()
  reason?: string;
}