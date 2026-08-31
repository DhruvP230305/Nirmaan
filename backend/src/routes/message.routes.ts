import { Router } from 'express';
import { MessageController } from '../controllers/message.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/', authenticate, MessageController.sendMessage);
router.get('/conversations/list', authenticate, MessageController.getConversations);
router.get('/:userId', authenticate, MessageController.getMessages);

export default router;
