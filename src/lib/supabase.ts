import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    storage: {
      getItem: (key: string) => {
        if (typeof window === 'undefined') return null;
        // Try cookies first, then localStorage
        const cookieValue = document.cookie
          .split('; ')
          .find(row => row.startsWith(`${key}=`))
          ?.split('=')[1];
        
        if (cookieValue) {
          try {
            return JSON.parse(decodeURIComponent(cookieValue));
          } catch {
            return cookieValue;
          }
        }
        
        // Fallback to localStorage
        return localStorage.getItem(key);
      },
      setItem: (key: string, value: string) => {
        if (typeof window === 'undefined') return;
        
        // Set both cookie and localStorage for compatibility
        const expires = new Date();
        expires.setTime(expires.getTime() + (7 * 24 * 60 * 60 * 1000)); // 7 days
        
        document.cookie = `${key}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
        localStorage.setItem(key, value);
      },
      removeItem: (key: string) => {
        if (typeof window === 'undefined') return;
        
        // Remove from both cookie and localStorage
        document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        localStorage.removeItem(key);
      }
    },
    debug: process.env.NODE_ENV === 'development'
  },
});

// Helper function to get authentication headers for API calls
export const getAuthHeaders = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.access_token) {
    throw new Error('No active session');
  }
  
  return {
    'Authorization': `Bearer ${session.access_token}`,
    'Content-Type': 'application/json'
  };
};

// Legacy auth bridge - creates JWT token from Supabase profile for backward compatibility
export const getLegacyAuthToken = async (): Promise<string | null> => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.user) {
    return null;
  }

  try {
    // Get or create profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (!profile) {
      return null;
    }

    // Create a temporary JWT token for backward compatibility
    const response = await fetch('/api/auth/bridge', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`
      },
      body: JSON.stringify({
        userId: profile.id,
        name: profile.name || session.user.user_metadata?.name || '',
        mobile: profile.mobile || session.user.phone || ''
      })
    });

    if (response.ok) {
      const { token } = await response.json();
      return token;
    }
  } catch (error) {
    console.error('Error getting legacy auth token:', error);
  }

  return null;
};

// Helper function to make authenticated API calls with legacy compatibility
export const makeAuthenticatedRequest = async (url: string, options: RequestInit = {}) => {
  try {
    // Try to get legacy token for backward compatibility
    const legacyToken = await getLegacyAuthToken();
    
    if (!legacyToken) {
      throw new Error('No valid authentication');
    }
    
    return fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${legacyToken}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
  } catch (error) {
    // If no session, redirect to login
    window.location.href = '/login';
    throw error;
  }
};

// Type-safe database types (you can generate these with `npx supabase gen types typescript`)
export type Database = {
  public: {
    Tables: {
      User: {
        Row: {
          id: number;
          mobile: string;
          password: string;
          name: string;
          picture: string;
          createdAt: string;
        };
        Insert: {
          id?: number;
          mobile: string;
          password: string;
          name: string;
          picture: string;
          createdAt?: string;
        };
        Update: {
          id?: number;
          mobile?: string;
          password?: string;
          name?: string;
          picture?: string;
          createdAt?: string;
        };
      };
      Annonce: {
        Row: {
          id: number;
          title: string;
          description: string;
          price: number;
          location: string;
          picture: string;
          gallery: string[];
          createdAt: string;
          userId: number;
        };
        Insert: {
          id?: number;
          title: string;
          description: string;
          price: number;
          location: string;
          picture: string;
          gallery: string[];
          createdAt?: string;
          userId: number;
        };
        Update: {
          id?: number;
          title?: string;
          description?: string;
          price?: number;
          location?: string;
          picture?: string;
          gallery?: string[];
          createdAt?: string;
          userId?: number;
        };
      };
    };
  };
};

// Type pour les profils utilisateurs
export interface UserProfile {
  id: string;
  email?: string;
  name?: string;
  mobile?: string;
  picture?: string;
  bio?: string;
  location?: string;
  profession?: string;
  language?: string;
  company?: string;
  website?: string;
  date_of_birth?: string;
  gender?: string;
  account_type?: string;
  
  // Préférences de contact
  show_phone?: boolean;
  show_email?: boolean;
  allow_sms?: boolean;
  allow_calls?: boolean;
  
  // Préférences de notification
  email_notifications?: boolean;
  sms_notifications?: boolean;
  push_notifications?: boolean;
  marketing_emails?: boolean;
  
  // Informations de vérification
  is_verified?: boolean;
  is_phone_verified?: boolean;
  is_email_verified?: boolean;
  
  // Métadonnées
  last_login_at?: string;
  is_active?: boolean;
  timezone?: string;
  
  created_at: string;
  updated_at: string;
}

// Configuration des providers sociaux
export const authProviders = {
  google: {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000')}/auth/callback`
  },
  facebook: {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000')}/auth/callback`
  }
} as const;

// Helper function to check if a profile is complete
export const isProfileComplete = (profile: UserProfile | null): boolean => {
  if (!profile) return false;
  
  // Check required fields for a complete profile
  return !!(
    profile.name?.trim() &&
    profile.mobile?.trim() &&
    profile.location?.trim()
  );
};

// Helper function to get profile completion percentage
export const getProfileCompletionPercentage = (profile: UserProfile | null): number => {
  if (!profile) return 0;
  
  const fields = [
    profile.name,
    profile.mobile,
    profile.location,
    profile.profession,
    profile.bio,
    profile.picture
  ];
  
  const completedFields = fields.filter(field => field?.trim()).length;
  return Math.round((completedFields / fields.length) * 100);
};