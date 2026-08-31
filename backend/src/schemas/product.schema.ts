import { z } from 'zod';

export const createProductSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters long' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters long' }),
  price: z.number().positive({ message: 'Price must be greater than 0' }),
  minOrderQuantity: z.number().int().positive().default(1),
  unit: z.string().default('piece'),
  images: z.array(z.string().url()).optional().default([]),
  categoryId: z.string().optional(),
});

export const updateProductSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().min(10).optional(),
  price: z.number().positive().optional(),
  minOrderQuantity: z.number().int().positive().optional(),
  unit: z.string().optional(),
  images: z.array(z.string().url()).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
  categoryId: z.string().optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
