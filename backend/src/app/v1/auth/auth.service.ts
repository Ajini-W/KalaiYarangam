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
import { AuditAction, AuthProviderType, UserRole, UserStatus } from '@prisma/client';
import { PrismaService } from '@/database';
import { env } from '@/config';
import { MailService } from '@/app/v1/mail/mail.service';
import { AuditService } from '@/app/v1/security/audit.service';
import { AuthenticatedUser } from '@/common/interfaces';
import {
  ChangePasswordDto,
  ForgotPasswordDto,
  LoginDto,
  RegisterDto,
  RefreshTokenDto,
  ResetPasswordDto,
  SendVerificationTokenDto,
  UpdateProfileDto,
  UpdateUserStatusDto,
  VerifyEmailDto,
} from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly auditService: AuditService,
  ) {}

  async register(dto: RegisterDto) {
    const [existingEmailUser, existingPhoneUser] = await Promise.all([
      this.prisma.user.findUnique({ where: { email: dto.email } }),
      dto.phone
        ? this.prisma.user.findUnique({ where: { phone: dto.phone } })
        : null,
    ]);

    if (existingPhoneUser && existingPhoneUser.email !== dto.email) {
      throw new ConflictException('A user with this phone number already exists');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const verificationToken = randomBytes(32).toString('hex');
    const verificationTokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // If user already exists (e.g. from Google OAuth), link the account
    if (existingEmailUser) {
      // Check if email/password provider already linked
      const existingProvider = await this.prisma.authProvider.findUnique({
        where: { userId_provider: { userId: existingEmailUser.id, provider: AuthProviderType.EMAIL } },
      });

      if (!existingProvider) {
        await this.prisma.authProvider.create({
          data: { userId: existingEmailUser.id, provider: AuthProviderType.EMAIL, email: dto.email },
        });
      }

      const updated = await this.prisma.user.update({
        where: { id: existingEmailUser.id },
        data: {
          passwordHash,
          passwordSet: true,
          name: dto.name,
          phone: dto.phone || existingEmailUser.phone,
          verificationToken,
          verificationTokenExpiresAt,
          status: existingEmailUser.status === UserStatus.ACTIVE
            ? UserStatus.ACTIVE
            : UserStatus.NEW_USER,
        },
      });

      try {
        await this.mailService.send({
          to: dto.email,
          template: 'verify-email',
          variables: {
            name: dto.name,
            email: dto.email,
            verificationLink: `${env.APP_URL}/verify-email?token=${verificationToken}`,
          },
        });
      } catch {
        // Email failure should not block registration
      }

      return {
        message: 'Registration successful. Please check your email to verify your account.',
        data: await this.buildAuthResponse(updated),
      };
    }

    const user = await this.prisma.$transaction(async (tx) => {
      const u = await tx.user.create({
        data: {
          email: dto.email,
          passwordHash,
          passwordSet: true,
          name: dto.name,
          phone: dto.phone,
          role: UserRole.STAFF,
          status: UserStatus.NEW_USER,
          verificationToken,
          verificationTokenExpiresAt,
        },
      });

      await tx.authProvider.create({
        data: { userId: u.id, provider: AuthProviderType.EMAIL, email: dto.email },
      });

      await tx.onboardingProgress.create({
        data: { userId: u.id },
      });

      return u;
    });

    try {
      await this.mailService.send({
        to: dto.email,
        template: 'verify-email',
        variables: {
          name: dto.name,
          email: dto.email,
          verificationLink: `${env.APP_URL}/verify-email?token=${verificationToken}`,
        },
      });
    } catch {
      // Email failure should not block registration
    }

    return {
      message: 'Registration successful. Please check your email to verify your account.',
      data: await this.buildAuthResponse(user),
    };
  }

  async verifyEmail(dto: VerifyEmailDto) {
    const user = await this.prisma.user.findUnique({
      where: { verificationToken: dto.token },
    });

    if (!user) {
      throw new BadRequestException('Invalid verification token');
    }

    if (user.status === UserStatus.ACTIVE) {
      throw new BadRequestException('Email is already verified');
    }

    if (
      user.verificationTokenExpiresAt &&
      user.verificationTokenExpiresAt < new Date()
    ) {
      throw new GoneException('Verification token expired');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        status: UserStatus.REGISTERED,
        verificationToken: null,
        verificationTokenExpiresAt: null,
        verifiedAt: new Date(),
      },
    });

    return { message: 'Email verified successfully', data: { emailVerified: true } };
  }

  async sendVerificationToken(dto: SendVerificationTokenDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new NotFoundException('User not found with this email');
    }

    if (user.status === UserStatus.ACTIVE) {
      throw new BadRequestException('Email is already verified');
    }

    const verificationToken = randomBytes(32).toString('hex');
    const verificationTokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { verificationToken, verificationTokenExpiresAt },
    });

    try {
      await this.mailService.send({
        to: dto.email,
        template: 'verify-email',
        variables: {
          name: user.name,
          email: dto.email,
          verificationLink: `${env.APP_URL}/verify-email?token=${verificationToken}`,
        },
      });
    } catch {
      // Email failure should not block the response
    }

    return { message: 'Verification email sent. Please check your inbox.' };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new NotFoundException('User not found with this email');
    }

    const resetToken = randomBytes(32).toString('hex');
    const resetPasswordExpiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await this.prisma.user.update({
      where: { id: user.id },
      data: { resetPasswordToken: resetToken, resetPasswordExpiresAt },
    });

    try {
      await this.mailService.send({
        to: dto.email,
        template: 'reset-password',
        variables: {
          name: user.name,
          email: dto.email,
          resetLink: `${env.APP_URL}/reset-password?token=${resetToken}`,
        },
      });
    } catch {
      // Email failure should not block the response
    }

    return { message: 'Password reset link sent to your email.' };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const user = await this.prisma.user.findFirst({
      where: { resetPasswordToken: dto.token },
    });

    if (!user) {
      throw new BadRequestException('Invalid reset token');
    }

    if (
      user.resetPasswordExpiresAt &&
      user.resetPasswordExpiresAt < new Date()
    ) {
      throw new GoneException('Reset token expired');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        passwordSet: true,
        resetPasswordToken: null,
        resetPasswordExpiresAt: null,
      },
    });

    return { message: 'Password reset successfully.' };
  }

  async changePassword(dto: ChangePasswordDto, userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const valid = await bcrypt.compare(dto.currentPassword, user.passwordHash);

    if (!valid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    const passwordHash = await bcrypt.hash(dto.newPassword, 10);

    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash, passwordSet: true },
    });

    return { message: 'Password changed successfully.' };
  }

  async setPassword(dto: { newPassword: string }, userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.passwordSet) {
      throw new BadRequestException('Password already set. Use change-password instead.');
    }

    const passwordHash = await bcrypt.hash(dto.newPassword, 10);

    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash, passwordSet: true },
    });

    return { message: 'Password set successfully.' };
  }

  async login(dto: LoginDto, ipAddress?: string, userAgent?: string) {
    const user = await this.prisma.user.findFirst({
      where:
        dto.type === 'phone' && dto.phone
          ? { phone: dto.phone }
          : { email: dto.email },
      include: { tenant: { select: { name: true } } },
    });

    if (!user) {
      const field = dto.type === 'phone' ? 'phone number' : 'email';
      throw new UnauthorizedException(`User not found with this ${field}. Please check or register.`);
    }

    if (user.status === UserStatus.INACTIVE || user.status === UserStatus.SUSPENDED) {
      throw new UnauthorizedException('Account is inactive or suspended. Please contact support.');
    }

    const valid = await bcrypt.compare(dto.password, user.passwordHash);

    if (!valid) {
      await this.prisma.userLoginLog.create({
        data: { userId: user.id, ipAddress, userAgent, success: false },
      });
      throw new UnauthorizedException('Invalid password');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const tokens = await this.generateTokens(user, dto.rememberMe);

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

    await this.auditService.log({
      userId: user.id,
      tenantId: user.tenantId ?? undefined,
      action: AuditAction.LOGIN,
      entity: 'User',
      entityId: user.id,
      ipAddress,
      userAgent,
    });

    // Determine if onboarding is needed
    const onboardingStep = await this.prisma.onboardingProgress.findUnique({
      where: { userId: user.id },
      select: { currentStep: true, isCompleted: true },
    });

    const needsOnboarding = user.role !== UserRole.CLIENT
      && (!onboardingStep?.isCompleted)
      && !['APPROVED', 'ACTIVE'].includes(user.status);

    return {
      message: 'Login successful',
      data: {
        user: this.toPayload({ ...user, tenantName: user.tenant?.name ?? null }),
        ...tokens,
        rememberMe: dto.rememberMe ?? false,
        isFirstLogin: user.lastLoginAt === null,
        onboardingRequired: needsOnboarding,
        currentOnboardingStep: onboardingStep?.currentStep ?? null,
      },
    };
  }

  async logout(refreshToken: string) {
    const storedToken = await this.prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    });

    if (!storedToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (storedToken.revokedAt) {
      throw new UnauthorizedException('Token is already revoked');
    }

    await this.prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { revokedAt: new Date() },
    });

    await this.auditService.log({
      userId: storedToken.userId,
      action: AuditAction.LOGOUT,
      entity: 'RefreshToken',
      entityId: storedToken.id,
    });

    return { message: 'Logged out successfully' };
  }

  async refresh(dto: RefreshTokenDto) {
    const stored = await this.prisma.refreshToken.findUnique({
      where: { token: dto.refreshToken },
      include: { user: true },
    });

    if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const allowedRefreshStatuses: string[] = [
      UserStatus.ACTIVE, UserStatus.ACCESS_REQUESTED, UserStatus.APPROVED,
      UserStatus.REGISTERED, UserStatus.PROFILE_COMPLETED, UserStatus.PENDING_APPROVAL,
    ];
    if (!allowedRefreshStatuses.includes(stored.user.status)) {
      throw new UnauthorizedException('Account is inactive');
    }

    await this.prisma.refreshToken.update({
      where: { id: stored.id },
      data: { revokedAt: new Date() },
    });

    const tokens = await this.generateTokens(stored.user);

    return {
      message: 'Token refreshed',
      data: { user: this.toPayload(stored.user), ...tokens },
    };
  }

  async updateUserStatus(dto: UpdateUserStatusDto) {
    let adminUser: AuthenticatedUser;
    try {
      adminUser = this.jwtService.verify(dto.accessToken);
    } catch {
      throw new UnauthorizedException('Invalid or expired accessToken');
    }

    if (
      adminUser.role !== UserRole.OWNER &&
      adminUser.role !== UserRole.SUPER_ADMIN
    ) {
      throw new ForbiddenException('Forbidden resource');
    }

    const targetId = dto.userId || adminUser.id;
    const target = await this.prisma.user.findUnique({ where: { id: targetId } });

    if (!target) {
      throw new NotFoundException('User not found');
    }

    if (adminUser.role !== UserRole.SUPER_ADMIN && target.tenantId !== adminUser.tenantId) {
      throw new ForbiddenException('You can only manage users in your own tenant');
    }

    const status = dto.status as UserStatus;

    const updated = await this.prisma.user.update({
      where: { id: targetId },
      data: { status },
      select: { id: true, email: true, name: true, role: true, status: true },
    });

    return { message: `User status updated to ${status}`, data: updated };
  }

  async me(user: AuthenticatedUser) {
    if (!user?.id) throw new NotFoundException('User not found');
    const u = await this.prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true, tenantId: true, email: true, name: true, role: true,
        status: true, verifiedAt: true, phone: true, avatarUrl: true,
        tenant: { select: { name: true } },
      },
    });
    if (!u) throw new NotFoundException('User not found');

    const progress = await this.prisma.onboardingProgress.findUnique({
      where: { userId: user.id },
      select: { currentStep: true, isCompleted: true },
    });

    const needsOnboarding = u.role !== UserRole.CLIENT
      && (!progress?.isCompleted)
      && !['APPROVED', 'ACTIVE'].includes(u.status);

    return {
      message: 'User profile retrieved',
      data: {
        id: u.id,
        tenantId: u.tenantId ?? '',
        branchId: user.branchId,
        email: u.email,
        name: u.name,
        role: u.role,
        status: u.status,
        emailVerified: !!u.verifiedAt,
        phone: u.phone,
        avatarUrl: u.avatarUrl,
        tenantName: u.tenant?.name ?? null,
        onboardingRequired: needsOnboarding,
        currentOnboardingStep: progress?.currentStep ?? null,
      },
    };
  }

  async getPreferences(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { preferences: true },
    });
    if (!user) throw new NotFoundException('User not found');
    return {
      message: 'Preferences retrieved',
      data: (user.preferences as Record<string, unknown>) ?? {},
    };
  }

  async updatePreferences(userId: string, preferences: Record<string, unknown>) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { preferences: true },
    });
    if (!user) throw new NotFoundException('User not found');

    const merged = { ...((user.preferences as Record<string, unknown>) ?? {}), ...preferences };
    await this.prisma.user.update({
      where: { id: userId },
      data: { preferences: merged as any },
    });

    return { message: 'Preferences updated', data: merged };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      message: 'Profile retrieved',
      data: {
        id: user.id,
        tenantId: user.tenantId,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role,
        status: user.status,
        avatarUrl: user.avatarUrl,
        lastLoginAt: user.lastLoginAt,
        createdAt: user.createdAt,
        hasPassword: user.passwordSet,
        preferences: user.preferences as Record<string, unknown> | null,
        profile: user.profile
          ? {
              dateOfBirth: user.profile.dateOfBirth?.toISOString().split('T')[0],
              gender: user.profile.gender,
              addressLine1: user.profile.addressLine1,
              addressLine2: user.profile.addressLine2,
              city: user.profile.city,
              state: user.profile.state,
              pincode: user.profile.pincode,
              emergencyName: user.profile.emergencyName,
              emergencyPhone: user.profile.emergencyPhone,
              bio: user.profile.bio,
            }
          : null,
      },
    };
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Update User-level fields
    const userUpdate: Record<string, unknown> = {};
    if (dto.name !== undefined) userUpdate.name = dto.name;
    if (dto.phone !== undefined) userUpdate.phone = dto.phone;
    if (dto.avatarUrl !== undefined) userUpdate.avatarUrl = dto.avatarUrl;

    if (Object.keys(userUpdate).length > 0) {
      await this.prisma.user.update({
        where: { id: userId },
        data: userUpdate,
      });
    }

    // Update UserProfile-level fields — upsert
    const profileUpdate: Record<string, unknown> = {};
    if (dto.dateOfBirth !== undefined) profileUpdate.dateOfBirth = dto.dateOfBirth ? new Date(dto.dateOfBirth) : null;
    if (dto.gender !== undefined) profileUpdate.gender = dto.gender;
    if (dto.addressLine1 !== undefined) profileUpdate.addressLine1 = dto.addressLine1;
    if (dto.addressLine2 !== undefined) profileUpdate.addressLine2 = dto.addressLine2;
    if (dto.city !== undefined) profileUpdate.city = dto.city;
    if (dto.state !== undefined) profileUpdate.state = dto.state;
    if (dto.pincode !== undefined) profileUpdate.pincode = dto.pincode;
    if (dto.emergencyName !== undefined) profileUpdate.emergencyName = dto.emergencyName;
    if (dto.emergencyPhone !== undefined) profileUpdate.emergencyPhone = dto.emergencyPhone;
    if (dto.bio !== undefined) profileUpdate.bio = dto.bio;

    if (Object.keys(profileUpdate).length > 0) {
      await this.prisma.userProfile.upsert({
        where: { userId },
        create: { userId, ...profileUpdate } as any,
        update: profileUpdate,
      });
    }

    return this.getProfile(userId);
  }

  private async generateTokens(user: {
    id: string;
    tenantId: string | null;
    email: string;
    name: string;
    role: AuthenticatedUser['role'];
    status?: string;
  }, rememberMe?: boolean) {
    const payload = this.toPayload(user);

    const accessToken = this.jwtService.sign(payload);

    const refreshExpiresIn = rememberMe ? '30d' : env.JWT_REFRESH_EXPIRES_IN;
    const refreshToken = this.jwtService.sign(
      { sub: user.id },
      { secret: env.JWT_REFRESH_SECRET, expiresIn: refreshExpiresIn as any },
    );

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + (rememberMe ? 30 : 7));

    await this.prisma.refreshToken.create({
      data: { userId: user.id, token: refreshToken, expiresAt },
    });

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
      tenantId: user.tenantId ?? '',
      branchId: null,
      email: user.email,
      name: user.name,
      role: user.role,
      status: user.status ?? '',
      emailVerified: user.status !== 'NEW_USER' && user.status !== 'PENDING',
      tenantName: user.tenantName ?? null,
    };
  }

  async logAuthError(errorCode: string, errorMessage: string, provider?: string, userId?: string, metadata: Record<string, unknown> = {}) {
    await this.prisma.authErrorLog.create({
      data: {
        errorCode,
        errorMessage,
        provider,
        userId,
        metadata: metadata as any,
      },
    });
  }

  private async buildAuthResponse(user: {
    id: string;
    tenantId: string | null;
    email: string;
    name: string;
    role: AuthenticatedUser['role'];
    status: string;
  }) {
    const tokens = await this.generateTokens(user);
    return {
      user: this.toPayload(user),
      ...tokens,
    };
  }
}

