import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateInvoiceDto, UpdateInvoiceDto } from './dto/invoice.dto';

@Injectable()
export class InvoiceService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateInvoiceDto) {
    return this.prisma.invoice.create({
      data: {
        tenantId: dto.tenantId,
        branchId: dto.branchId,
        studentId: dto.studentId,
        invoiceNumber: dto.invoiceNumber,
        description: dto.description,
        subtotal: dto.subtotal,
        discount: dto.discount ?? 0,
        tax: dto.tax ?? 0,
        totalAmount: dto.totalAmount,
        currency: dto.currency ?? 'INR',
        dueDate: dto.dueDate,
        notes: dto.notes,
      },
    });
  }

  async findAll() {
    return this.prisma.invoice.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id },
    });

    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    return invoice;
  }
  async send(id: string) {
  return this.prisma.invoice.update({
    where: { id },
    data: {
      status: 'SENT' as any,
    },
  });
}

async cancel(id: string) {
  return this.prisma.invoice.update({
    where: { id },
    data: {
      status: 'CANCELLED' as any,
    },
  });
}

async download(id: string) {
  return this.prisma.invoice.findUnique({
    where: { id },
  });
}
}