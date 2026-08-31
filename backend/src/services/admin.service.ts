import { prisma } from '../config/database.js';
import { UpdateVerificationStatusInput } from '../schemas/admin.schema.js';

export class AdminService {
  static async getPlatformStats() {
    const [totalUsers, totalManufacturers, totalProducts, totalOrders, totalRfqs] = await Promise.all([
      prisma.user.count(),
      prisma.manufacturerProfile.count(),
      prisma.product.count(),
      prisma.order.count(),
      prisma.rFQ.count(),
    ]);

    return {
      totalUsers,
      totalManufacturers,
      totalProducts,
      totalOrders,
      totalRfqs,
    };
  }

  static async getPendingVerifications() {
    return prisma.manufacturerProfile.findMany({
      where: { verificationStatus: 'PENDING' },
      include: {
        user: { select: { id: true, name: true, email: true, companyName: true } },
      },
    });
  }

  static async updateVerificationStatus(input: UpdateVerificationStatusInput) {
    const profile = await prisma.manufacturerProfile.findUnique({
      where: { id: input.manufacturerProfileId },
    });

    if (!profile) {
      const error: any = new Error('Manufacturer profile not found');
      error.status = 404;
      error.code = 'NOT_FOUND';
      throw error;
    }

    const updatedProfile = await prisma.manufacturerProfile.update({
      where: { id: input.manufacturerProfileId },
      data: { verificationStatus: input.status },
    });

    // Also update main User model isVerified boolean flag
    await prisma.user.update({
      where: { id: profile.userId },
      data: { isVerified: input.status === 'VERIFIED' },
    });

    return updatedProfile;
  }

  static async getUsers() {
    return prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        companyName: true,
        role: true,
        isVerified: true,
        createdAt: true,
      }
    });
  }

  static async getManufacturers() {
    return prisma.manufacturerProfile.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, name: true, email: true, companyName: true, isVerified: true } },
      },
    });
  }
}
