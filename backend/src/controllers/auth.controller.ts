import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service.js';
import { successResponse } from '../utils/api-response.js';

export class AuthController {
  /**
   * POST /api/v1/auth/register
   */
  static register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await AuthService.registerUser(req.body);
      res.status(201).json(successResponse('User registered successfully', result));
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/v1/auth/login
   */
  static login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await AuthService.loginUser(req.body);
      res.status(200).json(successResponse('Login successful', result));
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/v1/auth/me
   */
  static getProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const user = await AuthService.getUserProfile(userId);
      res.status(200).json(successResponse('User profile retrieved successfully', user));
    } catch (error) {
      next(error);
    }
  };

  /**
   * PUT /api/v1/auth/profile
   */
  static updateProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const updatedUser = await AuthService.updateUserProfile(userId, req.body);
      res.status(200).json(successResponse('User profile updated successfully', updatedUser));
    } catch (error) {
      next(error);
    }
  };
}
