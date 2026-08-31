import { Role, RFQStatus, QuoteStatus } from '../types/index.js';
import { prisma } from '../config/database.js';
import { CreateRfqInput, CreateQuoteInput, UpdateQuoteStatusInput } from '../schemas/rfq.schema.js';
import { UserPayload } from '../types/index.js';

export class RfqService {
  /**
   * Creates a new RFQ posted by a Buyer.
   */
  static async createRfq(buyerId: string, input: CreateRfqInput) {
    return prisma.rFQ.create({
      data: {
        title: input.title,
        description: input.description,
        quantity: input.quantity,
        unit: input.unit,
        targetPrice: input.targetPrice,
        categoryId: input.categoryId,
        buyerId,
      },
      include: {
        category: true,
        buyer: {
          select: {
            id: true,
            name: true,
            companyName: true,
            buyerProfile: true,
          },
        },
      },
    });
  }

  /**
   * Lists RFQs based on role:
   * - Buyers see their submitted RFQs.
   * - Manufacturers browse open marketplace RFQs.
   */
  static async getRfqs(user: UserPayload) {
    if (user.role === Role.BUYER) {
      return prisma.rFQ.findMany({
        where: { buyerId: user.id },
        orderBy: { createdAt: 'desc' },
        include: {
          category: true,
          quotes: {
            include: {
              manufacturer: {
                select: {
                  id: true,
                  name: true,
                  companyName: true,
                  manufacturerProfile: true,
                },
              },
            },
          },
        },
      });
    }

    // Manufacturers or Admins see open marketplace RFQs
    return prisma.rFQ.findMany({
      where: user.role === Role.ADMIN ? {} : { status: { in: [RFQStatus.OPEN, RFQStatus.IN_PROGRESS] } },
      orderBy: { createdAt: 'desc' },
      include: {
        category: true,
        buyer: {
          select: {
            id: true,
            name: true,
            companyName: true,
          },
        },
        _count: {
          select: { quotes: true },
        },
      },
    });
  }

  /**
   * Fetches single RFQ details by ID with submitted quotes.
   */
  static async getRfqById(rfqId: string) {
    const rfq = await prisma.rFQ.findUnique({
      where: { id: rfqId },
      include: {
        category: true,
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
        quotes: {
          orderBy: { createdAt: 'desc' },
          include: {
            manufacturer: {
              select: {
                id: true,
                name: true,
                companyName: true,
                phone: true,
                manufacturerProfile: true,
              },
            },
          },
        },
      },
    });

    if (!rfq) {
      const error: any = new Error('RFQ not found');
      error.status = 404;
      error.code = 'RFQ_NOT_FOUND';
      throw error;
    }

    return rfq;
  }

  /**
   * Manufacturer submits a quote for an open RFQ.
   */
  static async submitQuote(rfqId: string, manufacturerId: string, input: CreateQuoteInput) {
    const rfq = await prisma.rFQ.findUnique({ where: { id: rfqId } });

    if (!rfq) {
      const error: any = new Error('RFQ not found');
      error.status = 404;
      error.code = 'RFQ_NOT_FOUND';
      throw error;
    }

    if (rfq.status === RFQStatus.CLOSED || rfq.status === RFQStatus.CANCELLED) {
      const error: any = new Error('Cannot submit quote to a closed or cancelled RFQ');
      error.status = 400;
      error.code = 'RFQ_CLOSED';
      throw error;
    }

    const existingQuote = await prisma.quote.findFirst({
      where: { rfqId, manufacturerId },
    });

    if (existingQuote) {
      const error: any = new Error('You have already submitted a quote for this RFQ');
      error.status = 400;
      error.code = 'QUOTE_EXISTS';
      throw error;
    }

    return prisma.$transaction(async (tx) => {
      const quote = await tx.quote.create({
        data: {
          rfqId,
          manufacturerId,
          unitPrice: input.unitPrice,
          totalPrice: input.totalPrice,
          deliveryTimeDays: input.deliveryTimeDays,
          notes: input.notes,
        },
        include: {
          manufacturer: {
            select: {
              id: true,
              name: true,
              companyName: true,
            },
          },
        },
      });

      // Update RFQ status to IN_PROGRESS when first quote is submitted
      if (rfq.status === RFQStatus.OPEN) {
        await tx.rFQ.update({
          where: { id: rfqId },
          data: { status: RFQStatus.IN_PROGRESS },
        });
      }

      return quote;
    });
  }

  /**
   * Buyer accepts or rejects a submitted quote.
   */
  static async updateQuoteStatus(quoteId: string, buyerId: string, input: UpdateQuoteStatusInput) {
    const quote = await prisma.quote.findUnique({
      where: { id: quoteId },
      include: { rfq: true },
    });

    if (!quote) {
      const error: any = new Error('Quote not found');
      error.status = 404;
      error.code = 'QUOTE_NOT_FOUND';
      throw error;
    }

    if (quote.rfq.buyerId !== buyerId) {
      const error: any = new Error('Unauthorized. You can only manage quotes for your own RFQs.');
      error.status = 403;
      error.code = 'FORBIDDEN';
      throw error;
    }

    return prisma.$transaction(async (tx) => {
      const updatedQuote = await tx.quote.update({
        where: { id: quoteId },
        data: { status: input.status },
      });

      if (input.status === QuoteStatus.ACCEPTED) {
        // Reject all other pending quotes for this RFQ
        await tx.quote.updateMany({
          where: {
            rfqId: quote.rfqId,
            id: { not: quoteId },
            status: QuoteStatus.PENDING,
          },
          data: { status: QuoteStatus.REJECTED },
        });

        // Close the RFQ
        await tx.rFQ.update({
          where: { id: quote.rfqId },
          data: { status: RFQStatus.CLOSED },
        });

        // Generate an Order
        const orderNumber = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
        await tx.order.create({
          data: {
            orderNumber,
            quantity: quote.rfq.quantity,
            unitPrice: quote.unitPrice,
            totalAmount: quote.totalPrice,
            shippingAddress: 'Pending Address', // TODO: Get from buyer profile
            buyerId: buyerId,
            manufacturerId: quote.manufacturerId,
            rfqId: quote.rfqId,
            quoteId: quote.id,
            status: 'PENDING',
          }
        });
      }

      return updatedQuote;
    });
  }
}
