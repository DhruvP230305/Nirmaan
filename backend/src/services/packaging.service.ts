import { prisma } from '../config/database.js';
import { CreatePackagingProductInput, CreatePackagingOrderInput } from '../schemas/packaging.schema.js';

export class PackagingService {
  static async createProduct(supplierId: string, input: CreatePackagingProductInput) {
    return prisma.packagingProduct.create({
      data: {
        supplierId,
        title: input.title,
        category: input.category,
        description: input.description,
        price: input.price,
        minOrderQuantity: input.minOrderQuantity,
        images: JSON.stringify(input.images || []),
        customizable: input.customizable,
      },
    });
  }

  static async getProducts(category?: string) {
    const whereClause: any = {};
    if (category) {
      whereClause.category = category;
    }
    return prisma.packagingProduct.findMany({
      where: whereClause,
      include: {
        supplier: { select: { id: true, name: true, companyName: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async createOrder(buyerId: string, input: CreatePackagingOrderInput) {
    const product = await prisma.packagingProduct.findUnique({
      where: { id: input.packagingProductId },
    });

    if (!product) {
      const error: any = new Error('Packaging product not found');
      error.status = 404;
      error.code = 'NOT_FOUND';
      throw error;
    }

    const totalAmount = product.price * input.quantity;

    return prisma.packagingOrder.create({
      data: {
        buyerId,
        packagingProductId: input.packagingProductId,
        quantity: input.quantity,
        unitPrice: product.price,
        totalAmount,
        customLogoUrl: input.customLogoUrl,
        notes: input.notes,
        status: 'PENDING',
      },
      include: {
        packagingProduct: true,
      },
    });
  }

  static async getOrders(userId: string) {
    return prisma.packagingOrder.findMany({
      where: { buyerId: userId },
      include: {
        packagingProduct: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
