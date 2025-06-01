import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

// GET /api/bookmarks - Récupérer tous les bookmarks de l'utilisateur connecté
export async function GET(request: NextRequest) {
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

    // Utiliser une requête SQL brute pour récupérer les bookmarks
    const bookmarks = await prisma.$queryRaw`
      SELECT 
        b.id,
        b."userId",
        b."annonceId",
        b."createdAt",
        a.id as annonce_id,
        a.title as annonce_title,
        a.description as annonce_description,
        a.price as annonce_price,
        a.location as annonce_location,
        a.picture as annonce_picture,
        a.gallery as annonce_gallery,
        a."createdAt" as annonce_createdAt,
        a.status as annonce_status,
        a.category as annonce_category,
        a.subcategory as annonce_subcategory,
        a.condition as annonce_condition,
        u.id as user_id,
        u.name as user_name,
        u.picture as user_picture,
        u.mobile as user_mobile,
        u."showPhone" as user_showPhone,
        u."isVerified" as user_isVerified,
        c.id as category_id,
        c.name as category_name,
        c.slug as category_slug,
        c.icon as category_icon,
        s.id as subcategory_id,
        s.name as subcategory_name,
        s.slug as subcategory_slug
      FROM "Bookmark" b
      JOIN "Annonce" a ON b."annonceId" = a.id
      JOIN "User" u ON a."userId" = u.id
      LEFT JOIN "Category" c ON a."categoryId" = c.id
      LEFT JOIN "Subcategory" s ON a."subcategoryId" = s.id
      WHERE b."userId" = ${payload.userId}
      ORDER BY b."createdAt" DESC
    `;

    // Transformer les résultats en format attendu
    const formattedBookmarks = (bookmarks as any[]).map((row: any) => ({
      id: row.id,
      userId: row.userId,
      annonceId: row.annonceId,
      createdAt: row.createdAt,
      annonce: {
        id: row.annonce_id,
        title: row.annonce_title,
        description: row.annonce_description,
        price: row.annonce_price,
        location: row.annonce_location,
        picture: row.annonce_picture,
        gallery: row.annonce_gallery,
        createdAt: row.annonce_createdAt,
        status: row.annonce_status,
        category: row.annonce_category,
        subcategory: row.annonce_subcategory,
        condition: row.annonce_condition,
        user: {
          id: row.user_id,
          name: row.user_name,
          picture: row.user_picture,
          mobile: row.user_mobile,
          showPhone: row.user_showPhone,
          isVerified: row.user_isVerified
        },
        Category: row.category_id ? {
          id: row.category_id,
          name: row.category_name,
          slug: row.category_slug,
          icon: row.category_icon
        } : null,
        Subcategory: row.subcategory_id ? {
          id: row.subcategory_id,
          name: row.subcategory_name,
          slug: row.subcategory_slug
        } : null
      }
    }));

    return NextResponse.json({
      bookmarks: formattedBookmarks,
      total: formattedBookmarks.length
    });

  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération des favoris' },
      { status: 500 }
    );
  }
}

// POST /api/bookmarks - Ajouter une annonce aux favoris
export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { annonceId } = body;

    if (!annonceId) {
      return NextResponse.json(
        { error: 'ID de l\'annonce requis' },
        { status: 400 }
      );
    }

    // Vérifier que l'annonce existe
    const annonce = await prisma.annonce.findUnique({
      where: { id: annonceId }
    });

    if (!annonce) {
      return NextResponse.json(
        { error: 'Annonce introuvable' },
        { status: 404 }
      );
    }

    // Vérifier que l'utilisateur ne bookmark pas sa propre annonce
    if (annonce.userId === payload.userId) {
      return NextResponse.json(
        { error: 'Vous ne pouvez pas ajouter votre propre annonce aux favoris' },
        { status: 400 }
      );
    }

    // Créer le bookmark avec une requête SQL brute
    const bookmark = await prisma.$queryRaw`
      INSERT INTO "Bookmark" ("userId", "annonceId", "createdAt")
      VALUES (${payload.userId}, ${annonceId}, NOW())
      ON CONFLICT ("userId", "annonceId") DO NOTHING
      RETURNING *
    `;

    return NextResponse.json({
      bookmark,
      message: 'Annonce ajoutée aux favoris'
    });

  } catch (error) {
    console.error('Error adding bookmark:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de l\'ajout aux favoris' },
      { status: 500 }
    );
  }
} 