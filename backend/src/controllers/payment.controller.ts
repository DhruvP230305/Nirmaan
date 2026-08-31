import { Request, Response, NextFunction } from 'express';
import { PaymentService } from '../services/payment.service.js';
import { successResponse } from '../utils/api-response.js';

export class PaymentController {
  static async createPaymentOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const order = await PaymentService.createPaymentOrder(userId, req.body);
      res.status(201).json(successResponse('Payment order created', order));
    } catch (error) {
      next(error);
    }
  }

  static async verifyPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const payment = await PaymentService.verifyPayment(req.body);
      res.status(200).json(successResponse('Payment verified successfully', payment));
    } catch (error) {
      next(error);
    }
  }

  static async getPaymentsByOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const payments = await PaymentService.getPaymentByOrderId(req.params.orderId);
      res.status(200).json(successResponse('Order payments retrieved', payments));
    } catch (error) {
      next(error);
    }
  }
}
