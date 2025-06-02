'use client';

import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useState } from 'react';

export default function MigrateSessionPage() {
  const { user, session, isAuthenticated } = useAuth();
  const [migrationStatus, setMigrationStatus] = useState<string>('');

  const migrateSession = async () => {
    setMigrationStatus('Starting migration...');
    
    try {
      if (!session) {
        setMigrationStatus('❌ No session found to migrate');
        return;
      }

      // Get the current session data from localStorage
      const authToken = localStorage.getItem('sb-pfapdbddlnkcunvffwoi-auth-token');
      
      if (!authToken) {
        setMigrationStatus('❌ No auth token found in localStorage');
        return;
      }

      setMigrationStatus('📦 Found session in localStorage, migrating to cookies...');

      // Force a session refresh which will trigger the new storage mechanism
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        setMigrationStatus(`❌ Migration failed: ${error.message}`);
        return;
      }

      if (data.session) {
        setMigrationStatus('✅ Session migrated successfully! Checking cookies...');
        
        // Check if cookies are now set
        setTimeout(() => {
          const hasCookies = document.cookie.includes('sb-pfapdbddlnkcunvffwoi-auth-token');
          if (hasCookies) {
            setMigrationStatus('🎉 Migration complete! Session is now stored in cookies. You can now access protected pages.');
          } else {
            setMigrationStatus('⚠️ Migration completed but cookies not detected. You may need to sign out and sign back in.');
          }
        }, 1000);
      } else {
        setMigrationStatus('❌ Migration failed: No session returned');
      }

    } catch (error) {
      setMigrationStatus(`❌ Migration error: ${error}`);
    }
  };

  const signOutAndIn = async () => {
    setMigrationStatus('🔄 Signing out and redirecting to Google OAuth...');
    
    // Clear everything
    localStorage.clear();
    document.cookie.split(";").forEach(function(c) { 
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
    });
    
    await supabase.auth.signOut();
    
    setTimeout(() => {
      supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
    }, 1000);
  };

  const checkCurrentState = () => {
    const authToken = localStorage.getItem('sb-pfapdbddlnkcunvffwoi-auth-token');
    const hasCookies = document.cookie.includes('sb-pfapdbddlnkcunvffwoi-auth-token');
    
    return {
      hasLocalStorage: !!authToken,
      hasCookies: hasCookies,
      isAuthenticated: isAuthenticated,
      userEmail: user?.email
    };
  };

  const currentState = checkCurrentState();

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Session Migration</h1>
        
        <div className="grid gap-6">
          {/* Current State */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Current State</h2>
            <div className="space-y-2 font-mono text-sm">
              <div className={`p-2 rounded ${currentState.isAuthenticated ? 'bg-green-100' : 'bg-red-100'}`}>
                <strong>Authenticated:</strong> {currentState.isAuthenticated.toString()}
              </div>
              <div className={`p-2 rounded ${currentState.hasLocalStorage ? 'bg-yellow-100' : 'bg-gray-100'}`}>
                <strong>Has localStorage session:</strong> {currentState.hasLocalStorage.toString()}
              </div>
              <div className={`p-2 rounded ${currentState.hasCookies ? 'bg-green-100' : 'bg-red-100'}`}>
                <strong>Has cookie session:</strong> {currentState.hasCookies.toString()}
              </div>
              {currentState.userEmail && (
                <div className="p-2 bg-blue-50 rounded">
                  <strong>User:</strong> {currentState.userEmail}
                </div>
              )}
            </div>
          </div>

          {/* Migration Status */}
          {migrationStatus && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Migration Status</h2>
              <div className="p-3 bg-gray-50 rounded font-mono text-sm">
                {migrationStatus}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Migration Options</h2>
            
            {currentState.hasLocalStorage && !currentState.hasCookies ? (
              <div className="space-y-4">
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
                  <h3 className="font-semibold text-yellow-800 mb-2">Session Migration Needed</h3>
                  <p className="text-yellow-700 text-sm mb-3">
                    Your session is currently stored in localStorage, but the server needs it in cookies to work properly.
                  </p>
                  
                  <div className="space-y-2">
                    <button
                      onClick={migrateSession}
                      className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      🔄 Try Automatic Migration
                    </button>
                    
                    <button
                      onClick={signOutAndIn}
                      className="w-full bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
                    >
                      🔐 Sign Out & Re-authenticate (Recommended)
                    </button>
                  </div>
                </div>
              </div>
            ) : currentState.hasCookies ? (
              <div className="p-4 bg-green-50 border border-green-200 rounded">
                <h3 className="font-semibold text-green-800 mb-2">✅ Migration Complete!</h3>
                <p className="text-green-700 text-sm mb-3">
                  Your session is now properly stored in cookies. You should be able to access protected pages.
                </p>
                
                <a
                  href="/profil"
                  className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  🎯 Test Profile Page Access
                </a>
              </div>
            ) : (
              <div className="p-4 bg-red-50 border border-red-200 rounded">
                <h3 className="font-semibold text-red-800 mb-2">❌ No Session Found</h3>
                <p className="text-red-700 text-sm mb-3">
                  You need to sign in first.
                </p>
                
                <a
                  href="/login"
                  className="inline-block bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  🔐 Sign In
                </a>
              </div>
            )}
          </div>

          {/* Test Links */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Test Protected Pages</h2>
            <div className="grid grid-cols-2 gap-4">
              <a href="/profil" className="block bg-gray-200 p-3 rounded text-center hover:bg-gray-300">
                Profile
              </a>
              <a href="/parametres" className="block bg-gray-200 p-3 rounded text-center hover:bg-gray-300">
                Settings
              </a>
              <a href="/mes-annonces" className="block bg-gray-200 p-3 rounded text-center hover:bg-gray-300">
                My Ads
              </a>
              <a href="/favoris" className="block bg-gray-200 p-3 rounded text-center hover:bg-gray-300">
                Favorites
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 