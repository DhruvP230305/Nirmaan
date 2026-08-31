import { Request, Response, NextFunction } from 'express';
import { PackagingService } from '../services/packaging.service.js';
import { successResponse } from '../utils/api-response.js';

export class PackagingController {
  static async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const product = await PackagingService.createProduct(userId, req.body);
      res.status(201).json(successResponse('Packaging product created', product));
    } catch (error) {
      next(error);
    }
  }

  static async getProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const category = req.query.category as string;
      const products = await PackagingService.getProducts(category);
      res.status(200).json(successResponse('Packaging products fetched', products));
    } catch (error) {
      next(error);
    }
  }

  static async createOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const order = await PackagingService.createOrder(userId, req.body);
      res.status(201).json(successResponse('Packaging order placed', order));
    } catch (error) {
      next(error);
    }
  }

  static async getOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const orders = await PackagingService.getOrders(userId);
      res.status(200).json(successResponse('Packaging orders fetched', orders));
    } catch (error) {
      next(error);
    }
  }
}
