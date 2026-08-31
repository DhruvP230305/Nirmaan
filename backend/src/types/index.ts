export enum Role {
  BUYER = 'BUYER',
  MANUFACTURER = 'MANUFACTURER',
  ADMIN = 'ADMIN'
}

export enum RFQStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  CLOSED = 'CLOSED',
  CANCELLED = 'CANCELLED'
}

export enum QuoteStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED'
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  IN_PRODUCTION = 'IN_PRODUCTION',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED'
}

export enum PaymentStatus {
  UNPAID = 'UNPAID',
  PARTIALLY_PAID = 'PARTIALLY_PAID',
  PAID = 'PAID',
  REFUNDED = 'REFUNDED'
}

export enum SampleStatus {
  REQUESTED = 'REQUESTED',
  APPROVED = 'APPROVED',
  PREPARING = 'PREPARING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  REVIEWED = 'REVIEWED',
  REJECTED = 'REJECTED'
}

export enum PaymentProvider {
  STRIPE = 'STRIPE',
  RAZORPAY = 'RAZORPAY',
  BANK_TRANSFER = 'BANK_TRANSFER'
}

export interface UserPayload {
  id: string;
  userId?: string;
  email: string;
  role: Role;
}
