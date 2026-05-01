import { Request, Response } from 'express';
import { JobService } from '@/modules/job/job.service';
import { z } from 'zod';
import { createJobSchema, assignJobSchema, updateJobStatusSchema, listJobsQuerySchema } from '@/modules/job/job.schema';
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

  async assign(req: Request, res: Response): Promise<void> {
    const result = assignJobSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ success: false, errors: z.flattenError(result.error).fieldErrors });
      return;
    }
    const job = await jobService.assign(req.params.id as string, result.data);
    const response: JobInsertResponse = { success: true, data: job };
    res.status(200).json(response);
  }

  async updateStatus(req: Request, res: Response): Promise<void> {
    const result = updateJobStatusSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ success: false, errors: z.flattenError(result.error).fieldErrors });
      return;
    }
    const job = await jobService.updateStatus(req.params.id as string, result.data);
    const response: JobInsertResponse = { success: true, data: job };
    res.status(200).json(response);
  }

  async findAll(req: Request, res: Response): Promise<void> {
    const result = listJobsQuerySchema.safeParse(req.query);
    if (!result.success) {
      res.status(400).json({ success: false, errors: z.flattenError(result.error).fieldErrors });
      return;
    }
    const jobs = await jobService.findAll(result.data);
    const response: JobListResponse = {
      success: true,
      data: jobs,
    };
    res.status(200).json(response);
  }
}
