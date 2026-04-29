import { Request, Response } from 'express';
import { HealthService } from '@/services/health.service';

const healthService = new HealthService();

export class HealthController {
  get(_req: Request, res: Response): void {
    const data = healthService.check();
    res.json({ success: true, data });
  }
}
