import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { IndustryType, UserStatus } from '@prisma/client';
import { PrismaService } from '@/database';
import { AuthenticatedUser } from '@/common/interfaces';
import { env } from '@/config';
import { LoginDto, RegisterDto, RefreshTokenDto } from './dto/auth.dto';

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const slug = slugify(dto.businessName);
    const existing = await this.prisma.tenant.findUnique({ where: { slug } });

    if (existing) {
      throw new ConflictException('Business name is already registered');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const tenant = await this.prisma.tenant.create({
      data: {
        name: dto.businessName,
        slug,
        industry: dto.industry as IndustryType,
        branches: {
          create: { name: 'Main Branch', isDefault: true },
        },
        users: {
          create: {
            email: dto.email,
            passwordHash,
            name: dto.name,
            phone: dto.phone,
            role: 'OWNER',
            status: 'ACTIVE',
          },
        },
      },
      include: { users: true },
    });

    const user = (tenant as any).users[0];
    return { message: 'Registration successful', data: this.buildAuthResponse(user) };
  }

  async login(dto: LoginDto, ipAddress?: string, userAgent?: string) {
    const user = await this.prisma.user.findFirst({
      where: { email: dto.email, status: UserStatus.ACTIVE },
    });

    const valid = user ? await bcrypt.compare(dto.password, user.passwordHash) : false;

    if (!user || !valid) {
      // Log failed attempt
      await this.prisma.userLoginLog.create({
        data: {
          userId: user?.id ?? '00000000-0000-0000-0000-000000000000',
          ipAddress,
          userAgent,
          success: false,
        },
      });
      throw new UnauthorizedException('Invalid credentials');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const tokens = await this.generateTokens(user);

    // Log successful login with tokens
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

    return { message: 'Login successful', data: { user: this.toPayload(user), ...tokens } };
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

    if (stored.user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException('Account is inactive');
    }

    // Rotate: revoke old, issue new
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

  me(user: AuthenticatedUser) {
    return { message: 'User profile retrieved', data: user };
  }

  private async generateTokens(user: {
    id: string;
    tenantId: string | null;
    email: string;
    name: string;
    role: AuthenticatedUser['role'];
  }) {
    const payload = this.toPayload(user);

    const accessToken = this.jwtService.sign(payload);

    const refreshToken = this.jwtService.sign(
      { sub: user.id },
      { secret: env.JWT_REFRESH_SECRET, expiresIn: env.JWT_REFRESH_EXPIRES_IN as any },
    );

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.prisma.refreshToken.create({
      data: { userId: user.id, token: refreshToken, expiresAt },
    });

    return { accessToken, refreshToken };
  }

  private toPayload(user: {
    id: string;
    tenantId: string | null;
    email: string;
    name: string;
    role: AuthenticatedUser['role'];
  }): AuthenticatedUser {
    return {
      id: user.id,
      tenantId: user.tenantId ?? '',
      branchId: null,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }

  // Keep backward compat for register
  private buildAuthResponse(user: {
    id: string;
    tenantId: string | null;
    email: string;
    name: string;
    role: AuthenticatedUser['role'];
  }) {
    const payload = this.toPayload(user);
    return {
      user: payload,
      accessToken: this.jwtService.sign(payload),
    };
  }
}
