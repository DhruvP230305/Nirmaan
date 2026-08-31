import { z } from 'zod';

export const createSampleSchema = z.object({
  manufacturerId: z.string().min(1, { message: 'Manufacturer ID is required' }),
  productId: z.string().optional(),
  quantity: z.number().int().positive().default(1),
  price: z.number().positive({ message: 'Sample price is required' }),
  notes: z.string().optional(),
});

export const updateSampleStatusSchema = z.object({
  status: z.enum(['ACCEPTED', 'SHIPPED', 'DELIVERED', 'APPROVED', 'REJECTED', 'CANCELLED']),
  trackingNumber: z.string().optional(),
});

export type CreateSampleInput = z.infer<typeof createSampleSchema>;
export type UpdateSampleStatusInput = z.infer<typeof updateSampleStatusSchema>;
