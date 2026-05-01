import { Request, Response } from 'express';
import { ReporterService } from '@/modules/reporter/reporter.service';
import { ReporterListResponse } from './reporter';

const reporterService = new ReporterService();

export class ReporterController {
  async findAll(req: Request, res: Response): Promise<void> {
    const preferCity = req.query.preferCity as string | undefined;
    const reporters = await reporterService.findAll(preferCity);
    const response: ReporterListResponse = {
      success: true,
      data: reporters,
    };
    res.status(200).json(response);
  }
}
