import { Role } from '../types/index.js';
import { prisma } from '../config/database.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { generateToken } from '../utils/jwt.js';
import { RegisterInput, LoginInput, UpdateProfileInput } from '../schemas/auth.schema.js';

export class AuthService {
  /**
   * Registers a new user (Buyer or Manufacturer) with role-specific profile setup.
   */
  static async registerUser(input: RegisterInput) {
    const existingUser = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (existingUser) {
      const error: any = new Error('Email is already registered');
      error.status = 400;
      error.code = 'EMAIL_EXISTS';
      throw error;
    }

    const passwordHash = await hashPassword(input.password);

    const user = await prisma.$transaction(async (tx) => {
      const createdUser = await tx.user.create({
        data: {
          email: input.email,
          passwordHash,
          name: input.name,
          role: input.role,
          phone: input.phone,
          companyName: input.companyName,
        },
      });

      if (input.role === Role.BUYER) {
        await tx.buyerProfile.create({
          data: {
            userId: createdUser.id,
            businessType: input.businessType,
            address: input.address,
            city: input.city,
            country: input.country,
          },
        });
      } else if (input.role === Role.MANUFACTURER) {
        await tx.manufacturerProfile.create({
          data: {
            userId: createdUser.id,
            factoryName: input.factoryName || input.companyName || `${input.name}'s Factory`,
            factoryAddress: input.factoryAddress || input.address,
            city: input.city,
            country: input.country,
            certifications: input.certifications ? JSON.stringify(input.certifications) : "[]",
            productionCapacity: input.productionCapacity,
            minOrderQuantity: input.minOrderQuantity,
          },
        });
      }

      return tx.user.findUnique({
        where: { id: createdUser.id },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          companyName: true,
          phone: true,
          isVerified: true,
          createdAt: true,
          buyerProfile: true,
          manufacturerProfile: true,
        },
      });
    });

    if (!user) {
      throw new Error('Failed to create user account');
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role as Role,
    });

    return { user, token };
  }

  /**
   * Authenticates user email & password.
   */
  static async loginUser(input: LoginInput) {
    const user = await prisma.user.findUnique({
      where: { email: input.email },
      include: {
        buyerProfile: true,
        manufacturerProfile: true,
      },
    });

    if (!user) {
      const error: any = new Error('Invalid email or password');
      error.status = 401;
      error.code = 'INVALID_CREDENTIALS';
      throw error;
    }

    const isMatch = await comparePassword(input.password, user.passwordHash);
    if (!isMatch) {
      const error: any = new Error('Invalid email or password');
      error.status = 401;
      error.code = 'INVALID_CREDENTIALS';
      throw error;
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role as Role,
    });

    // Omit passwordHash from return object
    const { passwordHash: _, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, token };
  }

  /**
   * Fetches full profile details for the logged-in user.
   */
  static async getUserProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        companyName: true,
        phone: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
        buyerProfile: true,
        manufacturerProfile: true,
      },
    });

    if (!user) {
      const error: any = new Error('User not found');
      error.status = 404;
      error.code = 'USER_NOT_FOUND';
      throw error;
    }

    return user;
  }

  /**
   * Updates profile information for the specified user.
   */
  static async updateUserProfile(userId: string, input: UpdateProfileInput) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      const error: any = new Error('User not found');
      error.status = 404;
      error.code = 'USER_NOT_FOUND';
      throw error;
    }

    const updatedUser = await prisma.$transaction(async (tx) => {
      // 1. Update user main fields
      await tx.user.update({
        where: { id: userId },
        data: {
          name: input.name,
          phone: input.phone,
          companyName: input.companyName,
        },
      });

      // 2. Update Role Specific Profile
      if (user.role === Role.BUYER) {
        await tx.buyerProfile.upsert({
          where: { userId },
          create: {
            userId,
            businessType: input.businessType,
            taxId: input.taxId,
            address: input.address,
            city: input.city,
            country: input.country,
            website: input.website,
          },
          update: {
            businessType: input.businessType,
            taxId: input.taxId,
            address: input.address,
            city: input.city,
            country: input.country,
            website: input.website,
          },
        });
      } else if (user.role === Role.MANUFACTURER) {
        await tx.manufacturerProfile.upsert({
          where: { userId },
          create: {
            userId,
            factoryName: input.factoryName || input.companyName || `${user.name}'s Factory`,
            factoryAddress: input.factoryAddress || input.address,
            city: input.city,
            country: input.country,
            certifications: input.certifications ? JSON.stringify(input.certifications) : "[]",
            productionCapacity: input.productionCapacity,
            minOrderQuantity: input.minOrderQuantity,
          },
          update: {
            factoryName: input.factoryName,
            factoryAddress: input.factoryAddress,
            city: input.city,
            country: input.country,
            certifications: input.certifications ? JSON.stringify(input.certifications) : undefined,
            productionCapacity: input.productionCapacity,
            minOrderQuantity: input.minOrderQuantity,
          },
        });
      }

      return tx.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          companyName: true,
          phone: true,
          isVerified: true,
          createdAt: true,
          updatedAt: true,
          buyerProfile: true,
          manufacturerProfile: true,
        },
      });
    });

    return updatedUser;
  }
}
