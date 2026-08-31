import { Router } from 'express';
import { Role } from '../types/index.js';
import { ManufacturerController } from '../controllers/manufacturer.controller.js';
import { validateRequest } from '../middleware/validate.middleware.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import { updateManufacturerProfileSchema, submitVerificationSchema } from '../schemas/manufacturer.schema.js';

const router = Router();

router.get('/', ManufacturerController.getAll);
router.get('/:id', ManufacturerController.getById);

router.put(
  '/profile',
  authenticate,
  authorize(Role.MANUFACTURER, Role.ADMIN),
  validateRequest(updateManufacturerProfileSchema),
  ManufacturerController.updateProfile
);

router.post(
  '/verification',
  authenticate,
  authorize(Role.MANUFACTURER, Role.ADMIN),
  validateRequest(submitVerificationSchema),
  ManufacturerController.submitVerification
);

export default router;
