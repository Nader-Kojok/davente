import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { generateToken } from '@/lib/auth';

// Bridge API to create JWT tokens from Supabase sessions for backward compatibility
export async function POST(request: NextRequest) {
  try {
    // Create Supabase client for server-side
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set() {},
          remove() {},
        },
      }
    );

    // Verify Supabase session
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get request body
    const { userId, name, mobile } = await request.json();

    // Validate that the user ID matches
    if (userId !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Create JWT token for backward compatibility
    const token = generateToken({
      userId: parseInt(userId) || 0, // Convert string ID to number for legacy compatibility
      mobile: mobile || '',
      name: name || ''
    });

    return NextResponse.json({ token });
  } catch (error) {
    console.error('Bridge auth error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 