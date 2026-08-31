import { Request, Response, NextFunction } from 'express';
import { AdminService } from '../services/admin.service.js';
import { successResponse } from '../utils/api-response.js';

export class AdminController {
  static async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await AdminService.getPlatformStats();
      res.status(200).json(successResponse('Platform statistics retrieved', stats));
    } catch (error) {
      next(error);
    }
  }

  static async getPendingVerifications(req: Request, res: Response, next: NextFunction) {
    try {
      const verifications = await AdminService.getPendingVerifications();
      res.status(200).json(successResponse('Pending verifications retrieved', verifications));
    } catch (error) {
      next(error);
    }
  }

  static async updateVerificationStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await AdminService.updateVerificationStatus(req.body);
      res.status(200).json(successResponse('Verification status updated successfully', updated));
    } catch (error) {
      next(error);
    }
  }

  static async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await AdminService.getUsers();
      res.status(200).json(successResponse('Users retrieved', users));
    } catch (error) {
      next(error);
    }
  }

  static async getManufacturers(req: Request, res: Response, next: NextFunction) {
    try {
      const manufacturers = await AdminService.getManufacturers();
      res.status(200).json(successResponse('Manufacturers retrieved', manufacturers));
    } catch (error) {
      next(error);
    }
  }
}
