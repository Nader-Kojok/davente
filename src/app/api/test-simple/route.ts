import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'Test API fonctionne', timestamp: new Date().toISOString() });
}

export async function POST(request: NextRequest) {
  try {
    console.log('🧪 Test POST simple');
    const body = await request.json();
    console.log('📋 Body reçu:', body);
    
    return NextResponse.json({ 
      message: 'POST reçu avec succès', 
      receivedData: body,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Erreur dans test simple:', error);
    return NextResponse.json(
      { error: 'Erreur test simple', details: error instanceof Error ? error.message : 'Unknown' },
      { status: 500 }
    );
  }
} 