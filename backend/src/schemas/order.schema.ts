import { z } from 'zod';
import { OrderStatus, PaymentStatus } from '../types/index.js';

export const createOrderSchema = z.object({
  manufacturerId: z.string().min(1, { message: 'Manufacturer ID is required' }),
  quantity: z.number().int().positive({ message: 'Quantity must be a positive integer' }),
  unitPrice: z.number().positive({ message: 'Unit price must be positive' }),
  totalAmount: z.number().positive({ message: 'Total amount must be positive' }),
  shippingAddress: z.string().min(5, { message: 'Shipping address must be at least 5 characters' }),
  notes: z.string().optional(),
  productId: z.string().optional(),
  rfqId: z.string().optional(),
  quoteId: z.string().optional(),
});

export const updateOrderStatusSchema = z.object({
  status: z.nativeEnum(OrderStatus),
  paymentStatus: z.nativeEnum(PaymentStatus).optional(),
});

export const createMilestoneSchema = z.object({
  title: z.string().min(3, { message: 'Milestone title must be at least 3 characters' }),
  description: z.string().optional(),
  dueDate: z.string().datetime().optional().or(z.literal('')),
});

export const updateMilestoneSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().optional(),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED']).optional(),
  dueDate: z.string().datetime().optional().or(z.literal('')),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
export type CreateMilestoneInput = z.infer<typeof createMilestoneSchema>;
export type UpdateMilestoneInput = z.infer<typeof updateMilestoneSchema>;
