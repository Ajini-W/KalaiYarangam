import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  GoneException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { env } from '@/config';
import { AuditAction, AuthProviderType, UserRole, UserStatus } from '@prisma/client';

import { PrismaService } from '@/database';
import { MailService } from '@/app/v1/mail/mail.service';


import { AuditService } from '@/app/v1/security/audit.service';

import { AuthenticatedUser } from '@/common/interfaces';
import { AuthErrorLogDto } from './dto/auth.dto';

import {
  LoginDto,
  RegisterDto,
  RefreshTokenDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  ChangePasswordDto,
  VerifyEmailDto,
  SendVerificationTokenDto,
  UpdateProfileDto,
  UpdateUserStatusDto,
} from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly auditService: AuditService,
  ) {}

  // ================= REGISTER =================
  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existing) throw new ConflictException('Email already exists');

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const token = randomBytes(32).toString('hex');

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        name: dto.name,
        phone: dto.phone,
        role: UserRole.STAFF,
        status: UserStatus.NEW_USER,
        verificationToken: token,
        verificationTokenExpiresAt: new Date(Date.now() + 86400000),
        passwordSet: true,
      },
    });

    await this.mailService.send({
      to: dto.email,
      template: 'verify-email',
      variables: {
        name: dto.name,
        verificationLink: `${env.APP_URL}/verify-email?token=${token}`,
      },
    });

    return this.buildAuthResponse(user);
  }
  async me(user: AuthenticatedUser) {
  return this.toPayload(user);
}
async getProfile(userId: string) {
  return this.prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
}

  // ================= VERIFY EMAIL =================
 async verifyEmail(dto: VerifyEmailDto) {
  const user = await this.prisma.user.findFirst({
    where: { verificationToken: dto.token },
  });

  if (!user) {
    throw new BadRequestException('Invalid verification token');
  }

  if (
    !user.verificationTokenExpiresAt ||
    user.verificationTokenExpiresAt < new Date()
  ) {
    throw new GoneException('Verification token expired');
  }

  await this.prisma.user.update({
    where: { id: user.id },
    data: {
      status: UserStatus.ACTIVE,
      verifiedAt: new Date(),
      verificationToken: null,
      verificationTokenExpiresAt: null,
    },
  });

  return { message: 'Email verified successfully' };
}

  // ================= LOGIN =================
  async login(dto: LoginDto, ip?: string, userAgent?: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) throw new UnauthorizedException('Invalid credentials');

    if (user.status !== UserStatus.ACTIVE) {
      throw new ForbiddenException('Verify email first');
    }

    const ok = await bcrypt.compare(dto.password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

   const tokens = await this.generateTokens(user);

const response = {
  user: this.toPayload(user),
  ...tokens,
};

console.log('LOGIN RESPONSE:', response);

return response;
   
  }async logout(refreshToken: string) {
  const token = await this.prisma.refreshToken.findUnique({
    where: { token: refreshToken },
  });

  if (!token) throw new UnauthorizedException('Invalid token');

  await this.prisma.refreshToken.update({
    where: { id: token.id },
    data: { revokedAt: new Date() },
  });

  return { message: 'Logged out' };
}


 


  // ================= REFRESH =================
  async refresh(dto: RefreshTokenDto) {
    const stored = await this.prisma.refreshToken.findUnique({
      where: { token: dto.refreshToken },
      include: { user: true },
    });

    if (!stored || stored.revokedAt) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const tokens = await this.generateTokens(stored.user);

    await this.prisma.refreshToken.update({
      where: { id: stored.id },
      data: { revokedAt: new Date() },
    });

    return {
      user: this.toPayload(stored.user),
      ...tokens,
    };
  }

  // ================= FORGOT PASSWORD =================
  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) return { message: 'If exists, email sent' };

    const token = randomBytes(32).toString('hex');

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: token,
        resetPasswordExpiresAt: new Date(Date.now() + 3600000),
      },
    });

    await this.mailService.send({
      to: dto.email,
      template: 'reset-password',
      variables: {
        resetLink: `${env.APP_URL}/reset-password?token=${token}`,
      },
    });

    return { message: 'Reset email sent' };
  }async sendVerificationToken(dto: SendVerificationTokenDto) {
  const user = await this.prisma.user.findUnique({
    where: { email: dto.email },
  });

  if (!user) {
    throw new NotFoundException('User not found');
  }

  const token = randomBytes(32).toString('hex');

  await this.prisma.user.update({
    where: { id: user.id },
    data: {
      verificationToken: token,
      verificationTokenExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  });

  await this.mailService.send({
    to: user.email,
    template: 'verify-email',
    variables: {
      name: user.name,
      verificationLink: `${env.APP_URL}/verify-email?token=${token}`,
    },
  });

  return {
    message: 'Verification email sent',
  };
}

  // ================= RESET PASSWORD =================
  async resetPassword(dto: ResetPasswordDto) {
    const user = await this.prisma.user.findFirst({
      where: { resetPasswordToken: dto.token },
    });

    if (!user) throw new BadRequestException('Invalid token');

    const hash = await bcrypt.hash(dto.password, 10);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: hash,
        resetPasswordToken: null,
        resetPasswordExpiresAt: null,
      },
    });

    return { message: 'Password reset successful' };
  }

  // ================= CHANGE PASSWORD =================
  async changePassword(dto: ChangePasswordDto, userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) throw new NotFoundException();

    const ok = await bcrypt.compare(dto.currentPassword, user.passwordHash);
    if (!ok) throw new UnauthorizedException();

    const hash = await bcrypt.hash(dto.newPassword, 10);

    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash: hash },
    });

    return { message: 'Password changed' };
  }
  async setPassword(dto: { newPassword: string }, userId: string) {
  const user = await this.prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) throw new NotFoundException('User not found');

  const hash = await bcrypt.hash(dto.newPassword, 10);

  await this.prisma.user.update({
    where: { id: userId },
    data: {
      passwordHash: hash,
      passwordSet: true,
    },
  });

  return { message: 'Password set successfully' };
}


  


  async updateProfile(userId: string, dto: UpdateProfileDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data: dto,
    });

  }

  async getPreferences(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    return user?.preferences ?? {};
  }

  async updatePreferences(userId: string, preferences: any) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { preferences },
    });
  }

  async updateUserStatus(dto: UpdateUserStatusDto) {
    return this.prisma.user.update({
      where: { id: dto.userId },
      data: { status: dto.status as UserStatus },
    });
  }

 async logAuthError(dto: AuthErrorLogDto) {
  return this.prisma.authErrorLog.create({
    data: {
      errorCode: dto.errorCode,
      errorMessage: dto.errorMessage,
      provider: dto.provider,
      userId: dto.userId,
      metadata: dto.metadata ? JSON.parse(JSON.stringify(dto.metadata)) : {}
    },
  });
}

  // ================= TOKENS =================
  private async generateTokens(user: any) {
    const payload = this.toPayload(user);

    const accessToken = this.jwtService.sign(payload, {
      secret: env.JWT_SECRET,
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(
      { sub: user.id },
      {
        secret: env.JWT_REFRESH_SECRET,
        expiresIn: '7d',
      },
    );

    return { accessToken, refreshToken };
  }


  async googleLogin(req: any, ipAddress?: string, userAgent?: string) {
    if (!req.user) {
      throw new UnauthorizedException('No user from google');
    }

    const googleUser = req.user;

    // Try to find user by Google provider ID first (linking support)
    let user = await this.prisma.user.findFirst({
      where: {
        authProviders: {
          some: {
            provider: AuthProviderType.GOOGLE,
            providerId: googleUser.id,
          },
        },
      },
    });

    // If no user found by provider ID, try by email
    if (!user) {
      user = await this.prisma.user.findFirst({
        where: { email: googleUser.email },
      });
    }

    const now = new Date();

    if (!user) {
      // Create new user from Google OAuth
      user = await this.prisma.$transaction(async (tx) => {
        const u = await tx.user.create({
          data: {
            email: googleUser.email,
            passwordHash: await bcrypt.hash(Math.random().toString(36).slice(-8), 10),
            name: googleUser.firstName
              ? `${googleUser.firstName} ${googleUser.lastName || ''}`.trim()
              : googleUser.email,
            role: 'STAFF',
            status: UserStatus.REGISTERED,
            verifiedAt: now,
          },
        });

        await tx.authProvider.create({
          data: {
            userId: u.id,
            provider: AuthProviderType.GOOGLE,
            providerId: googleUser.id,
            email: googleUser.email,
          },
        });

        await tx.onboardingProgress.create({
          data: { userId: u.id },
        });

        return u;
      });
    } else {
      // Existing user — link Google provider if not already linked
      const existingGoogleProvider = await this.prisma.authProvider.findUnique({
        where: { userId_provider: { userId: user.id, provider: AuthProviderType.GOOGLE } },
      });

      if (!existingGoogleProvider) {
        await this.prisma.authProvider.create({
          data: {
            userId: user.id,
            provider: AuthProviderType.GOOGLE,
            providerId: googleUser.id,
            email: googleUser.email,
          },
        });
      }

      // If user registered via email but not verified, mark verified
      if (user.status === UserStatus.NEW_USER || user.status === UserStatus.PENDING) {
        user = await this.prisma.user.update({
          where: { id: user.id },
          data: {
            status: user.status === UserStatus.NEW_USER ? UserStatus.NEW_USER : UserStatus.REGISTERED,
            verifiedAt: user.verifiedAt ?? now,
            verificationToken: null,
            verificationTokenExpiresAt: null,
          },
        });
      } else if (
        user.status !== UserStatus.ACTIVE &&
        user.status !== UserStatus.REGISTERED &&
        user.status !== UserStatus.PROFILE_COMPLETED &&
        user.status !== UserStatus.ACCESS_REQUESTED &&
        user.status !== UserStatus.PENDING_APPROVAL &&
        user.status !== UserStatus.APPROVED
      ) {
        throw new UnauthorizedException('Account is inactive or suspended');
      }
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: now },
    });

    const tokens = await this.generateTokens({
      ...user,
      role: user.role as AuthenticatedUser['role']
    });

    await this.prisma.userLoginLog.create({
      data: {
        userId: user.id,
        ipAddress,
        userAgent,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        success: true,
      },
    });

    return { message: 'Google login successful', data: { user: this.toPayload(user as any), ...tokens } };
  }

  private toPayload(user: {
    id: string;
    tenantId: string | null;
    email: string;
    name: string;
    role: AuthenticatedUser['role'];
    status?: string;
    tenantName?: string | null;
  }) {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,

      status: user.status ?? '',
      emailVerified: user.status !== 'NEW_USER' && user.status !== 'PENDING',
      tenantName: user.tenantName ?? null,

    };
  }

  private async buildAuthResponse(user: any) {
    const tokens = await this.generateTokens(user);
    return {
      user: this.toPayload(user),
      ...tokens,
    };
  }
}