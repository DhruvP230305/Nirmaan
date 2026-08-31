import { Router } from 'express';
import { Role } from '../types/index.js';
import { SampleController } from '../controllers/sample.controller.js';
import { validateRequest } from '../middleware/validate.middleware.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import { createSampleSchema, updateSampleStatusSchema } from '../schemas/sample.schema.js';

const router = Router();

router.post('/', authenticate, authorize(Role.BUYER, Role.ADMIN), validateRequest(createSampleSchema), SampleController.create);
router.get('/', authenticate, SampleController.getAll);
router.get('/:id', authenticate, SampleController.getById);
router.put('/:id/status', authenticate, validateRequest(updateSampleStatusSchema), SampleController.updateStatus);

export default router;
