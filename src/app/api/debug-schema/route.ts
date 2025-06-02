import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Helper function to convert BigInt to string for JSON serialization
function serializeBigInt(obj: any): any {
  return JSON.parse(JSON.stringify(obj, (key, value) =>
    typeof value === 'bigint' ? value.toString() : value
  ));
}

export async function GET() {
  try {
    // Test simple queries to understand the actual schema
    const tests = [];
    
    // Test 1: Check if we can query users table
    try {
      const userCount = await prisma.$queryRaw`SELECT COUNT(*) FROM "User"`;
      tests.push({ test: 'User table', status: 'success', result: serializeBigInt(userCount) });
    } catch (error: any) {
      tests.push({ test: 'User table', status: 'error', error: error.message });
    }
    
    // Test 2: Check if we can query annonces table
    try {
      const annonceCount = await prisma.$queryRaw`SELECT COUNT(*) FROM "Annonce"`;
      tests.push({ test: 'Annonce table', status: 'success', result: serializeBigInt(annonceCount) });
    } catch (error: any) {
      tests.push({ test: 'Annonce table', status: 'error', error: error.message });
    }
    
    // Test 3: Check User table structure
    try {
      const userColumns = await prisma.$queryRaw`
        SELECT column_name, data_type, is_nullable 
        FROM information_schema.columns 
        WHERE table_name = 'User' 
        ORDER BY ordinal_position
      `;
      tests.push({ test: 'User columns', status: 'success', result: serializeBigInt(userColumns) });
    } catch (error: any) {
      tests.push({ test: 'User columns', status: 'error', error: error.message });
    }
    
    // Test 4: Check Annonce table structure
    try {
      const annonceColumns = await prisma.$queryRaw`
        SELECT column_name, data_type, is_nullable 
        FROM information_schema.columns 
        WHERE table_name = 'Annonce' 
        ORDER BY ordinal_position
      `;
      tests.push({ test: 'Annonce columns', status: 'success', result: serializeBigInt(annonceColumns) });
    } catch (error: any) {
      tests.push({ test: 'Annonce columns', status: 'error', error: error.message });
    }
    
    return NextResponse.json({
      success: true,
      tests
    });
    
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
} 