import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { LeadStatus } from '@prisma/client';
import { PrismaService } from '@/database';
import { AuthenticatedUser } from '@/common/interfaces';
import { paginate, paginationArgs } from '@/common/utils';
import {
  CreateLeadDto, UpdateLeadDto, QueryLeadDto,
  CreateFollowupDto, UpdateFollowupDto,
  AssignLeadDto, ConvertLeadDto, BulkAssignDto, BulkActionDto,
} from './dto/lead.dto';

@Injectable()
export class LeadService {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: AuthenticatedUser, dto: CreateLeadDto) {
    const data = await this.prisma.lead.create({
      data: {
        tenantId: user.tenantId,
        branchId: dto.branchId || user.branchId,
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        course: dto.course,
        source: dto.source ?? 'WALK_IN',
        status: dto.status ?? 'NEW',
        notes: dto.notes,
        assignedTo: dto.assignedTo,
        nextFollowUp: dto.nextFollowUp ? new Date(dto.nextFollowUp) : null,
      },
      include: { branch: { select: { id: true, name: true } } },
    });
    return { message: 'Lead created successfully', data };
  }

  async findAll(user: AuthenticatedUser, query: QueryLeadDto) {
    const { skip, take, page, pageSize } = paginationArgs(query.page, query.pageSize);
    const where: any = { tenantId: user.tenantId };

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { phone: { contains: query.search } },
        { email: { contains: query.search, mode: 'insensitive' } },
        { course: { contains: query.search, mode: 'insensitive' } },
      ];
    }
    if (query.status) where.status = query.status;
    if (query.source) where.source = query.source;
    if (query.branchId) where.branchId = query.branchId;
    if (query.assignedTo) where.assignedTo = query.assignedTo;

    const orderBy: any = {};
    if (query.sortBy) {
      orderBy[query.sortBy] = query.sortDir ?? 'desc';
    } else {
      orderBy.createdAt = 'desc';
    }

    const [data, total] = await Promise.all([
      this.prisma.lead.findMany({
        where,
        skip,
        take,
        orderBy,
        include: {
          branch: { select: { id: true, name: true } },
          _count: { select: { followups: true } },
        },
      }),
      this.prisma.lead.count({ where }),
    ]);

    return paginate(data, total, page, pageSize);
  }

  async findOne(user: AuthenticatedUser, id: string) {
    const lead = await this.prisma.lead.findFirst({
      where: { id, tenantId: user.tenantId },
      include: {
        branch: { select: { id: true, name: true } },
        followups: {
          orderBy: { createdAt: 'desc' },
          include: { user: { select: { id: true, name: true } } },
        },
        _count: { select: { followups: true } },
      },
    });

    if (!lead) throw new NotFoundException('Lead not found');
    return { message: 'Lead retrieved successfully', data: lead };
  }

  async update(user: AuthenticatedUser, id: string, dto: UpdateLeadDto) {
    const existing = await this.prisma.lead.findFirst({
      where: { id, tenantId: user.tenantId },
    });
    if (!existing) throw new NotFoundException('Lead not found');

    const data = await this.prisma.lead.update({
      where: { id },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.email !== undefined && { email: dto.email }),
        ...(dto.phone !== undefined && { phone: dto.phone }),
        ...(dto.course !== undefined && { course: dto.course }),
        ...(dto.branchId !== undefined && { branchId: dto.branchId }),
        ...(dto.source !== undefined && { source: dto.source }),
        ...(dto.status !== undefined && { status: dto.status }),
        ...(dto.notes !== undefined && { notes: dto.notes }),
        ...(dto.assignedTo !== undefined && { assignedTo: dto.assignedTo }),
        ...(dto.nextFollowUp !== undefined && { nextFollowUp: dto.nextFollowUp ? new Date(dto.nextFollowUp) : null }),
      },
    });
    return { message: 'Lead updated successfully', data };
  }

  async remove(user: AuthenticatedUser, id: string) {
    const existing = await this.prisma.lead.findFirst({
      where: { id, tenantId: user.tenantId },
    });
    if (!existing) throw new NotFoundException('Lead not found');

    await this.prisma.lead.delete({ where: { id } });
    return { message: 'Lead deleted successfully', data: null };
  }

  async getStats(user: AuthenticatedUser) {
    const where = { tenantId: user.tenantId };

    const [total, newLeads, contacted, followedUp, interested, demoScheduled, converted, lost] = await Promise.all([
      this.prisma.lead.count({ where }),
      this.prisma.lead.count({ where: { ...where, status: 'NEW' } }),
      this.prisma.lead.count({ where: { ...where, status: 'CONTACTED' } }),
      this.prisma.lead.count({ where: { ...where, status: 'FOLLOWUP' } }),
      this.prisma.lead.count({ where: { ...where, status: 'INTERESTED' } }),
      this.prisma.lead.count({ where: { ...where, status: 'DEMO_SCHEDULED' } }),
      this.prisma.lead.count({ where: { ...where, status: 'CONVERTED' } }),
      this.prisma.lead.count({ where: { ...where, status: 'LOST' } }),
    ]);

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const [todayFollowups, pendingFollowups] = await Promise.all([
      this.prisma.leadFollowup.count({
        where: { lead: { tenantId: user.tenantId }, createdAt: { gte: todayStart, lte: todayEnd } },
      }),
      this.prisma.lead.count({
        where: { ...where, nextFollowUp: { not: null, lte: todayEnd }, status: { notIn: ['CONVERTED', 'LOST'] } },
      }),
    ]);

    const conversionRate = total > 0 ? Math.round((converted / total) * 100) : 0;

    return {
      message: 'Lead stats retrieved successfully',
      data: { total, new: newLeads, contacted: contacted + followedUp + interested + demoScheduled, converted, lost, todayFollowups, pendingFollowups, conversionRate },
    };
  }

  async assignCounsellor(user: AuthenticatedUser, id: string, dto: AssignLeadDto) {
    const existing = await this.prisma.lead.findFirst({
      where: { id, tenantId: user.tenantId },
    });
    if (!existing) throw new NotFoundException('Lead not found');

    const data = await this.prisma.lead.update({
      where: { id },
      data: { assignedTo: dto.assignedTo },
    });
    return { message: 'Lead assigned successfully', data };
  }

  async bulkAssign(user: AuthenticatedUser, dto: BulkAssignDto) {
    await this.prisma.lead.updateMany({
      where: { id: { in: dto.leadIds }, tenantId: user.tenantId },
      data: { assignedTo: dto.assignedTo },
    });
    return { message: `${dto.leadIds.length} leads assigned successfully`, data: null };
  }

  async archive(user: AuthenticatedUser, id: string) {
    const existing = await this.prisma.lead.findFirst({
      where: { id, tenantId: user.tenantId },
    });
    if (!existing) throw new NotFoundException('Lead not found');

    const data = await this.prisma.lead.update({
      where: { id },
      data: { status: 'LOST' },
    });
    return { message: 'Lead archived successfully', data };
  }

  async restore(user: AuthenticatedUser, id: string) {
    const existing = await this.prisma.lead.findFirst({
      where: { id, tenantId: user.tenantId, status: 'LOST' },
    });
    if (!existing) throw new NotFoundException('Archived lead not found');

    const data = await this.prisma.lead.update({
      where: { id },
      data: { status: 'NEW' },
    });
    return { message: 'Lead restored successfully', data };
  }

  /* ─── Followups ─────────────────────────────────────────── */

  async createFollowup(user: AuthenticatedUser, leadId: string, dto: CreateFollowupDto) {
    const lead = await this.prisma.lead.findFirst({
      where: { id: leadId, tenantId: user.tenantId },
    });
    if (!lead) throw new NotFoundException('Lead not found');

    const data = await this.prisma.leadFollowup.create({
      data: {
        leadId,
        userId: user.id,
        notes: dto.notes,
        outcome: dto.outcome,
        nextDate: dto.nextDate ? new Date(dto.nextDate) : null,
        contactedVia: dto.contactedVia,
      },
      include: { user: { select: { id: true, name: true } } },
    });

    if (dto.nextDate) {
      await this.prisma.lead.update({
        where: { id: leadId },
        data: { nextFollowUp: new Date(dto.nextDate) },
      });
    }

    return { message: 'Followup created successfully', data };
  }

  async findFollowups(user: AuthenticatedUser, leadId: string) {
    const lead = await this.prisma.lead.findFirst({
      where: { id: leadId, tenantId: user.tenantId },
    });
    if (!lead) throw new NotFoundException('Lead not found');

    const data = await this.prisma.leadFollowup.findMany({
      where: { leadId },
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { id: true, name: true } } },
    });
    return { message: 'Followups retrieved successfully', data };
  }

  async updateFollowup(user: AuthenticatedUser, id: string, dto: UpdateFollowupDto) {
    const existing = await this.prisma.leadFollowup.findUnique({
      where: { id },
      include: { lead: { select: { tenantId: true } } },
    });
    if (!existing || existing.lead.tenantId !== user.tenantId) {
      throw new NotFoundException('Followup not found');
    }

    const data = await this.prisma.leadFollowup.update({
      where: { id },
      data: {
        ...(dto.notes !== undefined && { notes: dto.notes }),
        ...(dto.outcome !== undefined && { outcome: dto.outcome }),
        ...(dto.nextDate !== undefined && { nextDate: dto.nextDate ? new Date(dto.nextDate) : null }),
        ...(dto.contactedVia !== undefined && { contactedVia: dto.contactedVia }),
      },
    });
    return { message: 'Followup updated successfully', data };
  }

  async removeFollowup(user: AuthenticatedUser, id: string) {
    const existing = await this.prisma.leadFollowup.findUnique({
      where: { id },
      include: { lead: { select: { tenantId: true } } },
    });
    if (!existing || existing.lead.tenantId !== user.tenantId) {
      throw new NotFoundException('Followup not found');
    }

    await this.prisma.leadFollowup.delete({ where: { id } });
    return { message: 'Followup deleted successfully', data: null };
  }

  /* ─── Conversion ────────────────────────────────────────── */

  async convert(user: AuthenticatedUser, id: string, dto: ConvertLeadDto) {
    const lead = await this.prisma.lead.findFirst({
      where: { id, tenantId: user.tenantId },
    });
    if (!lead) throw new NotFoundException('Lead not found');
    if (lead.status === 'CONVERTED') throw new BadRequestException('Lead is already converted');

    const student = await this.prisma.student.create({
      data: {
        tenantId: user.tenantId,
        name: dto.studentName || lead.name,
        phone: dto.studentPhone || lead.phone,
        email: dto.studentEmail || lead.email,
      },
    });

    if (dto.batchId) {
      await this.prisma.enrollment.create({
        data: {
          tenantId: user.tenantId,
          studentId: student.id,
          batchId: dto.batchId,
        },
      });
    }

    await this.prisma.lead.update({
      where: { id },
      data: {
        status: 'CONVERTED',
        convertedAt: new Date(),
        convertedToStudentId: student.id,
      },
    });

    return { message: 'Lead converted successfully', data: { lead: { ...lead, status: 'CONVERTED', convertedToStudentId: student.id }, student } };
  }

  async getStudentsList(user: AuthenticatedUser, query: { search?: string; page?: number; pageSize?: number }) {
    const { skip, take, page, pageSize } = paginationArgs(query.page, query.pageSize);
    const where: any = { tenantId: user.tenantId };

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { phone: { contains: query.search } },
        { email: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.student.findMany({ where, skip, take, orderBy: { createdAt: 'desc' } }),
      this.prisma.student.count({ where }),
    ]);

    return paginate(data, total, page, pageSize);
  }
}
