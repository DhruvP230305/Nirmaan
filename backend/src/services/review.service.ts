import { prisma } from '../config/database.js';
import { CreateReviewInput } from '../schemas/review.schema.js';

export class ReviewService {
  static async createReview(buyerId: string, input: CreateReviewInput) {
    const order = await prisma.order.findUnique({ where: { id: input.orderId } });

    if (!order) {
      const error: any = new Error('Order not found');
      error.status = 404;
      error.code = 'NOT_FOUND';
      throw error;
    }

    if (order.buyerId !== buyerId) {
      const error: any = new Error('Only the buyer of this order can leave a review');
      error.status = 403;
      error.code = 'FORBIDDEN';
      throw error;
    }

    // Check existing review
    const existing = await prisma.review.findFirst({
      where: { orderId: input.orderId, buyerId },
    });

    if (existing) {
      const error: any = new Error('You have already submitted a review for this order');
      error.status = 400;
      error.code = 'ALREADY_REVIEWED';
      throw error;
    }

    const review = await prisma.review.create({
      data: {
        buyerId,
        manufacturerId: input.manufacturerId,
        orderId: input.orderId,
        rating: input.rating,
        qualityRating: input.qualityRating,
        deliveryRating: input.deliveryRating,
        comment: input.comment,
      },
    });

    // Update Manufacturer overall rating metrics & trust score
    const allReviews = await prisma.review.findMany({
      where: { manufacturerId: input.manufacturerId },
    });

    const totalCount = allReviews.length;
    const avgRating = allReviews.reduce((acc, r) => acc + r.rating, 0) / totalCount;
    const avgQuality = allReviews.reduce((acc, r) => acc + r.qualityRating, 0) / totalCount;
    const avgDelivery = allReviews.reduce((acc, r) => acc + r.deliveryRating, 0) / totalCount;

    await prisma.manufacturerProfile.updateMany({
      where: { userId: input.manufacturerId },
      data: {
        rating: Math.round(avgRating * 10) / 10,
        qualityRating: Math.round(avgQuality * 10) / 10,
        deliveryRating: Math.round(avgDelivery * 10) / 10,
        reviewCount: totalCount,
      },
    });

    return review;
  }

  static async getManufacturerReviews(manufacturerId: string) {
    return prisma.review.findMany({
      where: { manufacturerId },
      include: {
        buyer: { select: { id: true, name: true, companyName: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
