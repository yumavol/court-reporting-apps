import prisma from '@/lib/prisma';
import type { CreateJobDto } from '@/modules/job/job.schema';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

export class JobService {
  async create(dto: CreateJobDto) {
    try {
      return await prisma.job.create({
        data: {
          name: dto.caseName,
          durationMinutes: dto.durationMinutes,
          locationType: dto.locationType,
          city: dto.city,
          reporterId: dto.reporterId,
          editorId: dto.editorId,
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2003') {
        throw new Error('Reporter or Editor not found');
      }
      throw error;
    }
  }

  async findAll() {
    return prisma.job.findMany();
  }
}
