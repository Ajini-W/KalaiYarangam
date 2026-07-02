import { Injectable, NotFoundException, StreamableFile } from '@nestjs/common';
import { Response } from 'express';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { PrismaService } from '@/database';
import { AuthenticatedUser } from '@/common/interfaces';
import { paginate, paginationArgs } from '@/common/utils';
import { CreateFileDto, QueryFileDto } from './dto/files.dto';

@Injectable()
export class FilesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: AuthenticatedUser, dto: CreateFileDto) {
    if (!user.tenantId) {
      throw new NotFoundException('Tenant not found');
    }

    const record = await this.prisma.trainingFile.create({
      data: {
        tenantId: user.tenantId,
        originalName: dto.originalName,
        storagePath: dto.originalName,
        mimeType: dto.mimeType || null,
        size: dto.size || null,
        category: dto.category || null,
        uploadedBy: user.id,
      },
    });

    return { message: 'File record created successfully', data: record };
  }

  async findAll(user: AuthenticatedUser, query: QueryFileDto) {
    if (!user.tenantId) {
      throw new NotFoundException('Tenant not found');
    }

    const { skip, take, page, pageSize } = paginationArgs(query.page, query.pageSize);

    const where: Record<string, unknown> = { tenantId: user.tenantId };

    if (query.category) where.category = query.category;

    const [data, total] = await Promise.all([
      this.prisma.trainingFile.findMany({ where, skip, take, orderBy: { createdAt: 'desc' } }),
      this.prisma.trainingFile.count({ where }),
    ]);

    return paginate(data, total, page, pageSize);
  }

  async findOne(user: AuthenticatedUser, id: string) {
    if (!user.tenantId) {
      throw new NotFoundException('Tenant not found');
    }

    const file = await this.prisma.trainingFile.findFirst({
      where: { id, tenantId: user.tenantId },
    });

    if (!file) {
      throw new NotFoundException('File not found');
    }

    return { message: 'File fetched successfully', data: file };
  }

  async download(user: AuthenticatedUser, id: string, res: Response) {
    if (!user.tenantId) {
      throw new NotFoundException('Tenant not found');
    }

    const file = await this.prisma.trainingFile.findFirst({
      where: { id, tenantId: user.tenantId },
    });

    if (!file) {
      throw new NotFoundException('File not found');
    }

    if (file.storagePath && fs.existsSync(file.storagePath)) {
      const stream = fs.createReadStream(file.storagePath);
      res.set({
        'Content-Type': file.mimeType || 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${file.originalName}"`,
      });
      stream.pipe(res);
    } else {
      res.redirect(file.storagePath || '/');
    }
  }

  async archive(user: AuthenticatedUser, id: string) {
    if (!user.tenantId) {
      throw new NotFoundException('Tenant not found');
    }

    const file = await this.prisma.trainingFile.findFirst({
      where: { id, tenantId: user.tenantId },
    });

    if (!file) {
      throw new NotFoundException('File not found');
    }

    const updated = await this.prisma.trainingFile.update({
      where: { id },
      data: { isArchived: true },
    });

    return { message: 'File archived successfully', data: updated };
  }

  async restore(user: AuthenticatedUser, id: string) {
    if (!user.tenantId) {
      throw new NotFoundException('Tenant not found');
    }

    const file = await this.prisma.trainingFile.findFirst({
      where: { id, tenantId: user.tenantId },
    });

    if (!file) {
      throw new NotFoundException('File not found');
    }

    const updated = await this.prisma.trainingFile.update({
      where: { id },
      data: { isArchived: false },
    });

    return { message: 'File restored successfully', data: updated };
  }
}
