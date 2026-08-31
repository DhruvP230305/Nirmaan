import { z } from 'zod';

export const createPackagingProductSchema = z.object({
  title: z.string().min(2, { message: 'Title must be at least 2 characters' }),
  category: z.string().min(1, { message: 'Category required (e.g. Box, Pouch, Card, Sticker, Shipping Bag)' }),
  description: z.string().min(5),
  price: z.number().positive(),
  minOrderQuantity: z.number().int().positive().default(100),
  images: z.array(z.string().url()).optional(),
  customizable: z.boolean().default(true),
});

export const createPackagingOrderSchema = z.object({
  packagingProductId: z.string().min(1),
  quantity: z.number().int().positive(),
  customLogoUrl: z.string().url().optional().or(z.literal('')),
  notes: z.string().optional(),
});

export type CreatePackagingProductInput = z.infer<typeof createPackagingProductSchema>;
export type CreatePackagingOrderInput = z.infer<typeof createPackagingOrderSchema>;
