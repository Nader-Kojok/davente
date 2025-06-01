import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { comparePassword, generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    console.log('🔐 Login attempt started');
    
    const body = await request.json();
    const { mobile, password } = body;

    console.log('📱 Login attempt for mobile:', mobile?.substring(0, 8) + '...');

    // Validation
    if (!mobile || !password) {
      console.log('❌ Missing mobile or password');
      return NextResponse.json(
        { error: 'Téléphone et mot de passe sont requis' },
        { status: 400 }
      );
    }

    // Test database connection
    try {
      await prisma.$connect();
      console.log('✅ Database connection successful');
    } catch (dbError) {
      console.error('❌ Database connection failed:', dbError);
      return NextResponse.json(
        { error: 'Erreur de connexion à la base de données' },
        { status: 500 }
      );
    }

    // Find user by mobile
    console.log('🔍 Searching for user...');
    const user = await prisma.user.findUnique({
      where: { mobile }
    });

    if (!user) {
      console.log('❌ User not found');
      return NextResponse.json(
        { error: 'Numéro de téléphone ou mot de passe incorrect' },
        { status: 401 }
      );
    }

    console.log('✅ User found:', user.name);

    // Compare password
    console.log('🔒 Verifying password...');
    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      console.log('❌ Invalid password');
      return NextResponse.json(
        { error: 'Numéro de téléphone ou mot de passe incorrect' },
        { status: 401 }
      );
    }

    console.log('✅ Password valid');

    // Generate JWT token
    console.log('🎫 Generating token...');
    const token = generateToken({
      userId: user.id,
      mobile: user.mobile,
      name: user.name
    });

    // Return user data (without password) and token
    const { password: _, ...userWithoutPassword } = user;

    console.log('✅ Login successful for user:', user.name);

    return NextResponse.json({
      user: userWithoutPassword,
      token,
      message: 'Connexion réussie'
    });

  } catch (error) {
    console.error('❌ Login error:', error);
    
    // More detailed error information
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    return NextResponse.json(
      { 
        error: 'Erreur serveur lors de la connexion',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 