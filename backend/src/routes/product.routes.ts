import { Router } from 'express';
import { Role } from '../types/index.js';
import { ProductController } from '../controllers/product.controller.js';
import { validateRequest } from '../middleware/validate.middleware.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import { createProductSchema, updateProductSchema } from '../schemas/product.schema.js';

const router = Router();

/**
 * @route   GET /api/v1/products
 * @desc    List products with filtering and search
 * @access  Public
 */
router.get('/', ProductController.getAll);

/**
 * @route   GET /api/v1/products/:id
 * @desc    Get single product details
 * @access  Public
 */
router.get('/:id', ProductController.getById);

/**
 * @route   POST /api/v1/products
 * @desc    Create a new product (Manufacturer only)
 * @access  Private (MANUFACTURER)
 */
router.post(
  '/',
  authenticate,
  authorize(Role.MANUFACTURER, Role.ADMIN),
  validateRequest(createProductSchema),
  ProductController.create
);

/**
 * @route   PUT /api/v1/products/:id
 * @desc    Update an existing product (Manufacturer owner only)
 * @access  Private (MANUFACTURER)
 */
router.put(
  '/:id',
  authenticate,
  authorize(Role.MANUFACTURER, Role.ADMIN),
  validateRequest(updateProductSchema),
  ProductController.update
);

/**
 * @route   DELETE /api/v1/products/:id
 * @desc    Delete a product (Manufacturer owner only)
 * @access  Private (MANUFACTURER)
 */
router.delete(
  '/:id',
  authenticate,
  authorize(Role.MANUFACTURER, Role.ADMIN),
  ProductController.delete
);

export default router;
