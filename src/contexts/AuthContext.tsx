'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase, UserProfile, authProviders } from '@/lib/supabase';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  isLoading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signInWithPhone: (phone: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUpWithEmail: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  signUpWithPhone: (phone: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  signInWithFacebook: () => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ success: boolean; error?: string }>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Charger le profil utilisateur depuis la table profiles
  const loadUserProfile = async (userId: string) => {
    try {
      console.log('Loading user profile for:', userId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error loading user profile:', error);
        
        // If profile doesn't exist (PGRST116), that's expected for new users
        if (error.code === 'PGRST116') {
          console.log('No profile found for user, this is expected for new users');
          return null;
        }
        
        // If the table doesn't exist (42P01)
        if (error.code === '42P01') {
          console.error('❌ Profiles table does not exist. Please run the Supabase migration.');
          console.error('📝 Execute the SQL from supabase-migration.sql in your Supabase dashboard.');
          throw new Error('Database setup required: profiles table not found');
        }
        
        // Handle other errors but don't crash
        console.warn('Profile loading failed but continuing:', error);
        return null;
      }

      console.log('Profile loaded successfully:', data);
      return data as UserProfile;
    } catch (error) {
      console.error('Exception in loadUserProfile:', error);
      return null;
    }
  };

  // Créer ou mettre à jour le profil utilisateur
  const upsertUserProfile = async (userData: Partial<UserProfile>) => {
    try {
      console.log('Upserting user profile:', userData);
      
      const { data, error } = await supabase
        .from('profiles')
        .upsert([userData], {
          onConflict: 'id',
          ignoreDuplicates: false
        })
        .select()
        .single();

      if (error) {
        console.error('Error upserting user profile:', error);
        
        // If the table doesn't exist, provide helpful error message
        if (error.code === '42P01') {
          console.error('❌ Profiles table does not exist. Please run the Supabase migration.');
          console.error('📝 Execute the SQL from supabase-migration.sql in your Supabase dashboard.');
          throw new Error('Database setup required: profiles table not found');
        }
        
        // For RLS policy errors, provide specific guidance
        if (error.code === '42501' || error.message?.includes('policy')) {
          console.error('❌ RLS policy error. Check Supabase RLS policies for profiles table.');
          throw new Error('Permission denied: Check database policies');
        }
        
        // For other errors, log but don't crash the app
        console.warn('Profile upsert failed but continuing:', error);
        throw error;
      }
      
      console.log('Profile upserted successfully:', data);
      return data as UserProfile;
    } catch (error) {
      console.error('Exception in upsertUserProfile:', error);
      throw error;
    }
  };

  // Initialiser l'état d'authentification
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Récupérer la session actuelle
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
        } else if (session) {
          setSession(session);
          setUser(session.user);
          
          // Charger le profil utilisateur
          const userProfile = await loadUserProfile(session.user.id);
          setProfile(userProfile);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        try {
          setSession(session);
          setUser(session?.user ?? null);

          if (session?.user) {
            console.log('User authenticated, loading profile...');
            
            // Charger ou créer le profil utilisateur
            let userProfile = await loadUserProfile(session.user.id);
            
            if (!userProfile) {
              console.log('No profile found, creating new profile...');
              
              // Créer un nouveau profil si il n'existe pas
              try {
                const newProfileData: Partial<UserProfile> = {
                  id: session.user.id,
                  email: session.user.email,
                  name: session.user.user_metadata?.name || 
                        session.user.user_metadata?.full_name || 
                        session.user.email?.split('@')[0] || 
                        'Utilisateur',
                  picture: session.user.user_metadata?.picture || 
                          session.user.user_metadata?.avatar_url,
                  language: 'fr',
                  timezone: 'Africa/Dakar',
                  is_active: true,
                  email_notifications: true,
                  sms_notifications: true,
                  push_notifications: true,
                  marketing_emails: false,
                  show_phone: true,
                  show_email: false,
                  allow_sms: true,
                  allow_calls: true,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                };
                
                userProfile = await upsertUserProfile(newProfileData);
                console.log('New profile created successfully');
                
                // For new users, redirect to profile completion
                if (event === 'SIGNED_IN' && typeof window !== 'undefined') {
                  setTimeout(() => {
                    window.location.href = '/complete-profile';
                  }, 1000);
                }
              } catch (error) {
                console.error('Error creating user profile:', error);
                
                // If profiles table doesn't exist, show helpful message but don't block auth
                if (error instanceof Error && error.message.includes('Database setup required')) {
                  console.warn('⚠️  Profile system not available. Please set up the database.');
                  toast.error('Configuration de la base de données requise. Contactez l\'administrateur.');
                  
                  // Continue without profile for now
                  userProfile = null;
                } else {
                  // For other errors, also continue without profile
                  console.warn('Authentication continues without profile due to error');
                  userProfile = null;
                }
              }
            } else {
              console.log('Existing profile found');
              
              // Update last login time
              try {
                await upsertUserProfile({
                  ...userProfile,
                  last_login_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                });
              } catch (error) {
                console.error('Error updating last login:', error);
                // Don't block if this fails
              }
            }
            
            setProfile(userProfile);
          } else {
            console.log('No user session');
            setProfile(null);
          }
        } catch (error) {
          console.error('Error in auth state change handler:', error);
          // Continue with authentication even if profile operations fail
          setProfile(null);
        } finally {
          // Always set loading to false after processing auth state change
          setIsLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Connexion avec email/mot de passe
  const signInWithEmail = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, error: 'Erreur de connexion au serveur' };
    }
  };

  // Connexion avec téléphone/mot de passe
  const signInWithPhone = async (phone: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        phone,
        password
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Sign in with phone error:', error);
      return { success: false, error: 'Erreur de connexion au serveur' };
    }
  };

  // Inscription avec email/mot de passe
  const signUpWithEmail = async (email: string, password: string, name: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
            full_name: name
          }
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user && !data.session) {
        return { success: true, error: 'Veuillez vérifier votre email pour confirmer votre compte' };
      }

      return { success: true };
    } catch (error) {
      console.error('Sign up error:', error);
      return { success: false, error: 'Erreur de connexion au serveur' };
    }
  };

  // Inscription avec téléphone/mot de passe
  const signUpWithPhone = async (phone: string, password: string, name: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        phone,
        password,
        options: {
          data: {
            name: name,
            full_name: name
          }
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user && !data.session) {
        return { success: true, error: 'Veuillez vérifier votre téléphone avec le code SMS reçu' };
      }

      return { success: true };
    } catch (error) {
      console.error('Sign up with phone error:', error);
      return { success: false, error: 'Erreur de connexion au serveur' };
    }
  };

  // Connexion avec Google
  const signInWithGoogle = async () => {
    try {
      console.log('Starting Google OAuth flow...');
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          ...authProviders.google,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        }
      });

      if (error) {
        console.error('Google OAuth error:', error);
        return { success: false, error: error.message };
      }

      console.log('Google OAuth initiated successfully');
      return { success: true };
    } catch (error) {
      console.error('Google sign in error:', error);
      return { success: false, error: 'Erreur de connexion avec Google' };
    }
  };

  // Connexion avec Facebook
  const signInWithFacebook = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: authProviders.facebook
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Facebook sign in error:', error);
      return { success: false, error: 'Erreur de connexion avec Facebook' };
    }
  };

  // Déconnexion
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
        toast.error('Erreur lors de la déconnexion');
      }
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Erreur lors de la déconnexion');
    }
  };

  // Mettre à jour le profil
  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) {
      return { success: false, error: 'Utilisateur non connecté' };
    }

    try {
      const updatedProfile = await upsertUserProfile({
        ...updates,
        id: user.id,
        updated_at: new Date().toISOString(),
      });

      setProfile(updatedProfile);
      return { success: true };
    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, error: 'Erreur lors de la mise à jour du profil' };
    }
  };

  const value: AuthContextType = {
    user,
    profile,
    session,
    isLoading,
    signInWithEmail,
    signInWithPhone,
    signUpWithEmail,
    signUpWithPhone,
    signInWithGoogle,
    signInWithFacebook,
    signOut,
    updateProfile,
    isAuthenticated: !isLoading && !!user && !!session,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Hook pour les composants nécessitant une authentification
export function useRequireAuth() {
  const auth = useAuth();
  
  useEffect(() => {
    if (!auth.isLoading && !auth.isAuthenticated) {
      window.location.href = '/login';
    }
  }, [auth.isLoading, auth.isAuthenticated]);

  return auth;
} 