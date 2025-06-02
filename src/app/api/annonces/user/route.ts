import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { prisma } from '@/lib/prisma';

// Function to get current user from Supabase session
async function getCurrentUser(request: NextRequest) {
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
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return null;
    }

    // Get the profile to map to legacy user system
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (!profile) {
      return null;
    }

    // For now, we'll use a hash of the UUID as the numeric ID for backward compatibility
    // In a full migration, the database schema should be updated to use UUID
    const numericId = Math.abs(user.id.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0));

    return {
      id: numericId,
      name: profile.name || user.user_metadata?.name || '',
      mobile: profile.mobile || user.phone || '',
      email: profile.email || user.email || '',
      supabaseId: user.id
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

// GET: Récupère les annonces de l'utilisateur connecté
export async function GET(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // For the migration period, we need to find annonces by both the numeric ID and potentially by user profile matching
    // This is a temporary solution until the database is fully migrated
    const annonces = await prisma.annonce.findMany({
      where: {
        OR: [
          { userId: user.id }, // Legacy numeric ID
          // We could also match by email or phone if needed
          {
            user: {
              OR: [
                { mobile: user.mobile },
                ...(user.email ? [{ mobile: user.email }] : []) // Some old records might have email in mobile field
              ]
            }
          }
        ]
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            picture: true,
            mobile: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(annonces);
  } catch (error) {
    console.error('Error fetching user annonces:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des annonces' },
      { status: 500 }
    );
  }
} 