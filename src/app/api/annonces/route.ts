import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

// Interface pour les données d'annonce
interface CreateAnnonceData {
  title: string;
  description: string;
  price: number;
  location: string;
  picture: string;
  gallery: string[];
  category: string;
  subcategory: string;
  condition: string;
  additionalFields: Record<string, any>;
}

// Fonction pour extraire l'utilisateur du token JWT
async function getCurrentUser(request: NextRequest) {
  try {
    console.log('🔍 getCurrentUser - début');
    const authHeader = request.headers.get('authorization');
    console.log('🔑 Auth header présent:', !!authHeader);
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ Pas d\'auth header ou format incorrect');
      return null;
    }

    const token = authHeader.substring(7);
    console.log('🎫 Token extrait (début):', token.substring(0, 20) + '...');
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };
    console.log('🔓 Token décodé:', decoded);
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });
    
    console.log('👤 Utilisateur trouvé:', user ? { id: user.id, name: user.name } : 'null');
    
    return user;
  } catch (error) {
    console.error('❌ Erreur dans getCurrentUser:', error);
    return null;
  }
}

// GET: Récupère la liste des annonces
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const location = searchParams.get('location');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    
    const whereClause: any = {
      status: 'active' // Filtrer uniquement les annonces actives
    };
    
    if (category) {
      whereClause.category = category;
    }
    
    if (location) {
      whereClause.location = {
        contains: location
      };
    }
    
    if (minPrice || maxPrice) {
      whereClause.price = {};
      if (minPrice) whereClause.price.gte = parseFloat(minPrice);
      if (maxPrice) whereClause.price.lte = parseFloat(maxPrice);
    }

    const annonces = await prisma.annonce.findMany({
      where: whereClause,
      include: { 
        user: {
          select: {
            id: true,
            name: true,
            picture: true,
            mobile: true,
            accountType: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return NextResponse.json(annonces);
  } catch (error) {
    console.error('Error fetching annonces:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des annonces' },
      { status: 500 }
    );
  }
}

// POST: Crée une nouvelle annonce
export async function POST(request: NextRequest) {
  console.log('🚀 POST /api/annonces - Début de la requête');
  
  try {
    // Vérifier l'authentification
    console.log('🔐 Vérification de l\'authentification...');
    const user = await getCurrentUser(request);
    
    if (!user) {
      console.log('❌ Authentication failed - pas d\'utilisateur');
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    console.log('✅ Utilisateur authentifié:', { id: user.id, name: user.name });

    console.log('📖 Lecture du body de la requête...');
    const body: CreateAnnonceData = await request.json();
    console.log('📋 Données reçues:', JSON.stringify(body, null, 2));
    
    // Validation des données requises
    if (!body.title || !body.description || body.price === undefined || !body.location) {
      console.log('❌ Validation failed - champs requis manquants');
      const missingFields = [];
      if (!body.title) missingFields.push('title');
      if (!body.description) missingFields.push('description'); 
      if (body.price === undefined) missingFields.push('price');
      if (!body.location) missingFields.push('location');
      
      return NextResponse.json(
        { error: 'Champs requis manquants: ' + missingFields.join(', ') },
        { status: 400 }
      );
    }

    console.log('✅ Validation des données réussie');

    // Traiter les images (convertir les blob URLs en chemins statiques pour le moment)
    let picture = body.picture;
    let gallery = body.gallery || [];
    
    // Si c'est une URL blob, utiliser un placeholder
    if (picture && picture.startsWith('blob:')) {
      console.log('⚠️ URL blob détectée pour picture, utilisation du placeholder');
      picture = '/images/placeholder.jpg';
    }
    
    // Filtrer les URLs blob de la galerie
    gallery = gallery.filter(img => !img.startsWith('blob:')).length > 0 
      ? gallery.filter(img => !img.startsWith('blob:'))
      : ['/images/placeholder.jpg'];
    
    console.log('🖼️ Images traitées - picture:', picture, 'gallery:', gallery);

    console.log('💾 Création de l\'annonce en base...');
    
    // Créer l'annonce avec validation des types
    const annonceData = {
      title: String(body.title).trim(),
      description: String(body.description).trim(),
      price: Number(body.price),
      location: String(body.location).trim(),
      picture: picture,
      gallery: gallery,
      userId: user.id,
      category: body.category ? String(body.category) : null,
      subcategory: body.subcategory ? String(body.subcategory) : null,
      condition: body.condition ? String(body.condition) : 'good',
      additionalFields: body.additionalFields || null
    };
    
    console.log('📊 Données finales à insérer:', JSON.stringify(annonceData, null, 2));

    const annonce = await prisma.annonce.create({
      data: annonceData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            picture: true,
            mobile: true,
            accountType: true
          }
        }
      }
    });

    console.log('✅ Annonce créée avec succès, ID:', annonce.id);
    
    return NextResponse.json(annonce, { status: 201 });
    
  } catch (error) {
    console.error('💥 Erreur dans POST /api/annonces:');
    console.error('Type d\'erreur:', typeof error);
    console.error('Message:', error instanceof Error ? error.message : 'Message inconnu');
    console.error('Stack trace:', error instanceof Error ? error.stack : 'Pas de stack trace');
    
    // Erreurs spécifiques de Prisma
    if (error && typeof error === 'object' && 'code' in error) {
      console.error('Code d\'erreur Prisma:', (error as any).code);
      console.error('Meta Prisma:', (error as any).meta);
    }
    
    return NextResponse.json(
      { 
        error: 'Erreur lors de la création de l\'annonce',
        details: error instanceof Error ? error.message : 'Erreur inconnue',
        code: error && typeof error === 'object' && 'code' in error ? (error as any).code : undefined
      },
      { status: 500 }
    );
  }
} 