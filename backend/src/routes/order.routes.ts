import { Router } from 'express';
import { Role } from '../types/index.js';
import { OrderController } from '../controllers/order.controller.js';
import { validateRequest } from '../middleware/validate.middleware.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import {
  createOrderSchema,
  updateOrderStatusSchema,
  createMilestoneSchema,
  updateMilestoneSchema,
} from '../schemas/order.schema.js';

const router = Router();

/**
 * @route   POST /api/v1/orders
 * @desc    Place a new purchase order (Buyer only)
 * @access  Private (BUYER)
 */
router.post(
  '/',
  authenticate,
  authorize(Role.BUYER, Role.ADMIN),
  validateRequest(createOrderSchema),
  OrderController.create
);

/**
 * @route   GET /api/v1/orders
 * @desc    List orders (Role filtered for Buyer/Manufacturer/Admin)
 * @access  Private
 */
router.get('/', authenticate, OrderController.getAll);

/**
 * @route   GET /api/v1/orders/:id
 * @desc    Get order details with milestones
 * @access  Private
 */
router.get('/:id', authenticate, OrderController.getById);

/**
 * @route   PUT /api/v1/orders/:id/status
 * @desc    Update order status / payment status (Manufacturer/Admin)
 * @access  Private (MANUFACTURER, ADMIN)
 */
router.put(
  '/:id/status',
  authenticate,
  authorize(Role.MANUFACTURER, Role.ADMIN),
  validateRequest(updateOrderStatusSchema),
  OrderController.updateStatus
);

/**
 * @route   POST /api/v1/orders/:id/milestones
 * @desc    Add production milestone to order (Manufacturer only)
 * @access  Private (MANUFACTURER)
 */
router.post(
  '/:id/milestones',
  authenticate,
  authorize(Role.MANUFACTURER, Role.ADMIN),
  validateRequest(createMilestoneSchema),
  OrderController.addMilestone
);

/**
 * @route   PUT /api/v1/orders/milestones/:milestoneId
 * @desc    Update production milestone status (Manufacturer only)
 * @access  Private (MANUFACTURER)
 */
router.put(
  '/milestones/:milestoneId',
  authenticate,
  authorize(Role.MANUFACTURER, Role.ADMIN),
  validateRequest(updateMilestoneSchema),
  OrderController.updateMilestone
);

export default router;
