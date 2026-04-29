import { Request, Response } from 'express';
import { JobService } from '@/modules/job/job.service';
import { z } from 'zod';
import { createJobSchema } from '@/modules/job/job.schema';
import { JobInsertResponse, JobListResponse } from './job';

const jobService = new JobService();

export class JobController {
  async create(req: Request, res: Response): Promise<void> {
    const result = createJobSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ success: false, errors: z.flattenError(result.error).fieldErrors });
      return;
    }
    const job = await jobService.create(result.data);
    const response: JobInsertResponse = {
      success: true,
      data: job,
    };
    res.status(201).json(response);
  }

  async findAll(req: Request, res: Response): Promise<void> {
    const jobs = await jobService.findAll();
    const response: JobListResponse = {
      success: true,
      data: jobs,
    };
    res.status(200).json(response);
  }
}
