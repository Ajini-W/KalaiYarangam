import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/database';
import { AuthenticatedUser } from '@/common/interfaces';
import { paginate, paginationArgs } from '@/common/utils';
import { SubmissionStatus } from '@prisma/client';
import { CreateTaskDto, QueryTaskDto, SubmitTaskDto, UpdateSubmissionDto, UpdateTaskDto } from './dto/tasks.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: AuthenticatedUser, dto: CreateTaskDto) {
    if (!user.tenantId) {
      throw new NotFoundException('Tenant not found');
    }

    const batch = await this.prisma.batch.findFirst({
      where: { id: dto.batchId, tenantId: user.tenantId },
    });
    if (!batch) {
      throw new NotFoundException('Batch not found');
    }

    const task = await this.prisma.task.create({
      data: {
        tenantId: user.tenantId,
        batchId: dto.batchId,
        createdBy: user.id,
        title: dto.title,
        description: dto.description,
        type: dto.type,
        dueDate: dto.dueDate,
        maxScore: dto.maxScore,
        allowLateSubmission: dto.allowLateSubmission ?? false,
      },
    });

    return { message: 'Task created successfully', data: task };
  }

  async findAll(user: AuthenticatedUser, query: QueryTaskDto) {
    if (!user.tenantId) {
      throw new NotFoundException('Tenant not found');
    }

    const { skip, take, page, pageSize } = paginationArgs(query.page, query.pageSize);

    const where: Record<string, unknown> = {
      tenantId: user.tenantId,
      isArchived: false,
    };

    if (query.batchId) where.batchId = query.batchId;
    if (query.status) where.status = query.status;
    if (query.type) where.type = query.type;

    const [data, total] = await Promise.all([
      this.prisma.task.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: { _count: { select: { submissions: true } } },
      }),
      this.prisma.task.count({ where }),
    ]);

    return paginate(data, total, page, pageSize);
  }

  async findOne(user: AuthenticatedUser, id: string) {
    if (!user.tenantId) {
      throw new NotFoundException('Tenant not found');
    }

    const task = await this.prisma.task.findFirst({
      where: { id, tenantId: user.tenantId },
    });
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    const statusCounts = await this.prisma.studentTaskSubmission.groupBy({
      by: ['status'],
      where: { taskId: id },
      _count: true,
    });

    const submissionStatusCounts: Record<string, number> = {};
    let submissionCount = 0;
    for (const sc of statusCounts) {
      submissionStatusCounts[sc.status] = sc._count;
      submissionCount += sc._count;
    }

    return {
      message: 'Task retrieved successfully',
      data: {
        ...task,
        submissionCount,
        submissionStatusCounts,
      },
    };
  }

  async update(user: AuthenticatedUser, id: string, dto: UpdateTaskDto) {
    if (!user.tenantId) {
      throw new NotFoundException('Tenant not found');
    }

    const task = await this.prisma.task.findFirst({
      where: { id, tenantId: user.tenantId },
    });
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    if (task.status === 'CANCELLED') {
      throw new BadRequestException('Cannot update a cancelled task');
    }

    const updated = await this.prisma.task.update({
      where: { id },
      data: {
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.type !== undefined && { type: dto.type }),
        ...(dto.dueDate !== undefined && { dueDate: dto.dueDate }),
        ...(dto.maxScore !== undefined && { maxScore: dto.maxScore }),
        ...(dto.allowLateSubmission !== undefined && { allowLateSubmission: dto.allowLateSubmission }),
      },
    });

    return { message: 'Task updated successfully', data: updated };
  }

  async archive(user: AuthenticatedUser, id: string) {
    if (!user.tenantId) {
      throw new NotFoundException('Tenant not found');
    }

    const task = await this.prisma.task.findFirst({
      where: { id, tenantId: user.tenantId },
    });
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    if (task.isArchived) {
      throw new BadRequestException('Task is already archived');
    }

    const updated = await this.prisma.task.update({
      where: { id },
      data: { isArchived: true },
    });

    return { message: 'Task archived successfully', data: updated };
  }

  async restore(user: AuthenticatedUser, id: string) {
    if (!user.tenantId) {
      throw new NotFoundException('Tenant not found');
    }

    const task = await this.prisma.task.findFirst({
      where: { id, tenantId: user.tenantId },
    });
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    if (!task.isArchived) {
      throw new BadRequestException('Task is not archived');
    }

    const updated = await this.prisma.task.update({
      where: { id },
      data: { isArchived: false },
    });

    return { message: 'Task restored successfully', data: updated };
  }

  async publish(user: AuthenticatedUser, id: string) {
    if (!user.tenantId) {
      throw new NotFoundException('Tenant not found');
    }

    const task = await this.prisma.task.findFirst({
      where: { id, tenantId: user.tenantId },
    });
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    if (task.status !== 'PENDING') {
      throw new BadRequestException('Only PENDING tasks can be published');
    }

    const updated = await this.prisma.task.update({
      where: { id },
      data: { status: 'ACTIVE' },
    });

    return { message: 'Task published successfully', data: updated };
  }

  async close(user: AuthenticatedUser, id: string) {
    if (!user.tenantId) {
      throw new NotFoundException('Tenant not found');
    }

    const task = await this.prisma.task.findFirst({
      where: { id, tenantId: user.tenantId },
    });
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    if (task.status !== 'ACTIVE') {
      throw new BadRequestException('Only ACTIVE tasks can be closed');
    }

    const updated = await this.prisma.task.update({
      where: { id },
      data: { status: 'SUBMISSION_CLOSED' },
    });

    return { message: 'Task closed successfully', data: updated };
  }

  async findSubmissions(user: AuthenticatedUser, taskId: string) {
    if (!user.tenantId) {
      throw new NotFoundException('Tenant not found');
    }

    const task = await this.prisma.task.findFirst({
      where: { id: taskId, tenantId: user.tenantId },
    });
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    const submissions = await this.prisma.studentTaskSubmission.findMany({
      where: { taskId },
      include: {
        student: { select: { id: true, name: true, phone: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return { message: 'Submissions retrieved successfully', data: submissions };
  }

  async submit(user: AuthenticatedUser, taskId: string, dto: SubmitTaskDto) {
    if (!user.tenantId) {
      throw new NotFoundException('Tenant not found');
    }

    const task = await this.prisma.task.findFirst({
      where: { id: taskId, tenantId: user.tenantId },
    });
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    if (task.status !== 'ACTIVE') {
      throw new BadRequestException('Task is not accepting submissions');
    }

    const enrollment = await this.prisma.enrollment.findFirst({
      where: { studentId: dto.studentId, batchId: task.batchId, status: 'ACTIVE' },
    });
    if (!enrollment) {
      throw new ForbiddenException('Student is not actively enrolled in this batch');
    }

    let submissionStatus: SubmissionStatus;
    const now = new Date();

    if (task.dueDate && now > task.dueDate) {
      if (!task.allowLateSubmission) {
        throw new BadRequestException('Submission deadline has passed and late submission is not allowed');
      }
      submissionStatus = 'LATE';
    } else {
      submissionStatus = 'SUBMITTED';
    }

    const submission = await this.prisma.studentTaskSubmission.upsert({
      where: {
        taskId_studentId: {
          taskId: taskId,
          studentId: dto.studentId,
        },
      },
      create: {
        taskId,
        studentId: dto.studentId,
        content: dto.content,
        fileUrl: dto.fileUrl,
        submittedAt: now,
        status: submissionStatus,
      },
      update: {
        content: dto.content,
        fileUrl: dto.fileUrl,
        submittedAt: now,
        status: submissionStatus,
        score: null,
        feedback: null,
        gradedBy: null,
        gradedAt: null,
      },
    });

    return { message: 'Task submitted successfully', data: submission };
  }

  async gradeSubmission(user: AuthenticatedUser, taskId: string, submissionId: string, dto: UpdateSubmissionDto) {
    if (!user.tenantId) {
      throw new NotFoundException('Tenant not found');
    }

    const task = await this.prisma.task.findFirst({
      where: { id: taskId, tenantId: user.tenantId },
    });
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    const submission = await this.prisma.studentTaskSubmission.findFirst({
      where: { id: submissionId, taskId },
    });
    if (!submission) {
      throw new NotFoundException('Submission not found');
    }

    if (dto.status && !['GRADED', 'RETURNED'].includes(dto.status)) {
      throw new BadRequestException('Submission status can only be set to GRADED or RETURNED');
    }

    const updateData: Record<string, unknown> = {};

    if (dto.score !== undefined) updateData.score = dto.score;
    if (dto.feedback !== undefined) updateData.feedback = dto.feedback;
    if (dto.status !== undefined) updateData.status = dto.status;

    updateData.gradedBy = user.id;
    updateData.gradedAt = new Date();

    const updated = await this.prisma.studentTaskSubmission.update({
      where: { id: submissionId },
      data: updateData,
    });

    return { message: 'Submission graded successfully', data: updated };
  }
}
