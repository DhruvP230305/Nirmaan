import { Router } from 'express';
import { PaymentController } from '../controllers/payment.controller.js';
import { validateRequest } from '../middleware/validate.middleware.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { createPaymentSchema, verifyPaymentSchema } from '../schemas/payment.schema.js';

const router = Router();

router.post('/create', authenticate, validateRequest(createPaymentSchema), PaymentController.createPaymentOrder);
router.post('/verify', authenticate, validateRequest(verifyPaymentSchema), PaymentController.verifyPayment);
router.get('/order/:orderId', authenticate, PaymentController.getPaymentsByOrder);

export default router;
