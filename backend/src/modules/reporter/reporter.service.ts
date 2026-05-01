import { ReporterModel } from '@/generated/prisma/models';
import prisma from '@/lib/prisma';

export class ReporterService {
  async findAll(preferCity?: string) {
    if (!preferCity) return prisma.reporter.findMany();

    return prisma.$queryRaw<ReporterModel[]>`
      SELECT * FROM "Reporter"
      ORDER BY CASE WHEN LOWER(location) = LOWER(${preferCity}) THEN 0 ELSE 1 END
    `;
  }
}
