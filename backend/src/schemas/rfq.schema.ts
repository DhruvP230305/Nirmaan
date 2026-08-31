import { z } from 'zod';
import { QuoteStatus } from '../types/index.js';

export const createRfqSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters long' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters long' }),
  quantity: z.number().int().positive({ message: 'Quantity must be a positive integer' }),
  unit: z.string().default('piece'),
  targetPrice: z.number().positive().optional(),
  categoryId: z.string().optional(),
});

export const createQuoteSchema = z.object({
  unitPrice: z.number().positive({ message: 'Unit price must be positive' }),
  totalPrice: z.number().positive({ message: 'Total price must be positive' }),
  deliveryTimeDays: z.number().int().positive({ message: 'Delivery time in days must be positive' }),
  notes: z.string().optional(),
});

export const updateQuoteStatusSchema = z.object({
  status: z.nativeEnum(QuoteStatus).refine((val) => val === QuoteStatus.ACCEPTED || val === QuoteStatus.REJECTED, {
    message: 'Status must be ACCEPTED or REJECTED',
  }),
});

export type CreateRfqInput = z.infer<typeof createRfqSchema>;
export type CreateQuoteInput = z.infer<typeof createQuoteSchema>;
export type UpdateQuoteStatusInput = z.infer<typeof updateQuoteStatusSchema>;
