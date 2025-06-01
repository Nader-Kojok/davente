import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  },
});

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