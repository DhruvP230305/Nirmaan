import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clean the database
  console.log('🧹 Cleaning existing data...');
  await prisma.review.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.milestone.deleteMany();
  await prisma.order.deleteMany();
  await prisma.sampleRequest.deleteMany();
  await prisma.quote.deleteMany();
  await prisma.rFQ.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.buyerProfile.deleteMany();
  await prisma.manufacturerProfile.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('password123', 10);

  // 1. Create Admin
  console.log('👤 Creating Admin...');
  const admin = await prisma.user.create({
    data: {
      email: 'admin@nirmaan.com',
      passwordHash,
      name: 'Super Admin',
      role: 'ADMIN',
      isVerified: true,
    },
  });

  // 2. Create Categories
  console.log('📁 Creating Categories...');
  const categoryEarrings = await prisma.category.create({
    data: { name: 'Earrings', slug: 'earrings', description: 'All types of earrings' },
  });
  const categoryNecklaces = await prisma.category.create({
    data: { name: 'Necklaces', slug: 'necklaces', description: 'Pendants and chains' },
  });
  const categoryRings = await prisma.category.create({
    data: { name: 'Rings', slug: 'rings', description: 'Casual and premium rings' },
  });

  // 3. Create Buyers
  console.log('🛒 Creating Buyers...');
  const buyer1 = await prisma.user.create({
    data: {
      email: 'buyer@d2c.com',
      passwordHash,
      name: 'Riya Sharma',
      companyName: 'Lumina Jewels',
      role: 'BUYER',
      isVerified: true,
      buyerProfile: {
        create: {
          businessType: 'D2C Brand',
          city: 'Mumbai',
          country: 'India',
        },
      },
    },
  });

  const buyer2 = await prisma.user.create({
    data: {
      email: 'founder@aesthetic.com',
      passwordHash,
      name: 'Kabir Singh',
      companyName: 'Aesthetic Aura',
      role: 'BUYER',
      isVerified: true,
      buyerProfile: {
        create: {
          businessType: 'Instagram Store',
          city: 'Delhi',
          country: 'India',
        },
      },
    },
  });

  // 4. Create Manufacturers
  console.log('🏭 Creating Manufacturers...');
  const mfr1 = await prisma.user.create({
    data: {
      email: 'mfr@factory.com',
      passwordHash,
      name: 'Amit Patel',
      companyName: 'Artisan Metals Co.',
      role: 'MANUFACTURER',
      isVerified: true,
      manufacturerProfile: {
        create: {
          factoryName: 'Artisan Metals Co.',
          city: 'Ahmedabad',
          country: 'India',
          verificationStatus: 'VERIFIED',
          rating: 4.8,
          reviewCount: 24,
          productionCapacity: '10000 pcs/month',
          minOrderQuantity: 50,
          certifications: JSON.stringify(['ISO 9001', 'Hallmark Certified']),
        },
      },
    },
  });

  const mfr2 = await prisma.user.create({
    data: {
      email: 'silver@factory.com',
      passwordHash,
      name: 'Meera Desai',
      companyName: 'Silver Peak Industries',
      role: 'MANUFACTURER',
      isVerified: true,
      manufacturerProfile: {
        create: {
          factoryName: 'Silver Peak Factory',
          city: 'Jaipur',
          country: 'India',
          verificationStatus: 'VERIFIED',
          rating: 4.6,
          reviewCount: 12,
          productionCapacity: '5000 pcs/month',
          minOrderQuantity: 100,
          certifications: JSON.stringify(['Hallmark Certified']),
        },
      },
    },
  });

  const mfrPending = await prisma.user.create({
    data: {
      email: 'new@factory.com',
      passwordHash,
      name: 'Rajesh Kumar',
      companyName: 'Golden Craft Studio',
      role: 'MANUFACTURER',
      isVerified: false,
      manufacturerProfile: {
        create: {
          factoryName: 'Golden Craft Studio',
          city: 'Surat',
          country: 'India',
          verificationStatus: 'PENDING',
          rating: 0,
          reviewCount: 0,
          productionCapacity: '2000 pcs/month',
          minOrderQuantity: 200,
          certifications: '[]',
        },
      },
    },
  });

  // 5. Create Products
  console.log('💎 Creating Products...');
  const productsData = [
    {
      title: '925 Sterling Silver Hoop Earrings',
      description: 'Classic lightweight silver hoops. Anti-tarnish coated.',
      price: 85,
      minOrderQuantity: 50,
      manufacturerId: mfr1.id,
      categoryId: categoryEarrings.id,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?auto=format&fit=crop&q=80&w=800'
      ]),
    },
    {
      title: 'Minimalist Gold-Plated Pendants',
      description: '18k gold plated brass pendants. Custom engravings available.',
      price: 120,
      minOrderQuantity: 100,
      manufacturerId: mfr1.id,
      categoryId: categoryNecklaces.id,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800'
      ]),
    },
    {
      title: 'Boho Statement Rings',
      description: 'Oxidized silver statement rings with semi-precious stones.',
      price: 150,
      minOrderQuantity: 100,
      manufacturerId: mfr2.id,
      categoryId: categoryRings.id,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1543294001-f7cbfe92237e?auto=format&fit=crop&q=80&w=800'
      ]),
    },
    {
      title: 'Diamond Stud Earrings (Moissanite)',
      description: 'Premium quality moissanite studs in 925 silver base.',
      price: 250,
      minOrderQuantity: 20,
      manufacturerId: mfr2.id,
      categoryId: categoryEarrings.id,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?auto=format&fit=crop&q=80&w=800'
      ]),
    }
  ];

  for (const prod of productsData) {
    await prisma.product.create({ data: prod });
  }

  // 6. Create RFQs (Requirements)
  console.log('📝 Creating RFQs...');
  const rfq1 = await prisma.rFQ.create({
    data: {
      title: 'Need 500 Custom Engraved Rings',
      description: 'Looking for a manufacturer to produce 500 brass rings with 18k gold plating and custom logo engraving inside.',
      quantity: 500,
      targetPrice: 100,
      buyerId: buyer1.id,
      categoryId: categoryRings.id,
      status: 'OPEN',
    },
  });

  const rfq2 = await prisma.rFQ.create({
    data: {
      title: '200 pairs of Silver Drop Earrings',
      description: 'Need anti-tarnish 925 silver drop earrings. Design reference attached.',
      quantity: 200,
      targetPrice: 150,
      buyerId: buyer2.id,
      categoryId: categoryEarrings.id,
      status: 'QUOTED',
    },
  });

  // 7. Create Quotes
  console.log('💬 Creating Quotes...');
  const quote1 = await prisma.quote.create({
    data: {
      rfqId: rfq2.id,
      manufacturerId: mfr1.id,
      unitPrice: 145,
      totalPrice: 145 * 200,
      deliveryTimeDays: 15,
      notes: 'We can manufacture these exactly to your spec. Sample can be provided in 3 days.',
      status: 'PENDING',
    },
  });

  const quote2 = await prisma.quote.create({
    data: {
      rfqId: rfq2.id,
      manufacturerId: mfr2.id,
      unitPrice: 130,
      totalPrice: 130 * 200,
      deliveryTimeDays: 20,
      notes: 'Can do this in 20 days. Lowest price guaranteed.',
      status: 'PENDING',
    },
  });

  // 8. Create Orders
  console.log('📦 Creating Orders...');
  const firstProd = await prisma.product.findFirst();
  if (firstProd) {
    const order1 = await prisma.order.create({
      data: {
        orderNumber: 'ORD-2026-001',
        buyerId: buyer1.id,
        manufacturerId: mfr1.id,
        productId: firstProd.id,
        quantity: 100,
        unitPrice: 85,
        totalAmount: 8500,
        status: 'IN_PRODUCTION',
        shippingAddress: '123 Business Park, Mumbai',
      },
    });
  }

  console.log('✅ Seeding complete!');
  console.log('\n--- DEMO ACCOUNTS (Password for all: password123) ---');
  console.log('Admin: admin@nirmaan.com');
  console.log('Buyer: buyer@d2c.com');
  console.log('Manufacturer: mfr@factory.com');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
