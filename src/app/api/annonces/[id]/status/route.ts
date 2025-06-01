import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

// Fonction pour extraire l'utilisateur du token JWT
async function getCurrentUser(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });
    
    return user;
  } catch (_error) {
    return null;
  }
}

// PATCH: Modifie le statut d'une annonce
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
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

    const body = await request.json();
    const { status } = body;

    // Valider le statut
    const validStatuses = ['active', 'inactive', 'sold'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Statut invalide' },
        { status: 400 }
      );
    }

    // Vérifier que l'annonce appartient à l'utilisateur
    const annonce = await prisma.annonce.findUnique({
      where: { id: annonceId }
    });

    if (!annonce) {
      return NextResponse.json(
        { error: 'Annonce non trouvée' },
        { status: 404 }
      );
    }

    if (annonce.userId !== user.id) {
      return NextResponse.json(
        { error: 'Vous n\'êtes pas autorisé à modifier cette annonce' },
        { status: 403 }
      );
    }

    // Mettre à jour le statut
    const updatedAnnonce = await prisma.annonce.update({
      where: { id: annonceId },
      data: { status },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            picture: true,
            mobile: true
          }
        }
      }
    });

    return NextResponse.json(updatedAnnonce);
  } catch (error) {
    console.error('Error updating annonce status:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du statut' },
      { status: 500 }
    );
  }
} 