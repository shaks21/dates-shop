// // scripts/migrate-products.ts
// import { PrismaClient } from '@prisma/client';
// import mongoose from 'mongoose';
// import { Product as MongoProduct } from '@/models/Product';


// const prisma = new PrismaClient();

// async function migrateProducts() {
//   try {
//     console.log('Starting product migration...');

//     // Connect to MongoDB
//     if (!process.env.MONGODB_URI) {
//       throw new Error('MONGODB_URI environment variable is required');
//     }
    
//     await mongoose.connect(process.env.MONGODB_URI);
//     console.log('✅ Connected to MongoDB');

//     // Connect to PostgreSQL
//     await prisma.$connect();
//     console.log('✅ Connected to PostgreSQL');

//     // Fetch all products from MongoDB
//     const mongoProducts = await MongoProduct.find({});
//     console.log(`📦 Found ${mongoProducts.length} products to migrate`);

//     let successCount = 0;
//     let skipCount = 0;

//     // Migrate each product
//     for (const mongoProduct of mongoProducts) {
//       try {
//         // Check if product already exists in PostgreSQL (by slug)
//         const existingProduct = await prisma.product.findUnique({
//           where: { slug: mongoProduct.slug }
//         });

//         if (existingProduct) {
//           console.log(`⏭️  Skipping existing product: ${mongoProduct.slug}`);
//           skipCount++;
//           continue;
//         }

//         // Create product in PostgreSQL
//         await prisma.product.create({
//           data: {
//             title: mongoProduct.title,
//             slug: mongoProduct.slug,
//             description: mongoProduct.description,
//             price: mongoProduct.price, // Assuming price is in cents
//             image: mongoProduct.image,
//             // createdAt and updatedAt will be set automatically
//           }
//         });

//         successCount++;
//         console.log(`✅ Migrated: ${mongoProduct.title}`);

//       } catch (error) {
//         console.error(`❌ Error migrating product ${mongoProduct.title}:`, error);
//       }
//     }

//     console.log('\n📊 Migration Summary:');
//     console.log(`✅ Successfully migrated: ${successCount} products`);
//     console.log(`⏭️  Skipped (already exists): ${skipCount} products`);
//     console.log(`❌ Failed: ${mongoProducts.length - successCount - skipCount} products`);
    
//   } catch (error) {
//     console.error('❌ Migration error:', error);
//   } finally {
//     // Close connections
//     await mongoose.disconnect().catch(() => {});
//     await prisma.$disconnect().catch(() => {});
//     console.log('🔌 Disconnected from databases');
//     process.exit(0);
//   }
// }

// // Run the migration
// migrateProducts();

// export { migrateProducts };