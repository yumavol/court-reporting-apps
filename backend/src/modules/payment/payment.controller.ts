import { Request, Response } from 'express';
import { z } from 'zod';
import { PaymentService } from './payment.service';
import { paymentInputSchema } from './payment.schema';
import type { PaymentCalculateResponse, PaymentProcessResponse } from './payment';

const paymentService = new PaymentService();

export class PaymentController {
  async calculate(req: Request, res: Response): Promise<void> {
    const result = paymentInputSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ success: false, errors: z.flattenError(result.error).fieldErrors });
      return;
    }
    const data = await paymentService.calculate(result.data);
    const response: PaymentCalculateResponse = { success: true, data };
    res.status(200).json(response);
  }

  async processPayment(req: Request, res: Response): Promise<void> {
    const result = paymentInputSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ success: false, errors: z.flattenError(result.error).fieldErrors });
      return;
    }
    const data = await paymentService.processPayment(result.data);
    const response: PaymentProcessResponse = { success: true, data };
    res.status(201).json(response);
  }
}
