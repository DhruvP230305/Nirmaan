import { Request, Response, NextFunction } from 'express';
import { ProductService } from '../services/product.service.js';
import { successResponse } from '../utils/api-response.js';

export class ProductController {
  /**
   * POST /api/v1/products
   */
  static create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const manufacturerId = req.user!.id;
      const product = await ProductService.createProduct(manufacturerId, req.body);
      res.status(201).json(successResponse('Product created successfully', product));
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/v1/products
   */
  static getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const categoryId = req.query.categoryId as string | undefined;
      const categories = req.query.categories as string | undefined;
      const search = req.query.search as string | undefined;
      const moq = req.query.moq ? parseInt(req.query.moq as string, 10) : undefined;
      const verified = req.query.verified === 'true';
      const sort = req.query.sort as string | undefined;
      const page = req.query.page ? parseInt(req.query.page as string, 10) : undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;

      const result = await ProductService.getProducts({ categoryId, categories, search, moq, verified, sort, page, limit });
      res.status(200).json(successResponse('Products fetched successfully', result));
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/v1/products/:id
   */
  static getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const product = await ProductService.getProductById(req.params.id);
      res.status(200).json(successResponse('Product details retrieved successfully', product));
    } catch (error) {
      next(error);
    }
  };

  /**
   * PUT /api/v1/products/:id
   */
  static update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const manufacturerId = req.user!.id;
      const updatedProduct = await ProductService.updateProduct(req.params.id, manufacturerId, req.body);
      res.status(200).json(successResponse('Product updated successfully', updatedProduct));
    } catch (error) {
      next(error);
    }
  };

  /**
   * DELETE /api/v1/products/:id
   */
  static delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const manufacturerId = req.user!.id;
      await ProductService.deleteProduct(req.params.id, manufacturerId);
      res.status(200).json(successResponse('Product deleted successfully'));
    } catch (error) {
      next(error);
    }
  };
}
