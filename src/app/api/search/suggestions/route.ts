import { NextRequest, NextResponse } from 'next/server';
import { getSearchSuggestions } from '@/lib/search';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const limit = parseInt(searchParams.get('limit') || '8');

    if (!query || query.trim().length < 2) {
      return NextResponse.json({ 
        suggestions: [],
        source: 'prisma'
      });
    }

    console.log('🔍 Suggestions avec Prisma pour:', query);
    
    const suggestions = await getSearchSuggestions(query.trim(), limit);

    return NextResponse.json({ 
      suggestions,
      source: 'prisma'
    });

  } catch (error) {
    console.error('❌ Erreur dans les suggestions:', error);
    return NextResponse.json({ 
      suggestions: [],
      source: 'prisma'
    });
  }
} 