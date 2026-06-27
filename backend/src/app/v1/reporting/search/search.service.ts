import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database';

@Injectable()
export class SearchService {
  constructor(private readonly prisma: PrismaService) {}

  async searchStudents(query: string) {
    return this.prisma.student.findMany({
      where: {
        name: {
          contains: query,
          mode: 'insensitive',
        },
      },
      take: 20,
    });
  }

  async searchLeads(query: string) {
    return this.prisma.lead.findMany({
      where: {
        name: {
          contains: query,
          mode: 'insensitive',
        },
      },
      take: 20,
    });
  }

  async searchBatches(query: string) {
    return this.prisma.batch.findMany({
      where: {
        name: {
          contains: query,
          mode: 'insensitive',
        },
      },
      take: 20,
    });
  }

  async searchTrainers(query: string) {
    return this.prisma.user.findMany({
      where: {
        name: {
          contains: query,
          mode: 'insensitive',
        },
      },
      take: 20,
    });
  }

  async globalSearch(query: string) {
    const [students, leads, batches, trainers] = await Promise.all([
      this.searchStudents(query),
      this.searchLeads(query),
      this.searchBatches(query),
      this.searchTrainers(query),
    ]);

    return {
      students,
      leads,
      batches,
      trainers,
    };
  }
}