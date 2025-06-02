const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    console.log('🔐 Creating test user...');
    
    // Hash the password
    const hashedPassword = await bcrypt.hash('Nadk47!', 10);
    
    // Create the user
    const user = await prisma.user.create({
      data: {
        mobile: '784634040',
        password: hashedPassword,
        name: 'Test User',
        picture: 'https://i.pravatar.cc/150?u=testuser',
        email: 'test@example.com',
        isActive: true,
        isPhoneVerified: true,
      }
    });
    
    console.log('✅ Test user created successfully:', user.name);
    console.log('📱 Mobile:', user.mobile);
    console.log('🆔 ID:', user.id);
    
  } catch (error) {
    if (error.code === 'P2002') {
      console.log('ℹ️ User already exists with this mobile number');
    } else {
      console.error('❌ Error creating user:', error);
    }
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser(); 