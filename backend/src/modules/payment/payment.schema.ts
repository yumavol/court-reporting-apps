import { z } from 'zod';

export const paymentInputSchema = z.object({
  jobId: z.cuid(),
  reporterRatePerMinute: z.number().nonnegative(),
  editorFlatFee: z.number().nonnegative(),
});

export type PaymentInputDto = z.infer<typeof paymentInputSchema>;
