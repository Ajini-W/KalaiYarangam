import { IsArray, IsBoolean, IsDateString, IsEmail, IsEnum, IsNumber, IsObject, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { UserRole } from '@prisma/client';

export class SelectRoleDto {
  @IsEnum(UserRole)
  role!: UserRole;
}

export class ProfileSetupDto {
  @IsString()
  @MinLength(2)
  fullName!: string;

  @IsString()
  @MinLength(10)
  mobileNumber!: string;

  @IsOptional()
  @IsString()
  profilePhoto?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  timeZone?: string;

  @IsOptional()
  @IsString()
  preferredLanguage?: string;

  @IsOptional()
  @IsString()
  dateOfBirth?: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsString()
  parentContact?: string;

  @IsOptional()
  @IsString()
  companyName?: string;
}

export class TenantSetupDto {
  @IsString()
  @MinLength(2)
  businessName!: string;

  @IsString()
  businessType!: string;

  @IsOptional()
  @IsString()
  registrationNumber?: string;

  @IsOptional()
  @IsString()
  gstNumber?: string;

  @IsOptional()
  @IsString()
  logo?: string;

  @IsOptional()
  @IsString()
  @Matches(/^#[0-9A-Fa-f]{6}$/)
  primaryColor?: string;

  @IsOptional()
  @IsString()
  @Matches(/^#[0-9A-Fa-f]{6}$/)
  secondaryColor?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  pincode?: string;

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;
}

export class BranchSetupDto {
  @IsString()
  @MinLength(2)
  branchName!: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  contactNumber?: string;
}

export class ModuleSelectionDto {
  @IsBoolean()
  training!: boolean;

  @IsBoolean()
  rental!: boolean;

  @IsBoolean()
  event!: boolean;
}

export class SubscriptionSelectionDto {
  @IsString()
  plan!: string;
}

export class SearchTenantDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  businessType?: string;

  @IsOptional()
  @IsString()
  location?: string;
}

export class RequestAccessDto {
  @IsString()
  tenantId!: string;

  @IsOptional()
  @IsString()
  preferredBranchId?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];

  @IsOptional()
  @IsString()
  specialization?: string;

  @IsOptional()
  @IsString()
  courseId?: string;
}

export class ApproveAccessDto {
  @IsString()
  requestId!: string;

  @IsOptional()
  @IsString()
  branchId?: string;

  @IsOptional()
  @IsString()
  role?: UserRole;
}

export class RejectAccessDto {
  @IsString()
  requestId!: string;

  @IsOptional()
  @IsString()
  reason?: string;
}
