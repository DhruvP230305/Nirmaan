import { prisma } from '../config/database.js';
import { UpdateManufacturerProfileInput, SubmitVerificationInput } from '../schemas/manufacturer.schema.js';

export class ManufacturerService {
  /**
   * Get public list of manufacturers with search and filters.
   */
  static async getManufacturers(filters: { search?: string; verificationStatus?: string; city?: string }) {
    const whereClause: any = {};

    if (filters.verificationStatus) {
      whereClause.verificationStatus = filters.verificationStatus;
    }

    if (filters.city) {
      whereClause.city = { contains: filters.city, mode: 'insensitive' };
    }

    if (filters.search) {
      whereClause.OR = [
        { factoryName: { contains: filters.search, mode: 'insensitive' } },
        { user: { companyName: { contains: filters.search, mode: 'insensitive' } } },
      ];
    }

    return prisma.manufacturerProfile.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            companyName: true,
          },
        },
      },
    });
  }

  /**
   * Get single manufacturer profile by ID.
   */
  static async getManufacturerById(id: string) {
    const profile = await prisma.manufacturerProfile.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            companyName: true,
            products: true,
          },
        },
      },
    });

    if (!profile) {
      const error: any = new Error('Manufacturer profile not found');
      error.status = 404;
      error.code = 'NOT_FOUND';
      throw error;
    }

    return profile;
  }

  /**
   * Update current manufacturer profile.
   */
  static async updateProfile(userId: string, input: UpdateManufacturerProfileInput) {
    const profile = await prisma.manufacturerProfile.findUnique({ where: { userId } });

    if (!profile) {
      const error: any = new Error('Manufacturer profile not found');
      error.status = 404;
      error.code = 'NOT_FOUND';
      throw error;
    }

    const { certifications, ...rest } = input;

    return prisma.manufacturerProfile.update({
      where: { userId },
      data: {
        ...rest,
        certifications: certifications ? JSON.stringify(certifications) : undefined,
      },
    });
  }

  /**
   * Submit business registration/GST documents for verification.
   */
  static async submitVerification(userId: string, input: SubmitVerificationInput) {
    return prisma.manufacturerProfile.update({
      where: { userId },
      data: {
        verificationStatus: 'PENDING',
      },
    });
  }
}
