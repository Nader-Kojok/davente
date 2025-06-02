'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasProcessed, setHasProcessed] = useState(false);

  useEffect(() => {
    const handleAuthCallback = async () => {
      // Prevent multiple executions
      if (hasProcessed) return;
      setHasProcessed(true);

      try {
        console.log('Processing auth callback...');
        
        // Check for error in URL parameters first
        const urlError = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');
        
        if (urlError) {
          console.error('OAuth error from URL:', urlError, errorDescription);
          setError(errorDescription || urlError);
          setIsLoading(false);
          return;
        }

        // For OAuth providers like Google, Supabase handles the session automatically
        // We just need to check if we have a session now
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          setError(sessionError.message);
          setIsLoading(false);
          return;
        }

        if (session) {
          console.log('Session found, redirecting...');
          // Success! Redirect to the intended page or home
          const redirectTo = searchParams.get('redirect_to') || searchParams.get('next') || '/';
          router.replace(redirectTo);
        } else {
          console.log('No session found, redirecting to login...');
          // No session found, redirect to login
          router.replace('/login?error=auth_session_missing');
        }
      } catch (error) {
        console.error('Unexpected error in auth callback:', error);
        setError('Une erreur inattendue s\'est produite');
        setIsLoading(false);
      }
    };

    // Small delay to ensure URL parameters are available
    const timer = setTimeout(handleAuthCallback, 100);
    return () => clearTimeout(timer);
  }, [router, searchParams, hasProcessed]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
          <div className="mb-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-600 text-2xl">⚠️</span>
            </div>
            <h1 className="text-xl font-semibold text-gray-900 mb-2">
              Erreur d'authentification
            </h1>
            <p className="text-gray-600 mb-6">
              {error}
            </p>
            <button
              onClick={() => router.replace('/login')}
              className="btn-primary w-full"
            >
              Retour à la connexion
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
        <div className="mb-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary-500" />
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            Authentification en cours...
          </h1>
          <p className="text-gray-600">
            Veuillez patienter pendant que nous vous connectons.
          </p>
        </div>
      </div>
    </div>
  );
} 