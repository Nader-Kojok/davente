'use client';

import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useState, useEffect } from 'react';

export default function TestSessionPage() {
  const { user, profile, session, isLoading, isAuthenticated } = useAuth();
  const [sessionTest, setSessionTest] = useState<any>(null);
  const [cookieTest, setCookieTest] = useState<any>(null);

  useEffect(() => {
    const testSession = async () => {
      // Test direct Supabase session
      const { data: { session: directSession }, error } = await supabase.auth.getSession();
      
      setSessionTest({
        hasDirectSession: !!directSession,
        directSessionUser: directSession?.user?.email,
        directSessionExpiry: directSession?.expires_at ? new Date(directSession.expires_at * 1000).toISOString() : null,
        error: error?.message,
        accessToken: directSession?.access_token ? `${directSession.access_token.substring(0, 20)}...` : null
      });

      // Test cookies
      if (typeof window !== 'undefined') {
        const allCookies = document.cookie;
        const supabaseCookies = allCookies
          .split(';')
          .filter(c => c.includes('supabase'))
          .map(c => c.trim());

        setCookieTest({
          hasCookies: !!allCookies,
          cookieCount: allCookies.split(';').length,
          supabaseCookieCount: supabaseCookies.length,
          supabaseCookies: supabaseCookies.map(c => c.substring(0, 50) + '...'),
          localStorage: {
            hasItems: localStorage.length > 0,
            itemCount: localStorage.length,
            keys: Array.from({ length: localStorage.length }, (_, i) => localStorage.key(i))
          }
        });
      }
    };

    testSession();
  }, []);

  const refreshSession = async () => {
    const { data, error } = await supabase.auth.refreshSession();
    console.log('Refresh session result:', { data, error });
    
    if (data.session) {
      setSessionTest((prev: any) => ({
        ...prev,
        refreshed: true,
        refreshedAt: new Date().toISOString()
      }));
    }
  };

  const signOutAndIn = async () => {
    console.log('Signing out...');
    await supabase.auth.signOut();
    
    setTimeout(() => {
      console.log('Redirecting to Google OAuth...');
      supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Session Test Page</h1>
        
        <div className="grid gap-6">
          {/* Auth Context */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Auth Context</h2>
            <div className="space-y-2 font-mono text-sm">
              <div className={`p-2 rounded ${isAuthenticated ? 'bg-green-100' : 'bg-red-100'}`}>
                <strong>isAuthenticated:</strong> {isAuthenticated.toString()}
              </div>
              <div className={`p-2 rounded ${user ? 'bg-green-100' : 'bg-red-100'}`}>
                <strong>user:</strong> {user ? user.email : 'null'}
              </div>
              <div className={`p-2 rounded ${session ? 'bg-green-100' : 'bg-red-100'}`}>
                <strong>session:</strong> {session ? 'exists' : 'null'}
              </div>
              {session && (
                <div className="p-2 bg-blue-50 rounded">
                  <div><strong>Session expires:</strong> {new Date(session.expires_at! * 1000).toLocaleString()}</div>
                  <div><strong>Token type:</strong> {session.token_type}</div>
                </div>
              )}
            </div>
          </div>

          {/* Direct Session Test */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Direct Supabase Session</h2>
            {sessionTest ? (
              <div className="space-y-2 font-mono text-sm">
                <div className={`p-2 rounded ${sessionTest.hasDirectSession ? 'bg-green-100' : 'bg-red-100'}`}>
                  <strong>Direct session:</strong> {sessionTest.hasDirectSession.toString()}
                </div>
                {sessionTest.hasDirectSession && (
                  <>
                    <div className="p-2 bg-blue-50 rounded">
                      <div><strong>User:</strong> {sessionTest.directSessionUser}</div>
                      <div><strong>Expires:</strong> {sessionTest.directSessionExpiry}</div>
                      <div><strong>Access token:</strong> {sessionTest.accessToken}</div>
                    </div>
                  </>
                )}
                {sessionTest.error && (
                  <div className="p-2 bg-red-100 rounded">
                    <strong>Error:</strong> {sessionTest.error}
                  </div>
                )}
              </div>
            ) : (
              <div>Loading...</div>
            )}
            
            <button
              onClick={refreshSession}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Refresh Session
            </button>
          </div>

          {/* Cookie Test */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Cookie & Storage Test</h2>
            {cookieTest ? (
              <div className="space-y-2 font-mono text-sm">
                <div className={`p-2 rounded ${cookieTest.hasCookies ? 'bg-green-100' : 'bg-red-100'}`}>
                  <strong>Has cookies:</strong> {cookieTest.hasCookies.toString()}
                </div>
                <div className="p-2 bg-gray-50 rounded">
                  <div><strong>Total cookies:</strong> {cookieTest.cookieCount}</div>
                  <div><strong>Supabase cookies:</strong> {cookieTest.supabaseCookieCount}</div>
                </div>
                {cookieTest.supabaseCookies.length > 0 && (
                  <div className="p-2 bg-blue-50 rounded">
                    <strong>Supabase cookies:</strong>
                    <ul className="mt-1 ml-4">
                      {cookieTest.supabaseCookies.map((cookie: string, i: number) => (
                        <li key={i} className="text-xs">{cookie}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="p-2 bg-gray-50 rounded">
                  <div><strong>LocalStorage items:</strong> {cookieTest.localStorage.itemCount}</div>
                  {cookieTest.localStorage.keys.length > 0 && (
                    <div className="text-xs mt-1">
                      Keys: {cookieTest.localStorage.keys.join(', ')}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div>Loading...</div>
            )}
          </div>

          {/* Actions */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Actions</h2>
            <div className="space-y-4">
              <button
                onClick={signOutAndIn}
                className="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Sign Out & Re-authenticate
              </button>
              
              <a
                href="/profil"
                className="block w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-center"
              >
                Try Access Profile Page
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 