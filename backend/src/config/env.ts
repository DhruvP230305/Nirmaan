import dotenv from 'dotenv';
import { z } from 'zod';

// Load environment variables from .env file
dotenv.config();

const envSchema = z.object({
  PORT: z.string().transform((val) => parseInt(val, 10)).default('5000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string().url({ message: 'DATABASE_URL must be a valid URL' }),
  JWT_SECRET: z.string().min(10, { message: 'JWT_SECRET must be at least 10 characters long' }).default('super-secret-jwt-key-change-in-production'),
  JWT_EXPIRES_IN: z.string().default('7d'),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error('❌ Invalid environment configuration:');
  console.error(JSON.stringify(result.error.format(), null, 2));
  process.exit(1);
}

export const env = result.data;
