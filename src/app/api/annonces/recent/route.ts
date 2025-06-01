import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { RecentListing } from '@/types/category';
import { Prisma } from '@prisma/client';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '8');
    const categoryId = searchParams.get('categoryId');

    // Optimized where clause using indexed fields
    const whereClause: Prisma.AnnonceWhereInput = {
      status: 'active' // Use indexed status field first
    };

    if (categoryId) {
      whereClause.categoryId = parseInt(categoryId);
    }

    // Optimized query with minimal data selection
    const annonces = await prisma.annonce.findMany({
      where: whereClause,
      select: {
        // Only select needed fields to reduce data transfer
        id: true,
        title: true,
        price: true,
        picture: true,
        location: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            name: true,
            picture: true
          }
        },
        Category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        Subcategory: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc' // Use indexed sort
      },
      take: limit
    });

    // Transform data efficiently
    const recentListings: RecentListing[] = annonces.map((annonce) => ({
      id: annonce.id,
      title: annonce.title,
      price: annonce.price,
      picture: annonce.picture || '',
      location: annonce.location,
      createdAt: annonce.createdAt.toISOString(),
      user: {
        id: annonce.user.id,
        name: annonce.user.name,
        picture: annonce.user.picture || ''
      },
      category: annonce.Category ? {
        id: annonce.Category.id,
        name: annonce.Category.name,
        slug: annonce.Category.slug
      } : null,
      subcategory: annonce.Subcategory ? {
        id: annonce.Subcategory.id,
        name: annonce.Subcategory.name,
        slug: annonce.Subcategory.slug
      } : null
    }));

    return NextResponse.json(recentListings);
  } catch (error) {
    console.error('Error fetching recent listings:', error);
    
    // Fallback vers des données simulées en cas d'erreur
    const fallbackListings: RecentListing[] = [
      {
        id: 1,
        title: "Samsung Galaxy S23 Lavande",
        price: 280000,
        picture: "https://picsum.photos/400?random=1",
        location: "Dakar",
        createdAt: new Date().toISOString(),
        user: {
          id: 1,
          name: "Dimi",
          picture: "https://i.pravatar.cc/150?u=dimi"
        },
        category: {
          id: 3,
          name: "Électronique",
          slug: "electronique"
        },
        subcategory: {
          id: 1,
          name: "Téléphones & Objets connectés",
          slug: "telephones-objets-connectes"
        }
      },
      {
        id: 2,
        title: "iPhone 14 Pro Max",
        price: 899000,
        picture: "https://picsum.photos/400?random=2",
        location: "Thiès",
        createdAt: new Date().toISOString(),
        user: {
          id: 2,
          name: "TechPro",
          picture: "https://i.pravatar.cc/150?u=techpro"
        },
        category: {
          id: 3,
          name: "Électronique",
          slug: "electronique"
        },
        subcategory: {
          id: 1,
          name: "Téléphones & Objets connectés",
          slug: "telephones-objets-connectes"
        }
      },
      {
        id: 3,
        title: "AirPods Pro 2ème gen",
        price: 199000,
        picture: "https://picsum.photos/400?random=3",
        location: "Saint-Louis",
        createdAt: new Date().toISOString(),
        user: {
          id: 3,
          name: "MobileShop",
          picture: "https://i.pravatar.cc/150?u=mobileshop"
        },
        category: {
          id: 3,
          name: "Électronique",
          slug: "electronique"
        },
        subcategory: {
          id: 1,
          name: "Téléphones & Objets connectés",
          slug: "telephones-objets-connectes"
        }
      },
      {
        id: 4,
        title: "Apple Watch Series 8",
        price: 450000,
        picture: "https://picsum.photos/400?random=4",
        location: "Dakar",
        createdAt: new Date().toISOString(),
        user: {
          id: 4,
          name: "SmartGear",
          picture: "https://i.pravatar.cc/150?u=smartgear"
        },
        category: {
          id: 3,
          name: "Électronique",
          slug: "electronique"
        },
        subcategory: {
          id: 1,
          name: "Téléphones & Objets connectés",
          slug: "telephones-objets-connectes"
        }
      },
      {
        id: 5,
        title: 'MacBook Pro M2 13"',
        price: 1299000,
        picture: "https://picsum.photos/400?random=5",
        location: "Dakar",
        createdAt: new Date().toISOString(),
        user: {
          id: 5,
          name: "GadgetHub",
          picture: "https://i.pravatar.cc/150?u=gadgethub"
        },
        category: {
          id: 3,
          name: "Électronique",
          slug: "electronique"
        },
        subcategory: {
          id: 2,
          name: "Ordinateurs",
          slug: "ordinateurs"
        }
      },
      {
        id: 6,
        title: "iPad Air 5ème gen",
        price: 599000,
        picture: "https://picsum.photos/400?random=6",
        location: "Thiès",
        createdAt: new Date().toISOString(),
        user: {
          id: 6,
          name: "ElectroShop",
          picture: "https://i.pravatar.cc/150?u=electroshop"
        },
        category: {
          id: 3,
          name: "Électronique",
          slug: "electronique"
        },
        subcategory: {
          id: 2,
          name: "Ordinateurs",
          slug: "ordinateurs"
        }
      },
      {
        id: 7,
        title: "Samsung Galaxy Tab S9",
        price: 749000,
        picture: "https://picsum.photos/400?random=7",
        location: "Dakar",
        createdAt: new Date().toISOString(),
        user: {
          id: 7,
          name: "TechZone",
          picture: "https://i.pravatar.cc/150?u=techzone"
        },
        category: {
          id: 3,
          name: "Électronique",
          slug: "electronique"
        },
        subcategory: {
          id: 2,
          name: "Ordinateurs",
          slug: "ordinateurs"
        }
      },
      {
        id: 8,
        title: "Google Pixel 7 Pro",
        price: 699000,
        picture: "https://picsum.photos/400?random=8",
        location: "Saint-Louis",
        createdAt: new Date().toISOString(),
        user: {
          id: 8,
          name: "DigitalStore",
          picture: "https://i.pravatar.cc/150?u=digitalstore"
        },
        category: {
          id: 3,
          name: "Électronique",
          slug: "electronique"
        },
        subcategory: {
          id: 1,
          name: "Téléphones & Objets connectés",
          slug: "telephones-objets-connectes"
        }
      }
    ];

    return NextResponse.json(fallbackListings);
  }
} 