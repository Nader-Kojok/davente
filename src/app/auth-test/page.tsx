'use client';

import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useState } from 'react';

export default function AuthTestPage() {
  const { user, profile, session, isLoading, isAuthenticated } = useAuth();
  const [testResults, setTestResults] = useState<any>(null);

  const runTests = async () => {
    console.log('Running authentication tests...');
    
    const results: any = {
      clientSession: null,
      serverSession: null,
      profileTest: null,
      cookieTest: null,
      timestamp: new Date().toISOString()
    };

    try {
      // Test 1: Get client-side session
      const { data: clientSessionData, error: clientError } = await supabase.auth.getSession();
      results.clientSession = {
        hasSession: !!clientSessionData.session,
        userId: clientSessionData.session?.user?.id,
        email: clientSessionData.session?.user?.email,
        expiresAt: clientSessionData.session?.expires_at,
        error: clientError?.message
      };

      // Test 2: Test profile access if we have a session
      if (clientSessionData.session) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', clientSessionData.session.user.id)
          .single();

        results.profileTest = {
          hasProfile: !!profileData,
          profileData: profileData,
          error: profileError?.message
        };
      }

      // Test 3: Check cookies
      if (typeof window !== 'undefined') {
        results.cookieTest = {
          allCookies: document.cookie,
          supabaseCookies: document.cookie
            .split(';')
            .filter(c => c.includes('supabase'))
            .map(c => c.trim())
        };
      }

    } catch (error) {
      console.error('Test error:', error);
      results.error = error;
    }

    setTestResults(results);
    console.log('Test results:', results);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Authentication Test Page</h1>
        
        <div className="grid gap-6">
          {/* Auth Context State */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Auth Context State</h2>
            <div className="space-y-2 font-mono text-sm">
              <div><strong>isLoading:</strong> {isLoading.toString()}</div>
              <div><strong>isAuthenticated:</strong> {isAuthenticated.toString()}</div>
              <div><strong>user:</strong> {user ? 'exists' : 'null'}</div>
              <div><strong>profile:</strong> {profile ? 'exists' : 'null'}</div>
              <div><strong>session:</strong> {session ? 'exists' : 'null'}</div>
              
              {user && (
                <div className="mt-4 p-3 bg-green-50 rounded">
                  <div><strong>User ID:</strong> {user.id}</div>
                  <div><strong>Email:</strong> {user.email}</div>
                  <div><strong>Created:</strong> {user.created_at}</div>
                </div>
              )}
              
              {profile && (
                <div className="mt-4 p-3 bg-blue-50 rounded">
                  <div><strong>Profile Name:</strong> {profile.name}</div>
                  <div><strong>Profile Email:</strong> {profile.email}</div>
                  <div><strong>Active:</strong> {profile.is_active?.toString()}</div>
                </div>
              )}
              
              {session && (
                <div className="mt-4 p-3 bg-purple-50 rounded">
                  <div><strong>Token Type:</strong> {session.token_type}</div>
                  <div><strong>Expires At:</strong> {new Date(session.expires_at! * 1000).toLocaleString()}</div>
                </div>
              )}
            </div>
          </div>
          
          {/* Test Runner */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Manual Tests</h2>
            <button
              onClick={runTests}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Run Authentication Tests
            </button>
            
            {testResults && (
              <div className="mt-6">
                <h3 className="font-semibold mb-3">Test Results:</h3>
                <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto max-h-96">
                  {JSON.stringify(testResults, null, 2)}
                </pre>
              </div>
            )}
          </div>
          
          {/* Navigation Test */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Navigation Test</h2>
            <div className="space-y-2">
              <a href="/profil" className="block bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-center">
                Go to Profile Page (Direct Link)
              </a>
              <button
                onClick={() => window.location.href = '/profil'}
                className="block w-full bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
              >
                Go to Profile Page (JavaScript)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 