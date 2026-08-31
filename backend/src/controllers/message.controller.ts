import { Request, Response, NextFunction } from 'express';
import { MessageService } from '../services/message.service.js';
import { successResponse } from '../utils/api-response.js';

export class MessageController {
  static async sendMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const senderId = req.user!.id;
      const { receiverId, content } = req.body;
      const message = await MessageService.sendMessage(senderId, receiverId, content);
      res.status(201).json(successResponse('Message sent', message));
    } catch (error) {
      next(error);
    }
  }

  static async getMessages(req: Request, res: Response, next: NextFunction) {
    try {
      const userId1 = req.user!.id;
      const userId2 = req.params.userId;
      const messages = await MessageService.getMessages(userId1, userId2);
      res.status(200).json(successResponse('Messages fetched', messages));
    } catch (error) {
      next(error);
    }
  }

  static async getConversations(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const conversations = await MessageService.getConversations(userId);
      res.status(200).json(successResponse('Conversations fetched', conversations));
    } catch (error) {
      next(error);
    }
  }
}
