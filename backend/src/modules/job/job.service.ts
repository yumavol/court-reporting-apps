import prisma from '@/lib/prisma';
import type { CreateJobDto } from '@/modules/job/job.schema';

export class JobService {
  async create(dto: CreateJobDto) {
    return prisma.job.create({
      data: {
        name: dto.caseName,
        duration: dto.duration,
        locationType: dto.locationType,
        city: dto.city,
        reporterId: dto.reporterId,
        editorId: dto.editorId,
      },
    });
  }

  async findAll() {
    return prisma.job.findMany();
  }
}
