import { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export interface AuthenticatedUser {
  id: string;
  name: string;
  email?: string;
  mobile?: string;
  supabaseId: string;
}

// Helper function to get authenticated user from Supabase session in API routes
export async function getAuthenticatedUser(request: NextRequest): Promise<AuthenticatedUser | null> {
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

    // Get user from Supabase session
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      console.log('Auth error or no user:', error?.message);
      return null;
    }

    // Get the profile to map to user data
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    return {
      id: user.id,
      name: profile?.name || user.user_metadata?.name || '',
      email: profile?.email || user.email || '',
      mobile: profile?.mobile || user.phone || '',
      supabaseId: user.id
    };
  } catch (error) {
    console.error('Error getting authenticated user:', error);
    return null;
  }
}

// Helper to create consistent auth error responses
export function createAuthErrorResponse() {
  return new Response(
    JSON.stringify({ error: 'Authentication required' }),
    { 
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    }
  );
}

// Helper to create consistent forbidden error responses
export function createForbiddenResponse(message = 'Access forbidden') {
  return new Response(
    JSON.stringify({ error: message }),
    { 
      status: 403,
      headers: { 'Content-Type': 'application/json' }
    }
  );
} 