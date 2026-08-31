import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

/**
 * Hashes a plain-text password using bcrypt.
 * @param password Plain text password
 */
export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Compares a plain-text password against a hashed password.
 * @param password Plain text password
 * @param hash Stored bcrypt hash
 */
export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};
