import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/database';
import { AuthenticatedUser } from '@/common/interfaces';
import { paginate, paginationArgs } from '@/common/utils';
import { CreateCertificateTemplateDto, UpdateCertificateTemplateDto, QueryCertificateTemplateDto } from './dto/certificate-template.dto';

@Injectable()
export class CertificateTemplateService {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: AuthenticatedUser, dto: CreateCertificateTemplateDto) {
    if (!user.tenantId) {
      throw new NotFoundException('Tenant not found');
    }

    const template = await this.prisma.certificateTemplate.create({
      data: {
        tenantId: user.tenantId,
        name: dto.name,
        htmlContent: dto.htmlContent,
        cssStyles: dto.cssStyles,
        orientation: dto.orientation ?? 'landscape',
        paperSize: dto.paperSize ?? 'A4',
        isDefault: dto.isDefault ?? false,
      },
    });

    return { message: 'Certificate template created successfully', data: template };
  }

  async findAll(user: AuthenticatedUser, query: QueryCertificateTemplateDto) {
    if (!user.tenantId) {
      throw new NotFoundException('Tenant not found');
    }

    const { skip, take, page, pageSize } = paginationArgs(query.page, query.pageSize);

    const where: Record<string, unknown> = { tenantId: user.tenantId };

    if (query.isActive !== undefined) {
      where.isActive = query.isActive;
    }

    const [data, total] = await Promise.all([
      this.prisma.certificateTemplate.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.certificateTemplate.count({ where }),
    ]);

    return paginate(data, total, page, pageSize);
  }

  async findOne(user: AuthenticatedUser, id: string) {
    if (!user.tenantId) {
      throw new NotFoundException('Tenant not found');
    }

    const template = await this.prisma.certificateTemplate.findFirst({
      where: { id, tenantId: user.tenantId },
    });

    if (!template) {
      throw new NotFoundException('Certificate template not found');
    }

    return { message: 'Certificate template retrieved successfully', data: template };
  }

  async update(user: AuthenticatedUser, id: string, dto: UpdateCertificateTemplateDto) {
    if (!user.tenantId) {
      throw new NotFoundException('Tenant not found');
    }

    const existing = await this.prisma.certificateTemplate.findFirst({
      where: { id, tenantId: user.tenantId },
    });

    if (!existing) {
      throw new NotFoundException('Certificate template not found');
    }

    const template = await this.prisma.certificateTemplate.update({
      where: { id },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.htmlContent !== undefined && { htmlContent: dto.htmlContent }),
        ...(dto.cssStyles !== undefined && { cssStyles: dto.cssStyles }),
        ...(dto.orientation !== undefined && { orientation: dto.orientation }),
        ...(dto.paperSize !== undefined && { paperSize: dto.paperSize }),
        ...(dto.isDefault !== undefined && { isDefault: dto.isDefault }),
        ...(dto.isActive !== undefined && { isActive: dto.isActive }),
      },
    });

    return { message: 'Certificate template updated successfully', data: template };
  }

  async remove(user: AuthenticatedUser, id: string) {
    if (!user.tenantId) {
      throw new NotFoundException('Tenant not found');
    }

    const existing = await this.prisma.certificateTemplate.findFirst({
      where: { id, tenantId: user.tenantId },
    });

    if (!existing) {
      throw new NotFoundException('Certificate template not found');
    }

    await this.prisma.certificateTemplate.update({
      where: { id },
      data: { isActive: false },
    });

    return { message: 'Certificate template deactivated successfully' };
  }
}
