import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

// GET /api/bookmarks/check/[id] - Vérifier si une annonce est dans les favoris
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Token d\'authentification requis' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const payload = verifyToken(token);
    
    if (!payload) {
      return NextResponse.json(
        { error: 'Token invalide' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const annonceId = parseInt(id);

    if (isNaN(annonceId)) {
      return NextResponse.json(
        { error: 'ID d\'annonce invalide' },
        { status: 400 }
      );
    }

    // Vérifier l'existence du bookmark avec une requête SQL brute
    const bookmark = await prisma.$queryRaw`
      SELECT id FROM "Bookmark" 
      WHERE "userId" = ${payload.userId} AND "annonceId" = ${annonceId}
      LIMIT 1
    `;

    const isBookmarked = Array.isArray(bookmark) && bookmark.length > 0;

    return NextResponse.json({
      isBookmarked
    });

  } catch (error) {
    console.error('Error checking bookmark:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la vérification du favori' },
      { status: 500 }
    );
  }
} 