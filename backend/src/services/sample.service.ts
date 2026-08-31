import { prisma } from '../config/database.js';
import { CreateSampleInput, UpdateSampleStatusInput } from '../schemas/sample.schema.js';

export class SampleService {
  static async createSample(buyerId: string, input: CreateSampleInput) {
    return prisma.sampleRequest.create({
      data: {
        buyerId,
        manufacturerId: input.manufacturerId,
        productId: input.productId,
        quantity: input.quantity,
        price: input.price,
        notes: input.notes,
        status: 'REQUESTED',
      },
      include: {
        product: true,
        manufacturer: {
          select: { id: true, name: true, companyName: true },
        },
      },
    });
  }

  static async getSamples(userId: string, role: string) {
    const whereClause: any = {};
    if (role === 'BUYER') {
      whereClause.buyerId = userId;
    } else if (role === 'MANUFACTURER') {
      whereClause.manufacturerId = userId;
    }

    return prisma.sampleRequest.findMany({
      where: whereClause,
      include: {
        buyer: { select: { id: true, name: true, email: true } },
        manufacturer: { select: { id: true, name: true, companyName: true } },
        product: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getSampleById(id: string, userId: string) {
    const sample = await prisma.sampleRequest.findUnique({
      where: { id },
      include: {
        buyer: { select: { id: true, name: true, email: true } },
        manufacturer: { select: { id: true, name: true, companyName: true } },
        product: true,
      },
    });

    if (!sample) {
      const error: any = new Error('Sample request not found');
      error.status = 404;
      error.code = 'NOT_FOUND';
      throw error;
    }

    if (sample.buyerId !== userId && sample.manufacturerId !== userId) {
      const error: any = new Error('Unauthorized to view this sample request');
      error.status = 403;
      error.code = 'FORBIDDEN';
      throw error;
    }

    return sample;
  }

  static async updateSampleStatus(id: string, userId: string, input: UpdateSampleStatusInput) {
    const sample = await prisma.sampleRequest.findUnique({ where: { id } });

    if (!sample) {
      const error: any = new Error('Sample request not found');
      error.status = 404;
      error.code = 'NOT_FOUND';
      throw error;
    }

    return prisma.sampleRequest.update({
      where: { id },
      data: {
        status: input.status,
        trackingNumber: input.trackingNumber || sample.trackingNumber,
      },
    });
  }
}
