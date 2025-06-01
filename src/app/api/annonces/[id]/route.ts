import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

// Fonction pour extraire l'utilisateur du token JWT
async function getCurrentUser(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) return null;
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });
    
    return user;
  } catch (_error) {
    return null;
  }
}

// GET: Récupère une annonce spécifique
export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    console.log('🔍 GET annonce ID:', params.id);
    
    const annonceId = parseInt(params.id);
    if (isNaN(annonceId)) {
      return NextResponse.json(
        { error: 'ID invalide' },
        { status: 400 }
      );
    }

    const annonce = await prisma.annonce.findUnique({
      where: { id: annonceId },
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

    if (!annonce) {
      return NextResponse.json(
        { error: 'Annonce non trouvée' },
        { status: 404 }
      );
    }

    console.log('✅ Annonce trouvée:', annonce.title);
    return NextResponse.json(annonce);

  } catch (error) {
    console.error('❌ Erreur GET annonce:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// PUT: Modifier une annonce
export async function PUT(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    console.log('✏️ PUT annonce ID:', params.id);
    
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const annonceId = parseInt(params.id);
    if (isNaN(annonceId)) {
      return NextResponse.json(
        { error: 'ID invalide' },
        { status: 400 }
      );
    }

    // Vérifier que l'annonce existe et appartient à l'utilisateur
    const existingAnnonce = await prisma.annonce.findUnique({
      where: { id: annonceId }
    });

    if (!existingAnnonce) {
      return NextResponse.json(
        { error: 'Annonce non trouvée' },
        { status: 404 }
      );
    }

    if (existingAnnonce.userId !== user.id) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      );
    }

    const body = await request.json();
    console.log('📝 Données de modification:', body);

    const updatedAnnonce = await prisma.annonce.update({
      where: { id: annonceId },
      data: {
        title: body.title,
        description: body.description,
        price: parseInt(body.price),
        location: body.location,
        picture: body.picture,
        gallery: body.gallery || [],
        category: body.category,
        subcategory: body.subcategory,
        condition: body.condition,
        additionalFields: body.additionalFields || {}
      },
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

    console.log('✅ Annonce modifiée:', updatedAnnonce.title);
    return NextResponse.json(updatedAnnonce);

  } catch (error) {
    console.error('❌ Erreur PUT annonce:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// DELETE: Supprime une annonce
export async function DELETE(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    console.log('🗑️ DELETE annonce ID:', params.id);
    
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const annonceId = parseInt(params.id);
    if (isNaN(annonceId)) {
      return NextResponse.json(
        { error: 'ID invalide' },
        { status: 400 }
      );
    }

    // Vérifier que l'annonce existe et appartient à l'utilisateur
    const existingAnnonce = await prisma.annonce.findUnique({
      where: { id: annonceId }
    });

    if (!existingAnnonce) {
      return NextResponse.json(
        { error: 'Annonce non trouvée' },
        { status: 404 }
      );
    }

    if (existingAnnonce.userId !== user.id) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      );
    }

    await prisma.annonce.delete({
      where: { id: annonceId }
    });

    console.log('✅ Annonce supprimée');
    return NextResponse.json({ message: 'Annonce supprimée avec succès' });

  } catch (error) {
    console.error('❌ Erreur DELETE annonce:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
} 