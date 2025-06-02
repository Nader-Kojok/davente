import { NextRequest, NextResponse } from 'next/server';
import { getTrendingCategories } from '@/lib/trending';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '6');
    
    const trendingCategories = await getTrendingCategories(limit);
    
    return NextResponse.json({ 
      success: true,
      data: trendingCategories 
    });
    
  } catch (error) {
    console.error('Error fetching trending categories:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch trending categories',
      data: []
    }, { status: 500 });
  }
} 