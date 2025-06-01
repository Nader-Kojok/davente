import { NextResponse } from 'next/server';
import { db } from '@/lib/database';

export async function GET() {
  try {
    // Test both database connections
    const prismaTest = await db.testConnection();
    
    // Test Supabase connection
    const { data: supabaseHealth, error: supabaseError } = await db.supabase
      .from('User')
      .select('count', { count: 'exact', head: true });
    
    return NextResponse.json({
      message: 'API working',
      environment: process.env.NODE_ENV,
      prisma: {
        status: prismaTest.success ? 'connected' : 'failed',
        userCount: prismaTest.userCount,
        error: prismaTest.error,
      },
      supabase: {
        status: supabaseError ? 'failed' : 'connected',
        error: supabaseError?.message,
        userCount: supabaseHealth?.[0]?.count || 0,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    console.error('API test failed:', {
      message: errorMessage,
      stack: errorStack,
    });
    
    return NextResponse.json(
      { 
        error: 'API test failed',
        details: errorMessage,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
} 