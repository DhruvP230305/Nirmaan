import { Router } from 'express';
import { Role } from '../types/index.js';
import { AdminController } from '../controllers/admin.controller.js';
import { validateRequest } from '../middleware/validate.middleware.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import { updateVerificationStatusSchema } from '../schemas/admin.schema.js';

const router = Router();

// Protect all admin routes for ADMIN role only
router.use(authenticate, authorize(Role.ADMIN));

router.get('/stats', AdminController.getStats);
router.get('/verifications', AdminController.getPendingVerifications);
router.put('/verifications/status', validateRequest(updateVerificationStatusSchema), AdminController.updateVerificationStatus);

router.get('/users', AdminController.getUsers);
router.get('/manufacturers', AdminController.getManufacturers);

export default router;
