import { Request, Response } from 'express';
import { JobService } from '@/modules/job/job.service';
import { z } from 'zod';
import { createJobSchema } from '@/modules/job/job.schema';

const jobService = new JobService();

export class JobController {
  async create(req: Request, res: Response): Promise<void> {
    const result = createJobSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ success: false, errors: z.flattenError(result.error).fieldErrors });
      return;
    }
    const job = await jobService.create(result.data);
    res.status(201).json({ success: true, data: job });
  }
}
