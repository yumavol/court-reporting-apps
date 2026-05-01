import { z } from 'zod';

export const listReportersQuerySchema = z.object({
  preferCity: z.string().min(1).optional(),
});

export type ListReportersQueryDto = z.infer<typeof listReportersQuerySchema>;
