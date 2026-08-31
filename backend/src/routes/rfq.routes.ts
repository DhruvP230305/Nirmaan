import { Router } from 'express';
import { Role } from '../types/index.js';
import { RfqController } from '../controllers/rfq.controller.js';
import { validateRequest } from '../middleware/validate.middleware.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import { createRfqSchema, createQuoteSchema, updateQuoteStatusSchema } from '../schemas/rfq.schema.js';

const router = Router();

/**
 * @route   POST /api/v1/rfqs
 * @desc    Post a new Request for Quote (Buyer only)
 * @access  Private (BUYER)
 */
router.post(
  '/',
  authenticate,
  authorize(Role.BUYER, Role.ADMIN),
  validateRequest(createRfqSchema),
  RfqController.create
);

/**
 * @route   GET /api/v1/rfqs
 * @desc    List RFQs (Buyers view own; Manufacturers view open marketplace)
 * @access  Private
 */
router.get('/', authenticate, RfqController.getAll);

/**
 * @route   GET /api/v1/rfqs/:id
 * @desc    Get RFQ details with quotes
 * @access  Private
 */
router.get('/:id', authenticate, RfqController.getById);

/**
 * @route   POST /api/v1/rfqs/:id/quotes
 * @desc    Submit a quote for an RFQ (Manufacturer only)
 * @access  Private (MANUFACTURER)
 */
router.post(
  '/:id/quotes',
  authenticate,
  authorize(Role.MANUFACTURER, Role.ADMIN),
  validateRequest(createQuoteSchema),
  RfqController.submitQuote
);

/**
 * @route   PUT /api/v1/rfqs/quotes/:quoteId/status
 * @desc    Accept or Reject a quote (Buyer only)
 * @access  Private (BUYER)
 */
router.put(
  '/quotes/:quoteId/status',
  authenticate,
  authorize(Role.BUYER, Role.ADMIN),
  validateRequest(updateQuoteStatusSchema),
  RfqController.updateQuoteStatus
);

export default router;
