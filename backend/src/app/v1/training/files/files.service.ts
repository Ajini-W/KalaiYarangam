import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { extname, join } from 'path';
import { writeFile } from 'fs/promises';
import { PrismaService } from '@/database';
import { AuthenticatedUser } from '@/common/interfaces';
import { paginate, paginationArgs } from '@/common/utils';
import { QueryFileDto } from './dto/files.dto';

interface UploadedFile {
  originalname: string;
  filename: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

const UPLOAD_DIR = join(__dirname, '..', '..', '..', '..', '..', 'uploads', 'training');

@Injectable()
export class FilesService {
  constructor(private readonly prisma: PrismaService) {}

  async upload(user: AuthenticatedUser, file: UploadedFile, category?: string) {
    if (!user.tenantId) {
      throw new NotFoundException('Tenant not found');
    }

    const uniqueName = `${randomUUID()}${extname(file.originalname)}`;
    const filePath = join(UPLOAD_DIR, uniqueName);

    await writeFile(filePath, file.buffer);

    const record = await this.prisma.trainingFile.create({
      data: {
        tenantId: user.tenantId,
        originalName: file.originalname,
        storagePath: uniqueName,
        mimeType: file.mimetype,
        size: file.size,
        category: category || null,
        uploadedBy: user.id,
      },
    });

    return { message: 'File uploaded successfully', data: record };
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

  async serve(user: AuthenticatedUser, id: string) {
    if (!user.tenantId) {
      throw new NotFoundException('Tenant not found');
    }

    const file = await this.prisma.trainingFile.findFirst({
      where: { id, tenantId: user.tenantId },
    });

    if (!file) {
      throw new NotFoundException('File not found');
    }

    return { path: join(UPLOAD_DIR, file.storagePath) };
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
