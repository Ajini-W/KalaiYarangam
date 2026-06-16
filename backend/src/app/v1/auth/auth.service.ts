import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '@/database';
import { AuthenticatedUser } from '@/common/interfaces';
import { LoginDto, RegisterDto } from './dto/auth.dto';

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
        industry: dto.industry,
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
          },
        },
      },
      include: { users: true },
    });

    const user = tenant.users[0];
    return this.buildAuthResponse(user);
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findFirst({
      where: { email: dto.email, isActive: true },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.buildAuthResponse(user);
  }

  me(user: AuthenticatedUser) {
    return user;
  }

  private buildAuthResponse(user: {
    id: string;
    tenantId: string;
    branchId: string | null;
    email: string;
    name: string;
    role: AuthenticatedUser['role'];
  }) {
    const payload: AuthenticatedUser = {
      id: user.id,
      tenantId: user.tenantId,
      branchId: user.branchId,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    return {
      user: payload,
      accessToken: this.jwtService.sign(payload),
    };
  }
}
