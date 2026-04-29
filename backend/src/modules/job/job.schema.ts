import { z } from 'zod';
import { LocationType } from '@/generated/prisma/enums';

export const createJobSchema = z.object({
  caseName: z.string().min(1),
  durationMinutes: z.number().positive(),
  locationType: z.enum(LocationType),
  city: z.string().optional(),
  reporterId: z.string().optional(),
  editorId: z.string().optional(),
});

export type CreateJobDto = z.infer<typeof createJobSchema>;
