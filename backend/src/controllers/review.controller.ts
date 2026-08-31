import { Request, Response, NextFunction } from 'express';
import { ReviewService } from '../services/review.service.js';
import { successResponse } from '../utils/api-response.js';

export class ReviewController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const review = await ReviewService.createReview(userId, req.body);
      res.status(201).json(successResponse('Review submitted successfully', review));
    } catch (error) {
      next(error);
    }
  }

  static async getByManufacturer(req: Request, res: Response, next: NextFunction) {
    try {
      const reviews = await ReviewService.getManufacturerReviews(req.params.manufacturerId);
      res.status(200).json(successResponse('Manufacturer reviews retrieved', reviews));
    } catch (error) {
      next(error);
    }
  }
}
