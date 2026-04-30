import prisma from '@/lib/prisma';
import { ValidationError } from '@/lib/errors';
import type { CreateJobDto, UpdateJobDto } from '@/modules/job/job.schema';
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
        throw new ValidationError('Reporter or Editor not found', { field: error.meta?.field_name });
      }
      throw error;
    }
  }

  async update(id: string, dto: UpdateJobDto) {
    try {
      if (Object.keys(dto).length === 0) {
        throw new ValidationError('No fields to update');
      }
      return await prisma.job.update({
        where: { id },
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
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') throw new ValidationError('Job not found', { field: 'id' }, 404);
        if (error.code === 'P2003') throw new ValidationError('Reporter or Editor not found', { field: error.meta?.field_name });
      }
      throw error;
    }
  }

  async findAll() {
    return prisma.job.findMany({
      include: {
        reporter: true,
        editor: true,
      },
    });
  }
}
