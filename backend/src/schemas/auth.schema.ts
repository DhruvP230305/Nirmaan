import { z } from 'zod';
import { Role } from '../types/index.js';

export const registerSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
  name: z.string().min(2, { message: 'Name must be at least 2 characters long' }),
  role: z.nativeEnum(Role).refine((val) => val === Role.BUYER || val === Role.MANUFACTURER, {
    message: 'Role must be either BUYER or MANUFACTURER',
  }),
  phone: z.string().optional(),
  companyName: z.string().optional(),

  // Buyer Specific Details
  businessType: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),

  // Manufacturer Specific Details
  factoryName: z.string().optional(),
  factoryAddress: z.string().optional(),
  certifications: z.array(z.string()).optional(),
  productionCapacity: z.string().optional(),
  minOrderQuantity: z.number().int().positive().optional(),
});

export const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().optional(),
  companyName: z.string().optional(),
  
  // Buyer profile updates
  businessType: z.string().optional(),
  taxId: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),

  // Manufacturer profile updates
  factoryName: z.string().optional(),
  factoryAddress: z.string().optional(),
  certifications: z.array(z.string()).optional(),
  productionCapacity: z.string().optional(),
  minOrderQuantity: z.number().int().positive().optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
