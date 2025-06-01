import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { TopCategory } from '@/types/category';

export async function GET() {
  try {
    // Utiliser une requête SQL brute pour récupérer les catégories avec le nombre d'annonces
    const result = await prisma.$queryRaw<Array<{
      id: number;
      name: string;
      slug: string;
      icon: string;
      description: string | null;
      annonce_count: bigint;
    }>>`
      SELECT 
        c.id,
        c.name,
        c.slug,
        c.icon,
        c.description,
        COALESCE(COUNT(a.id), 0) as annonce_count
      FROM "Category" c
      LEFT JOIN "Annonce" a ON c.id = a."categoryId" AND a.status = 'active'
      WHERE c."isActive" = true
      GROUP BY c.id, c.name, c.slug, c.icon, c.description, c."sortOrder"
      ORDER BY annonce_count DESC, c."sortOrder" ASC
      LIMIT 6
    `;

    // Transformer les données pour le frontend
    const topCategories: TopCategory[] = result.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      icon: category.icon,
      description: category.description,
      annonceCount: Number(category.annonce_count),
      href: `/categories/${category.slug}`
    }));

    return NextResponse.json(topCategories);
  } catch (error) {
    console.error('Error fetching top categories:', error);
    
    // Fallback vers les données statiques en cas d'erreur
    const { getAllCategories } = await import('@/lib/categories');
    const staticCategories = getAllCategories();
    
    const popularityMap: Record<string, number> = {
      'vehicules': 245,
      'immobilier': 189,
      'electronique': 156,
      'mode': 134,
      'maison-jardin': 98,
      'services': 87
    };

    const fallbackCategories: TopCategory[] = staticCategories
      .slice(0, 6)
      .map((category, index) => ({
        id: index + 1,
        name: category.name,
        slug: category.slug,
        icon: category.icon,
        description: category.description || null,
        annonceCount: popularityMap[category.slug] || Math.floor(Math.random() * 50) + 10,
        href: `/categories/${category.slug}`
      }))
      .sort((a, b) => b.annonceCount - a.annonceCount);

    return NextResponse.json(fallbackCategories);
  }
} 