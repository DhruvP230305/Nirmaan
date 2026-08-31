import { z } from 'zod';

export const updateVerificationStatusSchema = z.object({
  manufacturerProfileId: z.string().min(1),
  status: z.enum(['VERIFIED', 'REJECTED', 'PENDING']),
});

export type UpdateVerificationStatusInput = z.infer<typeof updateVerificationStatusSchema>;
