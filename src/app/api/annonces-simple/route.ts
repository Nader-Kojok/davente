import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Test endpoint annonces simple');
    
    // Import dynamique de Prisma
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    
    await prisma.$connect();
    
    // Test de connexion simple
    const count = await prisma.annonce.count();
    console.log('📊 Nombre total d\'annonces:', count);
    
    // Requête simple sans relations
    const annonces = await prisma.annonce.findMany({
      take: 5,
      select: {
        id: true,
        title: true,
        price: true
      }
    });
    
    await prisma.$disconnect();
    
    console.log('✅ Requête réussie, nombre d\'annonces:', annonces.length);
    
    return NextResponse.json({
      success: true,
      total: count,
      data: annonces
    });
  } catch (error) {
    console.error('❌ Erreur dans annonces-simple:', error);
    return NextResponse.json(
      { 
        error: 'Erreur lors de la récupération des annonces',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
} 