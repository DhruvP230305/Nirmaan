import { Request, Response, NextFunction } from 'express';
import { OrderService } from '../services/order.service.js';
import { successResponse } from '../utils/api-response.js';

export class OrderController {
  /**
   * POST /api/v1/orders
   */
  static create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const buyerId = req.user!.id;
      const order = await OrderService.createOrder(buyerId, req.body);
      res.status(201).json(successResponse('Order created successfully', order));
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/v1/orders
   */
  static getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = req.user!;
      const orders = await OrderService.getOrders(user);
      res.status(200).json(successResponse('Orders retrieved successfully', orders));
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/v1/orders/:id
   */
  static getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = req.user!;
      const order = await OrderService.getOrderById(req.params.id, user);
      res.status(200).json(successResponse('Order details retrieved successfully', order));
    } catch (error) {
      next(error);
    }
  };

  /**
   * PUT /api/v1/orders/:id/status
   */
  static updateStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = req.user!;
      const updatedOrder = await OrderService.updateOrderStatus(req.params.id, user, req.body);
      res.status(200).json(successResponse('Order status updated successfully', updatedOrder));
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/v1/orders/:id/milestones
   */
  static addMilestone = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const manufacturerId = req.user!.id;
      const milestone = await OrderService.addMilestone(req.params.id, manufacturerId, req.body);
      res.status(201).json(successResponse('Milestone added successfully', milestone));
    } catch (error) {
      next(error);
    }
  };

  /**
   * PUT /api/v1/orders/milestones/:milestoneId
   */
  static updateMilestone = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const manufacturerId = req.user!.id;
      const updatedMilestone = await OrderService.updateMilestone(req.params.milestoneId, manufacturerId, req.body);
      res.status(200).json(successResponse('Milestone updated successfully', updatedMilestone));
    } catch (error) {
      next(error);
    }
  };
}
