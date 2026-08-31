import { Request, Response, NextFunction } from 'express';
import { SampleService } from '../services/sample.service.js';
import { successResponse } from '../utils/api-response.js';

export class SampleController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const sample = await SampleService.createSample(userId, req.body);
      res.status(201).json(successResponse('Sample request created successfully', sample));
    } catch (error) {
      next(error);
    }
  }

  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const samples = await SampleService.getSamples(userId, req.user!.role);
      res.status(200).json(successResponse('Samples fetched successfully', samples));
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const sample = await SampleService.getSampleById(req.params.id, userId);
      res.status(200).json(successResponse('Sample details fetched successfully', sample));
    } catch (error) {
      next(error);
    }
  }

  static async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const updated = await SampleService.updateSampleStatus(req.params.id, userId, req.body);
      res.status(200).json(successResponse('Sample status updated successfully', updated));
    } catch (error) {
      next(error);
    }
  }
}
