import { prisma } from '../config/database.js';

export class MessageService {
  static async sendMessage(senderId: string, receiverId: string, content: string) {
    if (!content || !receiverId) {
       const error: any = new Error('Content and receiverId are required');
       error.status = 400;
       throw error;
    }
    return prisma.message.create({
      data: {
        senderId,
        receiverId,
        content
      }
    });
  }

  static async getMessages(userId1: string, userId2: string) {
    return prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId1, receiverId: userId2 },
          { senderId: userId2, receiverId: userId1 },
        ]
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  static async getConversations(userId: string) {
    const messages = await prisma.message.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }]
      },
      orderBy: { createdAt: 'desc' },
      include: {
        sender: { select: { id: true, name: true, companyName: true, role: true } },
        receiver: { select: { id: true, name: true, companyName: true, role: true } }
      }
    });

    const conversationMap = new Map<string, any>();
    
    for (const msg of messages) {
      const otherUser = msg.senderId === userId ? msg.receiver : msg.sender;
      if (!conversationMap.has(otherUser.id)) {
        conversationMap.set(otherUser.id, {
          user: otherUser,
          lastMessage: msg
        });
      }
    }
    
    return Array.from(conversationMap.values());
  }
}
