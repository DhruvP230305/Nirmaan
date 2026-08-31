import { Request, Response, NextFunction } from 'express';
import { ManufacturerService } from '../services/manufacturer.service.js';
import { successResponse } from '../utils/api-response.js';

export class ManufacturerController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const filters = {
        search: req.query.search as string,
        verificationStatus: req.query.verificationStatus as string,
        city: req.query.city as string,
      };
      const manufacturers = await ManufacturerService.getManufacturers(filters);
      res.status(200).json(successResponse('Manufacturers fetched successfully', manufacturers));
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const profile = await ManufacturerService.getManufacturerById(req.params.id);
      res.status(200).json(successResponse('Manufacturer profile fetched successfully', profile));
    } catch (error) {
      next(error);
    }
  }

  static async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const updated = await ManufacturerService.updateProfile(userId, req.body);
      res.status(200).json(successResponse('Manufacturer profile updated successfully', updated));
    } catch (error) {
      next(error);
    }
  }

  static async submitVerification(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const updated = await ManufacturerService.submitVerification(userId, req.body);
      res.status(200).json(successResponse('Verification submitted successfully', updated));
    } catch (error) {
      next(error);
    }
  }
}
