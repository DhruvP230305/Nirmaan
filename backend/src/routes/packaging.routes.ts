import { Router } from 'express';
import { Role } from '../types/index.js';
import { PackagingController } from '../controllers/packaging.controller.js';
import { validateRequest } from '../middleware/validate.middleware.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import { createPackagingProductSchema, createPackagingOrderSchema } from '../schemas/packaging.schema.js';

const router = Router();

router.get('/products', PackagingController.getProducts);
router.post(
  '/products',
  authenticate,
  authorize(Role.MANUFACTURER, Role.ADMIN),
  validateRequest(createPackagingProductSchema),
  PackagingController.createProduct
);

router.post(
  '/orders',
  authenticate,
  authorize(Role.BUYER, Role.ADMIN),
  validateRequest(createPackagingOrderSchema),
  PackagingController.createOrder
);
router.get('/orders', authenticate, PackagingController.getOrders);

export default router;
