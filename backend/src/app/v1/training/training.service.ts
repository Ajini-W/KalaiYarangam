import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { IndustryType } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '@/database';
import { AuthenticatedUser } from '@/common/interfaces';
import { paginate, paginationArgs } from '@/common/utils';
import { CreateBatchDto, CreateBranchDto, CreateStudentDto, CreateTenantDto, QueryPaginationDto, UpdateBranchDto, UpdateBranchStatusDto, UpdateBrandingDto, UpdateModulesDto, UpdateTenantDto, UpdateTenantSettingsDto } from './dto/training.dto';

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

@Injectable()
export class TrainingService {
  constructor(private readonly prisma: PrismaService) {}

  async findBatches(user: AuthenticatedUser, query: QueryPaginationDto) {
    const { skip, take, page, pageSize } = paginationArgs(query.page, query.pageSize);
    const where = { tenantId: user.tenantId };

    const [data, total] = await Promise.all([
      this.prisma.batch.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: { _count: { select: { enrollments: true } } },
      }),
      this.prisma.batch.count({ where }),
    ]);

    return paginate(data, total, page, pageSize);
  }

  createBatch(user: AuthenticatedUser, dto: CreateBatchDto) {
    return this.prisma.batch.create({
      data: {
        tenantId: user.tenantId,
        name: dto.name,
        capacity: dto.capacity ?? 30,
      },
    });
  }

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

  async getTenant(user: AuthenticatedUser) {
    const tenant = await this.prisma.tenant.findUnique({ where: { id: user.tenantId } });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    return { message: 'Tenant retrieved successfully', data: tenant };
  }

  async updateTenant(user: AuthenticatedUser, dto: UpdateTenantDto) {
    const tenant = await this.prisma.tenant.update({
      where: { id: user.tenantId },
      data: {
        ...(dto.name ? { name: dto.name } : {}),
        ...(dto.phone ? { phone: dto.phone } : {}),
        ...(dto.email ? { email: dto.email } : {}),
        ...(dto.website ? { website: dto.website } : {}),
        ...(dto.logoUrl ? { logoUrl: dto.logoUrl } : {}),
      },
    });

    return { message: 'Tenant updated successfully', data: tenant };
  }

  async createBranch(user: AuthenticatedUser, dto: CreateBranchDto) {
    const data = await this.prisma.branch.create({
      data: {
        tenantId: user.tenantId,
        ...dto,
      },
    });

    return { message: 'Branch created successfully', data };
  }

  async findBranches(user: AuthenticatedUser, query: QueryPaginationDto) {
    const where = { tenantId: user.tenantId };
    const { skip, take, page, pageSize } = paginationArgs(query.page, query.pageSize);

    const [data, total] = await Promise.all([
      this.prisma.branch.findMany({ where, skip, take, orderBy: { createdAt: 'desc' } }),
      this.prisma.branch.count({ where }),
    ]);

    return paginate(data, total, page, pageSize);
  }

  async findOneBranch(user: AuthenticatedUser, id: string) {
    const branch = await this.prisma.branch.findFirst({
      where: { id, tenantId: user.tenantId },
    });

    if (!branch) {
      throw new NotFoundException('Branch not found');
    }

    return { message: 'Branch retrieved successfully', data: branch };
  }

  async updateBranch(user: AuthenticatedUser, id: string, dto: UpdateBranchDto) {
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
    const [tenantBrand, tenant] = await Promise.all([
      this.prisma.tenantBrand.findUnique({ where: { tenantId: user.tenantId } }),
      this.prisma.tenant.findUnique({
        where: { id: user.tenantId },
        select: { logoUrl: true },
      }),
    ]);

    const data = {
      logoUrl: tenant?.logoUrl ?? null,
      faviconUrl: tenantBrand?.faviconUrl ?? null,
      primaryColor: tenantBrand?.primaryColor ?? null,
      secondaryColor: tenantBrand?.secondaryColor ?? null,
      tagline: tenantBrand?.tagline ?? null,
      customDomain: tenantBrand?.customDomain ?? null,
    };

    return { message: 'Branding retrieved successfully', data };
  }

  async updateBranding(user: AuthenticatedUser, dto: UpdateBrandingDto) {
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
      faviconUrl: tenantBrand?.faviconUrl ?? null,
      primaryColor: tenantBrand?.primaryColor ?? null,
      secondaryColor: tenantBrand?.secondaryColor ?? null,
      tagline: tenantBrand?.tagline ?? null,
      customDomain: tenantBrand?.customDomain ?? null,
    };

    return { message: 'Branding updated successfully', data };
  }

  async getModules(user: AuthenticatedUser) {
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
