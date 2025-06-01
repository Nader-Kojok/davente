import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

// DELETE /api/bookmarks/[id] - Supprimer un bookmark
export async function DELETE(
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

    // Supprimer le bookmark avec une requête SQL brute
    const deletedCount = await prisma.$executeRaw`
      DELETE FROM "Bookmark" 
      WHERE "userId" = ${payload.userId} AND "annonceId" = ${annonceId}
    `;

    if (deletedCount === 0) {
      return NextResponse.json(
        { error: 'Favori introuvable' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Annonce supprimée des favoris'
    });

  } catch (error) {
    console.error('Error removing bookmark:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la suppression du favori' },
      { status: 500 }
    );
  }
} 