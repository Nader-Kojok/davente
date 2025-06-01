import { NextRequest, NextResponse } from 'next/server';
import { searchListings, SearchParams } from '@/lib/search';

// GET: Recherche avancée avec Prisma
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const params: SearchParams = {
      query: searchParams.get('q') || undefined,
      category: searchParams.get('category') || undefined,
      subcategory: searchParams.get('subcategory') || undefined,
      location: searchParams.get('location') || undefined,
      minPrice: searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined,
      maxPrice: searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined,
      condition: searchParams.get('condition') || undefined,
      userType: (searchParams.get('userType') as 'individual' | 'business') || undefined,
      sortBy: (searchParams.get('sortBy') as any) || 'date_desc',
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20
    };

    console.log('🔍 Recherche avec Prisma:', params);
    
    const results = await searchListings(params);
    
    return NextResponse.json({
      success: true,
      data: {
        listings: results.listings,
        total: results.total,
        page: results.page,
        totalPages: results.totalPages,
        hasNextPage: results.hasNextPage,
        hasPreviousPage: results.hasPreviousPage
      },
      source: 'prisma'
    });

  } catch (error) {
    console.error('❌ Erreur dans l\'API de recherche avancée:', error);
    
    return NextResponse.json({
      success: false,
      error: {
        code: 'SEARCH_ERROR',
        message: 'Erreur lors de la recherche',
        details: process.env.NODE_ENV === 'development' ? error : undefined,
        timestamp: new Date().toISOString()
      },
      source: 'prisma'
    }, { status: 500 });
  }
} 