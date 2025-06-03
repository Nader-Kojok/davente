import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    message: 'Endpoint annonces test',
    data: [
      {
        id: 1,
        title: 'Test annonce',
        price: 100,
        location: 'Test location'
      }
    ]
  });
} 