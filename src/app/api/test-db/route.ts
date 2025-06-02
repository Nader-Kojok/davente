import { NextResponse } from 'next/server';
import { testDatabaseConnection } from '@/lib/db-test';

export async function GET() {
  try {
    const result = await testDatabaseConnection();
    
    return NextResponse.json(result, {
      status: result.success ? 200 : 500
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to test database connection',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, {
      status: 500
    });
  }
} 