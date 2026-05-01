import { Request, Response } from 'express';
import { z } from 'zod';
import { ReporterService } from '@/modules/reporter/reporter.service';
import { listReportersQuerySchema } from '@/modules/reporter/reporter.schema';
import { ReporterListResponse } from './reporter';
import { ValidationError } from '@/lib/errors';

const reporterService = new ReporterService();

export class ReporterController {
  async findAll(req: Request, res: Response): Promise<void> {
    const result = listReportersQuerySchema.safeParse(req.query);
    if (!result.success) {
      throw new ValidationError('Invalid query parameters', z.flattenError(result.error).fieldErrors);
      return;
    }
    const reporters = await reporterService.findAll(result.data.preferCity);
    const response: ReporterListResponse = {
      success: true,
      data: reporters,
    };
    res.status(200).json(response);
  }
}
