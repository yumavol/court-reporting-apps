import prisma from '@/lib/prisma';
import { ValidationError } from '@/lib/errors';
import type { CreateJobDto, UpdateJobDto, UpdateJobStatusDto } from '@/modules/job/job.schema';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { JobStatus } from '@/generated/prisma/enums';

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

  async assign(id: string, dto: UpdateJobDto) {
    try {
      const job = await prisma.job.findUnique({ where: { id } });
      if (!job) {
        throw new ValidationError('Job not found', undefined, 404);
      }

      if (dto.editorId && dto.reporterId) {
        throw new ValidationError('Cannot assign both reporter and editor at the same time');
      }

      if (dto.editorId && job.status !== 'TRANSCRIBED') {
        throw new ValidationError('Only jobs with status TRANSCRIBED can be assigned to an editor');
      }
      if (Object.keys(dto).length === 0) {
        throw new ValidationError('No fields to update');
      }
      const status: JobStatus = dto.reporterId ? JobStatus.ASSIGNED : job.status;
      return await prisma.job.update({
        where: { id },
        data: {
          reporterId: dto.reporterId,
          editorId: dto.editorId,
          status,
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2003') throw new ValidationError('Reporter or Editor not found');
      }
      throw error;
    }
  }

  async updateStatus(id: string, dto: UpdateJobStatusDto) {
    const job = await prisma.job.findUnique({ where: { id } });
    if (!job) {
      throw new ValidationError('Job not found', undefined, 404);
    }
    return prisma.job.update({ where: { id }, data: { status: dto.status } });
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
