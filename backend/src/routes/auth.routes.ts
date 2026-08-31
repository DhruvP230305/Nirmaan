import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { validateRequest } from '../middleware/validate.middleware.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { registerSchema, loginSchema, updateProfileSchema } from '../schemas/auth.schema.js';

const router = Router();

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register a new Buyer or Manufacturer
 * @access  Public
 */
router.post('/register', validateRequest(registerSchema), AuthController.register);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Authenticate user & get token
 * @access  Public
 */
router.post('/login', validateRequest(loginSchema), AuthController.login);

/**
 * @route   GET /api/v1/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me', authenticate, AuthController.getProfile);

/**
 * @route   PUT /api/v1/auth/profile
 * @desc    Update current user profile
 * @access  Private
 */
router.put('/profile', authenticate, validateRequest(updateProfileSchema), AuthController.updateProfile);

export default router;
