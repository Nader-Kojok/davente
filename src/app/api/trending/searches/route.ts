import { NextRequest, NextResponse } from 'next/server';
import { getTrendingSearches } from '@/lib/trending';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    
    const trendingSearches = await getTrendingSearches(limit);
    
    return NextResponse.json({ 
      success: true,
      data: trendingSearches 
    });
    
  } catch (error) {
    console.error('Error fetching trending searches:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch trending searches',
      data: []
    }, { status: 500 });
  }
} 