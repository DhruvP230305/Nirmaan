import { Role } from '../types/index.js';
import { prisma } from '../config/database.js';
import {
  CreateOrderInput,
  UpdateOrderStatusInput,
  CreateMilestoneInput,
  UpdateMilestoneInput,
} from '../schemas/order.schema.js';
import { UserPayload } from '../types/index.js';

export class OrderService {
  /**
   * Creates a new purchase order placed by a Buyer.
   */
  static async createOrder(buyerId: string, input: CreateOrderInput) {
    const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `ORD-${timestamp}-${randomSuffix}`;

    return prisma.order.create({
      data: {
        orderNumber,
        buyerId,
        manufacturerId: input.manufacturerId,
        productId: input.productId,
        rfqId: input.rfqId,
        quoteId: input.quoteId,
        quantity: input.quantity,
        unitPrice: input.unitPrice,
        totalAmount: input.totalAmount,
        shippingAddress: input.shippingAddress,
        notes: input.notes,
      },
      include: {
        buyer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            companyName: true,
          },
        },
        manufacturer: {
          select: {
            id: true,
            name: true,
            companyName: true,
            manufacturerProfile: true,
          },
        },
        product: true,
        rfq: true,
        quote: true,
        milestones: true,
      },
    });
  }

  /**
   * Retrieves orders based on user role:
   * - Buyers see their placed orders.
   * - Manufacturers see their assigned production orders.
   */
  static async getOrders(user: UserPayload) {
    const whereClause: any = {};

    if (user.role === Role.BUYER) {
      whereClause.buyerId = user.id;
    } else if (user.role === Role.MANUFACTURER) {
      whereClause.manufacturerId = user.id;
    }

    return prisma.order.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: {
        buyer: {
          select: {
            id: true,
            name: true,
            companyName: true,
          },
        },
        manufacturer: {
          select: {
            id: true,
            name: true,
            companyName: true,
          },
        },
        product: {
          select: {
            id: true,
            title: true,
            images: true,
          },
        },
        milestones: true,
      },
    });
  }

  /**
   * Retrieves single order details by ID.
   */
  static async getOrderById(orderId: string, user: UserPayload) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        buyer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            companyName: true,
            buyerProfile: true,
          },
        },
        manufacturer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            companyName: true,
            manufacturerProfile: true,
          },
        },
        product: true,
        rfq: true,
        quote: true,
        milestones: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!order) {
      const error: any = new Error('Order not found');
      error.status = 404;
      error.code = 'ORDER_NOT_FOUND';
      throw error;
    }

    if (user.role !== Role.ADMIN && order.buyerId !== user.id && order.manufacturerId !== user.id) {
      const error: any = new Error('Unauthorized access to order');
      error.status = 403;
      error.code = 'FORBIDDEN';
      throw error;
    }

    return order;
  }

  /**
   * Updates order status and/or payment status.
   */
  static async updateOrderStatus(orderId: string, user: UserPayload, input: UpdateOrderStatusInput) {
    const order = await prisma.order.findUnique({ where: { id: orderId } });

    if (!order) {
      const error: any = new Error('Order not found');
      error.status = 404;
      error.code = 'ORDER_NOT_FOUND';
      throw error;
    }

    if (user.role !== Role.ADMIN && order.manufacturerId !== user.id) {
      const error: any = new Error('Unauthorized. Only assigned manufacturer can update order status.');
      error.status = 403;
      error.code = 'FORBIDDEN';
      throw error;
    }

    return prisma.order.update({
      where: { id: orderId },
      data: {
        status: input.status,
        ...(input.paymentStatus && { paymentStatus: input.paymentStatus }),
      },
      include: {
        milestones: true,
      },
    });
  }

  /**
   * Adds a production milestone to an order.
   */
  static async addMilestone(orderId: string, manufacturerId: string, input: CreateMilestoneInput) {
    const order = await prisma.order.findUnique({ where: { id: orderId } });

    if (!order) {
      const error: any = new Error('Order not found');
      error.status = 404;
      error.code = 'ORDER_NOT_FOUND';
      throw error;
    }

    if (order.manufacturerId !== manufacturerId) {
      const error: any = new Error('Unauthorized. Only assigned manufacturer can add milestones.');
      error.status = 403;
      error.code = 'FORBIDDEN';
      throw error;
    }

    return prisma.milestone.create({
      data: {
        orderId,
        title: input.title,
        description: input.description,
        dueDate: input.dueDate ? new Date(input.dueDate) : undefined,
      },
    });
  }

  /**
   * Updates an existing production milestone status.
   */
  static async updateMilestone(milestoneId: string, manufacturerId: string, input: UpdateMilestoneInput) {
    const milestone = await prisma.milestone.findUnique({
      where: { id: milestoneId },
      include: { order: true },
    });

    if (!milestone) {
      const error: any = new Error('Milestone not found');
      error.status = 404;
      error.code = 'MILESTONE_NOT_FOUND';
      throw error;
    }

    if (milestone.order.manufacturerId !== manufacturerId) {
      const error: any = new Error('Unauthorized. Only assigned manufacturer can update milestone.');
      error.status = 403;
      error.code = 'FORBIDDEN';
      throw error;
    }

    const isCompleted = input.status === 'COMPLETED';

    return prisma.milestone.update({
      where: { id: milestoneId },
      data: {
        title: input.title,
        description: input.description,
        status: input.status,
        dueDate: input.dueDate ? new Date(input.dueDate) : undefined,
        completedAt: isCompleted ? new Date() : milestone.completedAt,
      },
    });
  }
}
