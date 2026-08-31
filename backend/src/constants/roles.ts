import { Role } from '../types/index.js';

export { Role };

export const ROLES = {
  BUYER: Role.BUYER,
  MANUFACTURER: Role.MANUFACTURER,
  ADMIN: Role.ADMIN,
} as const;
