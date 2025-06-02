import { NextRequest, NextResponse } from 'next/server';
import { trackSearch } from '@/lib/trending';

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();
    
    if (!query || typeof query !== 'string' || query.trim().length < 2) {
      return NextResponse.json({ 
        success: false, 
        error: 'Query must be at least 2 characters long' 
      }, { status: 400 });
    }
    
    await trackSearch(query);
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Error tracking search:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to track search' 
    }, { status: 500 });
  }
} 