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
import { PrismaService } from '@/database';
import { MailService } from '@/app/v1/mail/mail.service';
import { env } from '@/config';
import { UserRole, UserStatus } from '@prisma/client';
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
async googleLogin(req: any, ip?: string, userAgent?: string) {
  const googleUser = req.user;

  if (!googleUser?.email) {
    throw new UnauthorizedException('Google login failed');
  }

  let user = await this.prisma.user.findUnique({
    where: { email: googleUser.email },
  });

  if (!user) {
    user = await this.prisma.user.create({
      data: {
        email: googleUser.email,
        name: googleUser.name ?? 'Google User',
        passwordHash: '', // required by Prisma
        status: UserStatus.ACTIVE,
      },
    });
  }

  const accessToken = this.jwtService.sign({ sub: user.id });
  const refreshToken = this.jwtService.sign(
    { sub: user.id },
    { expiresIn: '7d' },
  );

  return { accessToken, refreshToken };
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

  // ================= SEND VERIFY TOKEN =================
  async sendVerificationToken(dto: SendVerificationTokenDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) throw new NotFoundException();

    const token = randomBytes(32).toString('hex');

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        verificationToken: token,
        verificationTokenExpiresAt: new Date(Date.now() + 86400000),
      },
    });

    return { message: 'Verification sent' };
  }

  // ================= USER PROFILE METHODS =================
  me(user: AuthenticatedUser) {
    return user;
  }

  async getProfile(userId: string) {
    return this.prisma.user.findUnique({ where: { id: userId } });
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

  private toPayload(user: any): AuthenticatedUser {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      tenantId: user.tenantId ?? '',
      branchId: user.branchId ?? null,
      status: user.status,
      emailVerified: user.emailVerified ?? false,
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