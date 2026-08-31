import { prisma } from '../config/database.js';
import { CreatePaymentInput, VerifyPaymentInput } from '../schemas/payment.schema.js';

export class PaymentService {
  static async createPaymentOrder(userId: string, input: CreatePaymentInput) {
    const order = await prisma.order.findUnique({ where: { id: input.orderId } });

    if (!order) {
      const error: any = new Error('Order not found');
      error.status = 404;
      error.code = 'NOT_FOUND';
      throw error;
    }

    // Generate mock Razorpay Order ID for standard integration flow
    const providerOrderId = `rzp_order_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    const payment = await prisma.payment.create({
      data: {
        orderId: input.orderId,
        amount: input.amount,
        provider: input.provider,
        providerOrderId,
        status: 'UNPAID',
      },
    });

    return {
      paymentId: payment.id,
      providerOrderId: payment.providerOrderId,
      amount: payment.amount,
      currency: 'INR',
      key: process.env.RAZORPAY_KEY_ID || 'rzp_test_key_sample',
    };
  }

  static async verifyPayment(input: VerifyPaymentInput) {
    const payment = await prisma.payment.findUnique({ where: { id: input.paymentId } });

    if (!payment) {
      const error: any = new Error('Payment transaction not found');
      error.status = 404;
      error.code = 'NOT_FOUND';
      throw error;
    }

    // Update Payment and Order status upon successful verification
    const updatedPayment = await prisma.payment.update({
      where: { id: input.paymentId },
      data: {
        providerPaymentId: input.providerPaymentId,
        signature: input.signature,
        status: 'PAID',
      },
    });

    await prisma.order.update({
      where: { id: payment.orderId },
      data: {
        paymentStatus: 'PAID',
        status: 'CONFIRMED',
      },
    });

    return updatedPayment;
  }

  static async getPaymentByOrderId(orderId: string) {
    return prisma.payment.findMany({
      where: { orderId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
