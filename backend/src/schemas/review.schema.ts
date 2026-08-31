import { z } from 'zod';

export const createReviewSchema = z.object({
  orderId: z.string().min(1, { message: 'Order ID is required' }),
  manufacturerId: z.string().min(1, { message: 'Manufacturer ID is required' }),
  rating: z.number().min(1).max(5, { message: 'Rating must be between 1 and 5' }),
  qualityRating: z.number().min(1).max(5),
  deliveryRating: z.number().min(1).max(5),
  comment: z.string().optional(),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
