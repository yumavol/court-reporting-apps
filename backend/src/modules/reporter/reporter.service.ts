import prisma from '@/lib/prisma';

export class ReporterService {
  async findAll() {
    return prisma.reporter.findMany();
  }
}
