import { Request, Response, NextFunction } from 'express';
import { RfqService } from '../services/rfq.service.js';
import { successResponse } from '../utils/api-response.js';

export class RfqController {
  /**
   * POST /api/v1/rfqs
   */
  static create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const buyerId = req.user!.id;
      const rfq = await RfqService.createRfq(buyerId, req.body);
      res.status(201).json(successResponse('RFQ posted successfully', rfq));
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/v1/rfqs
   */
  static getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = req.user!;
      const rfqs = await RfqService.getRfqs(user);
      res.status(200).json(successResponse('RFQs fetched successfully', rfqs));
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/v1/rfqs/:id
   */
  static getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const rfq = await RfqService.getRfqById(req.params.id);
      res.status(200).json(successResponse('RFQ details retrieved successfully', rfq));
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/v1/rfqs/:id/quotes
   */
  static submitQuote = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const manufacturerId = req.user!.id;
      const rfqId = req.params.id;
      const quote = await RfqService.submitQuote(rfqId, manufacturerId, req.body);
      res.status(201).json(successResponse('Quote submitted successfully', quote));
    } catch (error) {
      next(error);
    }
  };

  /**
   * PUT /api/v1/rfqs/quotes/:quoteId/status
   */
  static updateQuoteStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const buyerId = req.user!.id;
      const quoteId = req.params.quoteId;
      const updatedQuote = await RfqService.updateQuoteStatus(quoteId, buyerId, req.body);
      res.status(200).json(successResponse(`Quote status updated to ${req.body.status}`, updatedQuote));
    } catch (error) {
      next(error);
    }
  };
}
