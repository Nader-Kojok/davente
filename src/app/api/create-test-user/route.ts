import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST() {
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
    
    return NextResponse.json({
      success: true,
      message: 'Test user created successfully',
      user: {
        id: user.id,
        name: user.name,
        mobile: user.mobile,
        email: user.email
      }
    });
    
  } catch (error: any) {
    console.error('❌ Error creating user:', error);
    
    if (error.code === 'P2002') {
      return NextResponse.json({
        success: false,
        error: 'User already exists with this mobile number'
      }, { status: 409 });
    }
    
    return NextResponse.json({
      success: false,
      error: 'Failed to create test user',
      details: error.message
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
} 