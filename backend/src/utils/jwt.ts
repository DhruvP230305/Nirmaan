import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { UserPayload } from '../types/index.js';

/**
 * Generates a JSON Web Token for an authenticated user.
 * @param payload User ID, Email, and Role
 */
export const generateToken = (payload: UserPayload): string => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  });
};

/**
 * Verifies a JWT token and extracts the decoded payload.
 * @param token JWT String
 */
export const verifyToken = (token: string): UserPayload => {
  return jwt.verify(token, env.JWT_SECRET) as UserPayload;
};
