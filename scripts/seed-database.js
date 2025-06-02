const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function seedDatabase() {
  try {
    console.log('🌱 Seeding database...');
    
    // Create categories
    const categories = await Promise.all([
      prisma.category.create({
        data: {
          name: 'Électronique',
          slug: 'electronique',
          icon: '📱',
          description: 'Téléphones, ordinateurs, et gadgets électroniques',
          sortOrder: 1
        }
      }),
      prisma.category.create({
        data: {
          name: 'Véhicules',
          slug: 'vehicules',
          icon: '🚗',
          description: 'Voitures, motos, et autres véhicules',
          sortOrder: 2
        }
      }),
      prisma.category.create({
        data: {
          name: 'Immobilier',
          slug: 'immobilier',
          icon: '🏠',
          description: 'Maisons, appartements, et terrains',
          sortOrder: 3
        }
      })
    ]);
    
    console.log('✅ Categories created');
    
    // Create subcategories
    const subcategories = await Promise.all([
      prisma.subcategory.create({
        data: {
          name: 'Téléphones & Objets connectés',
          slug: 'telephones-objets-connectes',
          categoryId: categories[0].id,
          sortOrder: 1
        }
      }),
      prisma.subcategory.create({
        data: {
          name: 'Ordinateurs',
          slug: 'ordinateurs',
          categoryId: categories[0].id,
          sortOrder: 2
        }
      }),
      prisma.subcategory.create({
        data: {
          name: 'Voitures',
          slug: 'voitures',
          categoryId: categories[1].id,
          sortOrder: 1
        }
      })
    ]);
    
    console.log('✅ Subcategories created');
    
    // Create test users
    const hashedPassword = await bcrypt.hash('Nadk47!', 10);
    
    const users = await Promise.all([
      prisma.user.create({
        data: {
          mobile: '784634040',
          password: hashedPassword,
          name: 'Test User',
          picture: 'https://i.pravatar.cc/150?u=testuser',
          email: 'test@example.com',
          isPhoneVerified: true,
          isActive: true
        }
      }),
      prisma.user.create({
        data: {
          mobile: '771234567',
          password: hashedPassword,
          name: 'Dimi',
          picture: 'https://i.pravatar.cc/150?u=dimi',
          email: 'dimi@example.com',
          isPhoneVerified: true,
          isActive: true
        }
      }),
      prisma.user.create({
        data: {
          mobile: '775678901',
          password: hashedPassword,
          name: 'TechPro',
          picture: 'https://i.pravatar.cc/150?u=techpro',
          email: 'techpro@example.com',
          isPhoneVerified: true,
          isActive: true
        }
      })
    ]);
    
    console.log('✅ Users created');
    
    // Create test annonces
    const annonces = await Promise.all([
      prisma.annonce.create({
        data: {
          title: 'Samsung Galaxy S23 Lavande',
          description: 'Téléphone en excellent état, utilisé 6 mois seulement.',
          price: 280000,
          location: 'Dakar',
          picture: 'https://picsum.photos/400?random=1',
          gallery: ['https://picsum.photos/400?random=1', 'https://picsum.photos/400?random=2'],
          userId: users[1].id,
          categoryId: categories[0].id,
          subcategoryId: subcategories[0].id,
          condition: 'excellent',
          status: 'active'
        }
      }),
      prisma.annonce.create({
        data: {
          title: 'iPhone 14 Pro Max',
          description: 'iPhone 14 Pro Max 256GB, couleur violet, avec tous les accessoires.',
          price: 899000,
          location: 'Thiès',
          picture: 'https://picsum.photos/400?random=3',
          gallery: ['https://picsum.photos/400?random=3'],
          userId: users[2].id,
          categoryId: categories[0].id,
          subcategoryId: subcategories[0].id,
          condition: 'neuf',
          status: 'active'
        }
      }),
      prisma.annonce.create({
        data: {
          title: 'MacBook Pro M2 13"',
          description: 'MacBook Pro M2 13 pouces, 16GB RAM, 512GB SSD. Parfait pour le développement.',
          price: 1299000,
          location: 'Dakar',
          picture: 'https://picsum.photos/400?random=4',
          gallery: ['https://picsum.photos/400?random=4', 'https://picsum.photos/400?random=5'],
          userId: users[0].id,
          categoryId: categories[0].id,
          subcategoryId: subcategories[1].id,
          condition: 'excellent',
          status: 'active'
        }
      })
    ]);
    
    console.log('✅ Annonces created');
    
    console.log('🎉 Database seeded successfully!');
    console.log(`Created ${categories.length} categories`);
    console.log(`Created ${subcategories.length} subcategories`);
    console.log(`Created ${users.length} users`);
    console.log(`Created ${annonces.length} annonces`);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedDatabase(); 