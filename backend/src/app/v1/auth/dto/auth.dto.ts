import { IsEnum, IsOptional, IsString, IsEmail, IsBoolean, MinLength, IsIn } from 'class-validator';
import { IndustryType } from '@prisma/client';

export class RegisterDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(10)
  phone!: string;

  @IsString()
  @MinLength(2)
  businessName!: string;

  @IsEnum(IndustryType)
  industry!: string;

  @IsString()
  @MinLength(8)
  password!: string;
}

export class LoginDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsString()
  @IsIn(['email', 'phone'])
  type!: 'email' | 'phone';

  @IsOptional()
  @IsBoolean()
  rememberMe?: boolean;
}

export class RefreshTokenDto {
  @IsString()
  refreshToken!: string;
}

export class VerifyEmailDto {
  @IsString()
  token!: string;
}

export class UpdateUserStatusDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsString()
  status!: string;

  @IsString()
  accessToken!: string;
}

export class SendVerificationTokenDto {
  @IsEmail()
  email!: string;
}

