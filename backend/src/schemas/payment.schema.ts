import { z } from 'zod';

export const createPaymentSchema = z.object({
  orderId: z.string().min(1, { message: 'Order ID is required' }),
  amount: z.number().positive({ message: 'Amount must be positive' }),
  provider: z.enum(['RAZORPAY', 'STRIPE', 'BANK_TRANSFER']).default('RAZORPAY'),
});

export const verifyPaymentSchema = z.object({
  paymentId: z.string().min(1),
  providerPaymentId: z.string().min(1),
  providerOrderId: z.string().optional(),
  signature: z.string().optional(),
});

export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
export type VerifyPaymentInput = z.infer<typeof verifyPaymentSchema>;
