import { z } from 'zod';

export const updateManufacturerProfileSchema = z.object({
  factoryName: z.string().min(2).optional(),
  factoryAddress: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  certifications: z.array(z.string()).optional(),
  productionCapacity: z.string().optional(),
  minOrderQuantity: z.number().int().positive().optional(),
});

export const submitVerificationSchema = z.object({
  gstNumber: z.string().min(5, { message: 'Valid GST or Tax ID required' }),
  businessRegistrationDoc: z.string().url().optional().or(z.literal('')),
});

export type UpdateManufacturerProfileInput = z.infer<typeof updateManufacturerProfileSchema>;
export type SubmitVerificationInput = z.infer<typeof submitVerificationSchema>;
