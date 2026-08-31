import { prisma } from '../config/database.js';
import { CreateProductInput, UpdateProductInput } from '../schemas/product.schema.js';

export class ProductService {
  /**
   * Creates a new product for a manufacturer.
   */
  static async createProduct(manufacturerId: string, input: CreateProductInput) {
    return prisma.product.create({
      data: {
        title: input.title,
        description: input.description,
        price: input.price,
        minOrderQuantity: input.minOrderQuantity,
        unit: input.unit,
        images: input.images ? JSON.stringify(input.images) : undefined,
        categoryId: input.categoryId,
        manufacturerId,
      },
      include: {
        category: true,
        manufacturer: {
          select: {
            id: true,
            name: true,
            companyName: true,
            manufacturerProfile: true,
          },
        },
      },
    });
  }

  /**
   * Lists products with filtering, searching, and pagination.
   */
  static async getProducts(filters: { categoryId?: string; categories?: string; search?: string; moq?: number; verified?: boolean; sort?: string; page?: number; limit?: number }) {
    const page = filters.page && filters.page > 0 ? filters.page : 1;
    const limit = filters.limit && filters.limit > 0 ? filters.limit : 10;
    const skip = (page - 1) * limit;

    const whereClause: any = {
      status: 'ACTIVE',
    };

    if (filters.categoryId) {
      whereClause.categoryId = filters.categoryId;
    }

    if (filters.categories) {
      const cats = filters.categories.split(',').map(c => c.trim());
      whereClause.category = {
        name: { in: cats }
      };
    }

    if (filters.moq) {
      whereClause.minOrderQuantity = { lte: filters.moq };
    }

    if (filters.verified) {
      whereClause.manufacturer = {
        manufacturerProfile: {
          verificationStatus: 'VERIFIED'
        }
      };
    }

    if (filters.search) {
      whereClause.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
        { manufacturer: { companyName: { contains: filters.search, mode: 'insensitive' } } }
      ];
    }

    let orderBy: any = { createdAt: 'desc' };
    if (filters.sort) {
      if (filters.sort === 'Price: Low to High') orderBy = { price: 'asc' };
      if (filters.sort === 'Price: High to Low') orderBy = { price: 'desc' };
      if (filters.sort === 'MOQ: Low to High') orderBy = { minOrderQuantity: 'asc' };
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy,
        include: {
          category: true,
          manufacturer: {
            select: {
              id: true,
              name: true,
              companyName: true,
              manufacturerProfile: true,
            },
          },
        },
      }),
      prisma.product.count({ where: whereClause }),
    ]);

    return {
      products,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Fetches single product details by ID.
   */
  static async getProductById(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
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
      },
    });

    if (!product) {
      const error: any = new Error('Product not found');
      error.status = 404;
      error.code = 'PRODUCT_NOT_FOUND';
      throw error;
    }

    return product;
  }

  /**
   * Updates product details if owned by manufacturer.
   */
  static async updateProduct(id: string, manufacturerId: string, input: UpdateProductInput) {
    const product = await prisma.product.findUnique({ where: { id } });

    if (!product) {
      const error: any = new Error('Product not found');
      error.status = 404;
      error.code = 'PRODUCT_NOT_FOUND';
      throw error;
    }

    if (product.manufacturerId !== manufacturerId) {
      const error: any = new Error('Unauthorized. You can only update your own products.');
      error.status = 403;
      error.code = 'FORBIDDEN';
      throw error;
    }

    const { images, ...rest } = input;

    return prisma.product.update({
      where: { id },
      data: {
        ...rest,
        images: images ? JSON.stringify(images) : undefined,
      },
      include: {
        category: true,
      },
    });
  }

  /**
   * Deletes a product if owned by manufacturer.
   */
  static async deleteProduct(id: string, manufacturerId: string) {
    const product = await prisma.product.findUnique({ where: { id } });

    if (!product) {
      const error: any = new Error('Product not found');
      error.status = 404;
      error.code = 'PRODUCT_NOT_FOUND';
      throw error;
    }

    if (product.manufacturerId !== manufacturerId) {
      const error: any = new Error('Unauthorized. You can only delete your own products.');
      error.status = 403;
      error.code = 'FORBIDDEN';
      throw error;
    }

    await prisma.product.delete({ where: { id } });
    return { id };
  }
}
