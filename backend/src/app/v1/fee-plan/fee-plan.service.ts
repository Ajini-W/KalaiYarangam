import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateFeePlanDto } from './dto/create-fee-plan.dto';
import { UpdateFeePlanDto } from './dto/update-fee-plan.dto';

@Injectable()
export class FeePlanService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateFeePlanDto) {
    return this.prisma.feePlan.create({
      data: {
        tenantId: dto.tenantId,
        courseId: dto.courseId,
        name: dto.name,
        feeType: dto.feeType as any,
        totalAmount: dto.totalAmount,
        currency: dto.currency ?? 'INR',
        installments: dto.installments ?? 1,
        durationMonths: dto.durationMonths,
      },
    });
  }

  async findAll() {
    return this.prisma.feePlan.findMany();
  }

  async findOne(id: string) {
    return this.prisma.feePlan.findUnique({
      where: { id },
    });
  }

  async update(id: string, dto: UpdateFeePlanDto) {
    return this.prisma.feePlan.update({
      where: { id },
      data: {
        tenantId: dto.tenantId,
        courseId: dto.courseId,
        name: dto.name,
        feeType: dto.feeType as any,
        totalAmount: dto.totalAmount,
        currency: dto.currency,
        installments: dto.installments,
        durationMonths: dto.durationMonths,
        isActive: dto.isActive,
      },
    });
  }

  async archive(id: string) {
    return this.prisma.feePlan.update({
      where: { id },
      data: {
        isActive: false,
      },
    });
  }

  async restore(id: string) {
    return this.prisma.feePlan.update({
      where: { id },
      data: {
        isActive: true,
      },
    });
  }

  async duplicate(id: string) {
    const feePlan = await this.prisma.feePlan.findUnique({
      where: { id },
    });

    if (!feePlan) {
      throw new Error('Fee Plan not found');
    }

    return this.prisma.feePlan.create({
      data: {
        tenantId: feePlan.tenantId,
        courseId: feePlan.courseId,
        name: feePlan.name + ' Copy',
        feeType: feePlan.feeType,
        totalAmount: feePlan.totalAmount,
        currency: feePlan.currency,
        installments: feePlan.installments,
        durationMonths: feePlan.durationMonths,
      },
    });
  }
}