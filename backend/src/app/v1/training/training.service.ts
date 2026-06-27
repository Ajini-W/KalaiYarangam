import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IndustryType } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '@/database';
import { AuthenticatedUser } from '@/common/interfaces';
import { paginate, paginationArgs } from '@/common/utils';
import { ClaimTenantDto, CreateBranchDto, CreateStudentDto, CreateTenantDto, QueryPaginationDto, UpdateBranchDto, UpdateBranchStatusDto, UpdateBrandingDto, UpdateModulesDto, UpdateTenantDto, UpdateTenantSettingsDto } from './dto/training.dto';

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function toPayload(user: { id: string; tenantId: string | null; email: string; name: string; role: string }) {
  return { id: user.id, tenantId: user.tenantId ?? '', branchId: null, email: user.email, name: user.name, role: user.role };
}

@Injectable()
export class TrainingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async findStudents(user: AuthenticatedUser, query: QueryPaginationDto) {
    const { skip, take, page, pageSize } = paginationArgs(query.page, query.pageSize);
    const where = { tenantId: user.tenantId };

    const [data, total] = await Promise.all([
      this.prisma.student.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: { enrollments: { include: { batch: { select: { id: true, name: true } } } } },
      }),
      this.prisma.student.count({ where }),
    ]);

    return paginate(data, total, page, pageSize);
  }

  createStudent(user: AuthenticatedUser, dto: CreateStudentDto) {
    return this.prisma.student.create({
      data: {
        tenantId: user.tenantId,
        name: dto.name,
        phone: dto.phone,
        ...(dto.email ? { email: dto.email } : {}),
      },
    });
  }

  async createTenant(dto: CreateTenantDto) {
    const slug = slugify(dto.businessName);
    const existing = await this.prisma.tenant.findUnique({ where: { slug } });

    if (existing) {
      throw new ConflictException('Business name is already registered');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const tenant = await this.prisma.$transaction(async (tx) => {
      const t = await tx.tenant.create({
        data: {
          name: dto.businessName,
          slug,
          ...(dto.industry ? { industry: dto.industry as IndustryType } : {}),
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
        include: { users: true, branches: true },
      });

      const user = t.users[0];
      const branch = t.branches[0];

      await tx.userRoleMapping.create({
        data: { userId: user.id, role: 'OWNER', tenantId: t.id },
      });

      await tx.userBranch.create({
        data: { userId: user.id, branchId: branch.id, isPrimary: true },
      });

      return t;
    });

    return { message: 'Tenant created successfully', data: { id: tenant.id, name: tenant.name, slug: tenant.slug } };
  }

  async claimTenant(user: AuthenticatedUser, dto: ClaimTenantDto) {
    if (user.tenantId) {
      // Only link the user if they don't already have a tenant
      const existingTenant = await this.prisma.tenant.findUnique({ where: { id: user.tenantId } });
      if (existingTenant) {
        throw new ConflictException('User already belongs to a tenant');
      }
    }

    const slug = slugify(dto.businessName);
    const existing = await this.prisma.tenant.findUnique({ where: { slug } });

    if (existing) {
      throw new ConflictException('Business name is already registered');
    }

    const result = await this.prisma.$transaction(async (tx) => {
      const t = await tx.tenant.create({
        data: {
          name: dto.businessName,
          slug,
          ...(dto.industry ? { industry: dto.industry as IndustryType } : {}),
          ...(dto.phone ? { phone: dto.phone } : {}),
          ...(dto.email ? { email: dto.email } : {}),
          branches: {
            create: { name: 'Main Branch', isDefault: true },
          },
        },
        include: { branches: true },
      });

      const branch = t.branches[0];

      await tx.user.update({
        where: { id: user.id },
        data: {
          tenantId: t.id,
          role: 'OWNER',
          status: 'ACTIVE',
        },
      });

      await tx.userRoleMapping.create({
        data: { userId: user.id, role: 'OWNER', tenantId: t.id },
      });

      await tx.userBranch.create({
        data: { userId: user.id, branchId: branch.id, isPrimary: true },
      });

      const defaultSettings = [
        { key: 'timezone', value: 'Asia/Kolkata' },
        { key: 'dateFormat', value: 'DD/MM/YYYY' },
        { key: 'currency', value: 'INR' },
        { key: 'language', value: 'en' },
        { key: 'timeFormat', value: '12h' },
        { key: 'weekStartDay', value: 'monday' },
      ];

      await tx.tenantSetting.createMany({
        data: defaultSettings.map((s) => ({ tenantId: t.id, ...s })),
      });

      const defaultModules = [
        { key: 'module_trainingManagement', value: 'true' },
        { key: 'module_rentalManagement', value: 'false' },
        { key: 'module_eventManagement', value: 'false' },
      ];

      await tx.tenantSetting.createMany({
        data: defaultModules.map((m) => ({ tenantId: t.id, ...m })),
      });

      return { tenant: t, branch };
    });

    const updatedUser = await this.prisma.user.findUnique({
      where: { id: user.id },
      select: { id: true, tenantId: true, email: true, name: true, role: true },
    });

    const payload = toPayload(updatedUser!);
    const accessToken = this.jwtService.sign(payload);

    return {
      message: 'Tenant created successfully',
      data: {
        token: { accessToken, user: payload },
        tenant: { id: result.tenant.id, name: result.tenant.name, slug: result.tenant.slug, industry: result.tenant.industry },
        branch: { id: result.branch.id, name: result.branch.name, isDefault: result.branch.isDefault },
      },
    };
  }

  async completeOnboarding(dto: CreateTenantDto) {
    const slug = slugify(dto.businessName);
    const existing = await this.prisma.tenant.findUnique({ where: { slug } });

    if (existing) {
      throw new ConflictException('Business name is already registered');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const result = await this.prisma.$transaction(async (tx) => {
      const t = await tx.tenant.create({
        data: {
          name: dto.businessName,
          slug,
          ...(dto.industry ? { industry: dto.industry as IndustryType } : {}),
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
        include: { users: true, branches: true },
      });

      const user = t.users[0];
      const branch = t.branches[0];

      await tx.userRoleMapping.create({
        data: { userId: user.id, role: 'OWNER', tenantId: t.id },
      });

      await tx.userBranch.create({
        data: { userId: user.id, branchId: branch.id, isPrimary: true },
      });

      const defaultSettings = [
        { key: 'timezone', value: 'Asia/Kolkata' },
        { key: 'dateFormat', value: 'DD/MM/YYYY' },
        { key: 'currency', value: 'INR' },
        { key: 'language', value: 'en' },
        { key: 'timeFormat', value: '12h' },
        { key: 'weekStartDay', value: 'monday' },
      ];

      await tx.tenantSetting.createMany({
        data: defaultSettings.map((s) => ({ tenantId: t.id, ...s })),
      });

      const defaultModules = [
        { key: 'module_trainingManagement', value: 'true' },
        { key: 'module_rentalManagement', value: 'false' },
        { key: 'module_eventManagement', value: 'false' },
      ];

      await tx.tenantSetting.createMany({
        data: defaultModules.map((m) => ({ tenantId: t.id, ...m })),
      });

      return { tenant: t, user, branch };
    });

    const payload = toPayload(result.user);
    const accessToken = this.jwtService.sign(payload);

    const settings = await this.prisma.tenantSetting.findMany({
      where: { tenantId: result.tenant.id, key: { in: ['timezone', 'dateFormat', 'currency', 'language', 'timeFormat', 'weekStartDay'] } },
    });

    const settingsData = settings.reduce<Record<string, string>>((acc, s) => {
      acc[s.key] = s.value;
      return acc;
    }, {});

    const moduleSettings = await this.prisma.tenantSetting.findMany({
      where: { tenantId: result.tenant.id, key: { startsWith: 'module_' } },
    });

    const modulesData = { trainingManagement: false, rentalManagement: false, eventManagement: false };
    for (const s of moduleSettings) {
      const k = s.key.replace('module_', '') as keyof typeof modulesData;
      if (k in modulesData) modulesData[k] = s.value === 'true';
    }

    return {
      message: 'Onboarding completed successfully',
      data: {
        token: { accessToken, user: payload },
        tenant: { id: result.tenant.id, name: result.tenant.name, slug: result.tenant.slug, industry: result.tenant.industry },
        branch: { id: result.branch.id, name: result.branch.name, isDefault: result.branch.isDefault },
        settings: settingsData,
        modules: modulesData,
      },
    };
  }

  async getTenant(user: AuthenticatedUser) {
    if (!user.tenantId) {
      throw new NotFoundException('Tenant not found');
    }

    const tenant = await this.prisma.tenant.findUnique({ where: { id: user.tenantId } });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    return { message: 'Tenant retrieved successfully', data: tenant };
  }

  async updateTenant(user: AuthenticatedUser, dto: UpdateTenantDto) {
    if (!user.tenantId) {
      throw new NotFoundException('Tenant not found');
    }

    const tenant = await this.prisma.tenant.update({
      where: { id: user.tenantId },
      data: {
        ...(dto.name ? { name: dto.name } : {}),
        ...(dto.phone ? { phone: dto.phone } : {}),
        ...(dto.email ? { email: dto.email } : {}),
        ...(dto.website ? { website: dto.website } : {}),
        ...(dto.logoUrl ? { logoUrl: dto.logoUrl } : {}),
        ...(dto.industry ? { industry: dto.industry as IndustryType } : {}),
      },
    });

    return { message: 'Tenant updated successfully', data: tenant };
  }

  async createBranch(user: AuthenticatedUser, dto: CreateBranchDto) {
    if (!user.tenantId) {
      throw new NotFoundException('Tenant not found');
    }

    const data = await this.prisma.branch.create({
      data: {
        tenantId: user.tenantId,
        ...dto,
      },
    });

    return { message: 'Branch created successfully', data };
  }

  async findBranches(user: AuthenticatedUser, query: QueryPaginationDto) {
    if (!user.tenantId) {
      throw new NotFoundException('Tenant not found');
    }

    const where = { tenantId: user.tenantId };
    const { skip, take, page, pageSize } = paginationArgs(query.page, query.pageSize);

    const [data, total] = await Promise.all([
      this.prisma.branch.findMany({ where, skip, take, orderBy: { createdAt: 'desc' } }),
      this.prisma.branch.count({ where }),
    ]);

    return paginate(data, total, page, pageSize);
  }

  async findOneBranch(user: AuthenticatedUser, id: string) {
    if (!user.tenantId) {
      throw new NotFoundException('Tenant not found');
    }

    const branch = await this.prisma.branch.findFirst({
      where: { id, tenantId: user.tenantId },
    });

    if (!branch) {
      throw new NotFoundException('Branch not found');
    }

    return { message: 'Branch retrieved successfully', data: branch };
  }

  async updateBranch(user: AuthenticatedUser, id: string, dto: UpdateBranchDto) {
    if (!user.tenantId) {
      throw new NotFoundException('Tenant not found');
    }

    const branch = await this.prisma.branch.findFirst({
      where: { id, tenantId: user.tenantId },
    });

    if (!branch) {
      throw new NotFoundException('Branch not found');
    }

    const data = await this.prisma.branch.update({
      where: { id },
      data: dto,
    });

    return { message: 'Branch updated successfully', data };
  }

  async updateBranchStatus(user: AuthenticatedUser, id: string, dto: UpdateBranchStatusDto) {
    if (!user.tenantId) {
      throw new NotFoundException('Tenant not found');
    }

    const branch = await this.prisma.branch.findFirst({
      where: { id, tenantId: user.tenantId },
    });

    if (!branch) {
      throw new NotFoundException('Branch not found');
    }

    const data = await this.prisma.branch.update({
      where: { id },
      data: { isActive: dto.isActive },
    });

    return { message: `Branch ${dto.isActive ? 'activated' : 'deactivated'} successfully`, data };
  }

  async getTenantSettings(user: AuthenticatedUser) {
    if (!user.tenantId) {
      throw new NotFoundException('Tenant not found');
    }

    const settings = await this.prisma.tenantSetting.findMany({
      where: { tenantId: user.tenantId },
    });

    const data = settings.reduce<Record<string, string>>((acc, s) => {
      acc[s.key] = s.value;
      return acc;
    }, {});

    return { message: 'Settings retrieved successfully', data };
  }

  async createTenantSettings(user: AuthenticatedUser, dto: UpdateTenantSettingsDto) {
    if (!user.tenantId) {
      throw new NotFoundException('Tenant not found');
    }

    const entries = Object.entries(dto).filter(
      (entry): entry is [string, string] => entry[1] !== undefined,
    );

    await Promise.all(
      entries.map(([key, value]) =>
        this.prisma.tenantSetting.upsert({
          where: {
            tenantId_key: { tenantId: user.tenantId, key },
          },
          update: { value },
          create: { tenantId: user.tenantId, key, value },
        }),
      ),
    );

    const settings = await this.prisma.tenantSetting.findMany({
      where: { tenantId: user.tenantId },
    });

    const data = settings.reduce<Record<string, string>>((acc, s) => {
      acc[s.key] = s.value;
      return acc;
    }, {});

    return { message: 'Settings created successfully', data };
  }

  async updateTenantSettings(user: AuthenticatedUser, dto: UpdateTenantSettingsDto) {
    if (!user.tenantId) {
      throw new NotFoundException('Tenant not found');
    }

    const entries = Object.entries(dto).filter(
      (entry): entry is [string, string] => entry[1] !== undefined,
    );

    await Promise.all(
      entries.map(([key, value]) =>
        this.prisma.tenantSetting.upsert({
          where: {
            tenantId_key: { tenantId: user.tenantId, key },
          },
          update: { value },
          create: { tenantId: user.tenantId, key, value },
        }),
      ),
    );

    const settings = await this.prisma.tenantSetting.findMany({
      where: { tenantId: user.tenantId },
    });

    const data = settings.reduce<Record<string, string>>((acc, s) => {
      acc[s.key] = s.value;
      return acc;
    }, {});

    return { message: 'Settings updated successfully', data };
  }

  async getBranding(user: AuthenticatedUser) {
    if (!user.tenantId) {
      throw new NotFoundException('Tenant not found');
    }

    const [tenantBrand, tenant] = await Promise.all([
      this.prisma.tenantBrand.findUnique({ where: { tenantId: user.tenantId } }),
      this.prisma.tenant.findUnique({
        where: { id: user.tenantId },
        select: { logoUrl: true },
      }),
    ]);

    const data = {
      logoUrl: tenant?.logoUrl ?? null,
      primaryColor: tenantBrand?.primaryColor ?? null,
      secondaryColor: tenantBrand?.secondaryColor ?? null,
      tagline: tenantBrand?.tagline ?? null,
    };

    return { message: 'Branding retrieved successfully', data };
  }

  async updateBranding(user: AuthenticatedUser, dto: UpdateBrandingDto) {
    if (!user.tenantId) {
      throw new NotFoundException('Tenant not found');
    }

    const { logoUrl, ...brandFields } = dto;

    const entries = Object.entries(brandFields).filter(
      (entry): entry is [string, string] => entry[1] !== undefined,
    );

    if (logoUrl !== undefined) {
      await this.prisma.tenant.update({
        where: { id: user.tenantId },
        data: { logoUrl },
      });
    }

    if (entries.length > 0) {
      const brandData = entries.reduce<Record<string, string>>((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});

      await this.prisma.tenantBrand.upsert({
        where: { tenantId: user.tenantId },
        update: brandData,
        create: { tenantId: user.tenantId, ...brandData },
      });
    }

    const [tenantBrand, tenant] = await Promise.all([
      this.prisma.tenantBrand.findUnique({ where: { tenantId: user.tenantId } }),
      this.prisma.tenant.findUnique({
        where: { id: user.tenantId },
        select: { logoUrl: true },
      }),
    ]);

    const data = {
      logoUrl: tenant?.logoUrl ?? null,
      primaryColor: tenantBrand?.primaryColor ?? null,
      secondaryColor: tenantBrand?.secondaryColor ?? null,
      tagline: tenantBrand?.tagline ?? null,
    };

    return { message: 'Branding updated successfully', data };
  }

  async getModules(user: AuthenticatedUser) {
    if (!user.tenantId) {
      throw new NotFoundException('Tenant not found');
    }

    const settings = await this.prisma.tenantSetting.findMany({
      where: { tenantId: user.tenantId, key: { startsWith: 'module_' } },
    });

    const data = {
      trainingManagement: false,
      rentalManagement: false,
      eventManagement: false,
    };

    for (const s of settings) {
      const moduleKey = s.key.replace('module_', '') as keyof typeof data;
      if (moduleKey in data) {
        data[moduleKey] = s.value === 'true';
      }
    }

    return { message: 'Modules retrieved successfully', data };
  }

  async updateModules(user: AuthenticatedUser, dto: UpdateModulesDto) {
    if (!user.tenantId) {
      throw new NotFoundException('Tenant not found');
    }

    const entries = Object.entries(dto).filter(
      (entry): entry is [string, boolean] => entry[1] !== undefined,
    );

    await Promise.all(
      entries.map(([key, value]) =>
        this.prisma.tenantSetting.upsert({
          where: {
            tenantId_key: { tenantId: user.tenantId, key: `module_${key}` },
          },
          update: { value: String(value) },
          create: { tenantId: user.tenantId, key: `module_${key}`, value: String(value) },
        }),
      ),
    );

    const settings = await this.prisma.tenantSetting.findMany({
      where: { tenantId: user.tenantId, key: { startsWith: 'module_' } },
    });

    const data = {
      trainingManagement: false,
      rentalManagement: false,
      eventManagement: false,
    };

    for (const s of settings) {
      const moduleKey = s.key.replace('module_', '') as keyof typeof data;
      if (moduleKey in data) {
        data[moduleKey] = s.value === 'true';
      }
    }

    return { message: 'Modules updated successfully', data };
  }
}
