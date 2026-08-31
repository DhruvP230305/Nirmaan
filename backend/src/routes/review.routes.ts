import { Router } from 'express';
import { Role } from '../types/index.js';
import { ReviewController } from '../controllers/review.controller.js';
import { validateRequest } from '../middleware/validate.middleware.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import { createReviewSchema } from '../schemas/review.schema.js';

const router = Router();

router.post('/', authenticate, authorize(Role.BUYER, Role.ADMIN), validateRequest(createReviewSchema), ReviewController.create);
router.get('/manufacturer/:manufacturerId', ReviewController.getByManufacturer);

export default router;
