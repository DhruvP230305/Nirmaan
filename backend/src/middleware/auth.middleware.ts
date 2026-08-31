import { Request, Response, NextFunction } from 'express';
import { Role } from '../types/index.js';
import { verifyToken } from '../utils/jwt.js';

/**
 * Middleware to authenticate requests using JWT tokens.
 */
export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      message: 'Access denied. No token provided.',
      error: 'UNAUTHORIZED',
    });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token.',
      error: 'INVALID_TOKEN',
    });
  }
};

/**
 * Middleware to restrict access based on user roles.
 * @param allowedRoles Array of roles permitted to access the route
 */
export const authorize = (...allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required.',
        error: 'UNAUTHORIZED',
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: 'Forbidden. You do not have permission to perform this action.',
        error: 'FORBIDDEN',
      });
      return;
    }

    next();
  };
};
