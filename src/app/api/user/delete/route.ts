import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth';

export async function DELETE(request: NextRequest) {
  try {
    // Extract token from Authorization header
    const authHeader = request.headers.get('authorization');
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return NextResponse.json(
        { error: 'Token d\'authentification requis' },
        { status: 401 }
      );
    }

    // Verify token
    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Token invalide ou expiré' },
        { status: 401 }
      );
    }

    // Vérifier que l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { id: payload.userId }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Supprimer toutes les données associées à l'utilisateur
    // Note: Avec les contraintes de clé étrangère, Prisma supprimera automatiquement
    // les enregistrements liés si configuré avec onDelete: Cascade
    
    // Supprimer l'utilisateur (cela supprimera aussi ses annonces et autres données liées)
    await prisma.user.delete({
      where: { id: payload.userId }
    });

    return NextResponse.json(
      { message: 'Compte supprimé définitivement avec succès' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Erreur lors de la suppression du compte:', error);
    
    // Vérifier si c'est une erreur de contrainte de clé étrangère
    if (error instanceof Error && error.message.includes('Foreign key constraint')) {
      return NextResponse.json(
        { error: 'Impossible de supprimer le compte. Veuillez d\'abord supprimer toutes vos annonces.' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
} 