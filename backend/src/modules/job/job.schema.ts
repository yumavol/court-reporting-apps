import { z } from 'zod';
import { LocationType } from '@/generated/prisma/enums';

export const createJobSchema = z.object({
  caseName: z.string().min(1),
  durationMinutes: z.number().positive(),
  locationType: z.enum(LocationType),
  city: z.string().optional(),
  reporterId: z.cuid().optional(),
  editorId: z.cuid().optional(),
});

export type CreateJobDto = z.infer<typeof createJobSchema>;

export const assignJobSchema = createJobSchema.pick({ reporterId: true, editorId: true }).partial();

export type UpdateJobDto = z.infer<typeof assignJobSchema>;
